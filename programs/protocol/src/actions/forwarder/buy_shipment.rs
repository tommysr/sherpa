use anchor_lang::{prelude::*, solana_program::system_instruction};

use crate::{ForwardedShipment, Error, Forwarder, Shipment, ShipmentTransferred, Shipper};

#[derive(Accounts)]
pub struct BuyShipment<'info> {
    #[account(init,
        seeds = [b"forwarded", forwarder.load().unwrap().creator.as_ref(), &forwarder.load().unwrap().count.to_le_bytes()], bump,
        payer = payer,
        space = 8 + std::mem::size_of::<ForwardedShipment>()
    )]
    pub bought: AccountLoader<'info, ForwardedShipment>,
    #[account(mut,
        seeds = [b"shipment", shipper.load().unwrap().authority.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    #[account(mut, 
        seeds = [b"shipper", shipper.load().unwrap().authority.as_ref()], bump,
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut, 
        seeds = [b"forwarder", forwarder.load().unwrap().creator.as_ref()], bump,
        constraint = forwarder.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut,
        constraint = shipment_owner.key() == shipment.load().unwrap().shipper @ Error::InvalidShipperAccount,
    )]
    /// CHECK: The account of the shipper
    pub shipment_owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyShipment>) -> Result<()> {
    let forwarded = &mut ctx.accounts.bought.load_init()?;
    let shipment = &mut ctx.accounts.shipment.load_mut()?;
    let forwarder = &mut ctx.accounts.forwarder.load_mut()?;

    // Check if the shipment is for sale
    require_neq!(shipment.forwarder, shipment.shipper , Error::ShipmentNotForSale);
    require_eq!(shipment.forwarder, Pubkey::default(), Error::ShipmentSold);
    require_eq!(shipment.carrier, Pubkey::default(), Error::ShipmentSold);

    // Update owner
    shipment.forwarder = forwarder.creator;

    // Check if the buyer has enough funds
    require_gte!(ctx.accounts.signer.get_lamports(), shipment.price, Error::NotEnoughFunds);

    // Create forwarded shipment
    **forwarded = ForwardedShipment {
        forwarder: forwarder.creator,
        shipment: ctx.accounts.shipment.key(),
        resell_price: u64::MAX,
        no: forwarder.count,
        reserved: [0; 4],
    };

    forwarder.count += 1;

    emit!(ShipmentTransferred {
        seller: ctx.accounts.shipper.key(),
        buyer: ctx.accounts.forwarder.key(),
        before: ctx.accounts.shipment.key(),
        after: ctx.accounts.bought.key(),
    });


    // Invoke the transfer instruction
    let transfer_instruction = system_instruction::transfer(ctx.accounts.payer.key, ctx.accounts.shipment_owner.key, shipment.price);

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.shipment_owner.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    Ok(())
}

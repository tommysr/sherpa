use anchor_lang::prelude::*;

use crate::{BoughtShipment, Error, Forwarder, Shipment, ShipmentTransferred, Shipper};

#[derive(Accounts)]
pub struct BuyShipment<'info> {
    #[account(init,
        seeds = [b"forwarded", forwarder.load().unwrap().creator.as_ref(), &forwarder.load().unwrap().count.to_le_bytes()], bump,
        payer = signer,
        space = 8 + std::mem::size_of::<BoughtShipment>()
    )]
    pub bought: AccountLoader<'info, BoughtShipment>,
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
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyShipment>) -> Result<()> {
    let forwarded = &mut ctx.accounts.bought.load_init()?;
    let shipment = &mut ctx.accounts.shipment.load_mut()?;
    let shipper = &mut ctx.accounts.shipper.load_mut()?;
    let forwarder = &mut ctx.accounts.forwarder.load_mut()?;

    shipment.owner = *ctx.accounts.signer.key;

    **forwarded = BoughtShipment {
        creator: shipper.creator,
        buyer: ctx.accounts.signer.key(),
        owner: ctx.accounts.signer.key(),
        no: forwarder.count,
        reserved: [0; 4],
        shipment: shipment.shipment,
    };

    forwarder.count += 1;

    emit!(ShipmentTransferred {
        seller: ctx.accounts.shipper.key(),
        buyer: ctx.accounts.forwarder.key(),
        before: ctx.accounts.shipment.key(),
        after: ctx.accounts.bought.key(),
    });

    Ok(())
}

use anchor_lang::{prelude::*, solana_program::system_instruction::transfer};

use crate::{
    AcceptedOffer, Error, Shipment, ShipmentDelivered, ShipmentStatusUpdated, Shipper, State,
};

#[derive(Accounts)]
pub struct Confirm<'info> {
    #[account(mut,
        seeds = [b"task", task.load().unwrap().owner.as_ref(), &task.load().unwrap().no.to_le_bytes()], bump,
    )]
    pub task: AccountLoader<'info, AcceptedOffer>,
    #[account(mut,
        seeds = [b"shipment", shipment.load().unwrap().shipper.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    #[account(mut,
        seeds = [b"shipper", shipper.load().unwrap().creator.as_ref()], bump,
        constraint = shipper.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority,
        constraint = shipper.load().unwrap().creator == shipment.load().unwrap().shipper @ Error::SignerNotAnAuthority
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut,
        constraint = shipment.load().unwrap().shipper == *shipper_owner.key @ Error::SignerNotAnAuthority
    )]
    /// CHECK: can be any account
    pub shipper_owner: AccountInfo<'info>,
    #[account(mut,
        constraint = shipment.load().unwrap().forwarder == *forwarder_owner.key @ Error::SignerNotAnAuthority
    )]
    /// CHECK: can be any account
    pub forwarder_owner: AccountInfo<'info>,
    #[account(mut,
        constraint = shipment.load().unwrap().carrier == *carrier_owner.key @ Error::SignerNotAnAuthority
    )]
    /// CHECK: can be any account
    pub carrier_owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    #[account(seeds = [b"state".as_ref()], bump)]
    pub state: AccountLoader<'info, State>,
}

pub fn handler(ctx: Context<Confirm>) -> Result<()> {
    let (price, payment, collateral, penalty) = {
        let task = &mut ctx.accounts.task.load_mut()?;
        let shipment = &mut ctx.accounts.shipment.load_mut()?;

        shipment.status = 5;
        task.reserved[0] = 1;

        emit!(ShipmentStatusUpdated {
            shipment: ctx.accounts.shipment.key(),
            status: shipment.status,
        });

        emit!(ShipmentDelivered {
            shipment: ctx.accounts.shipment.key(),
            status: shipment.status,
        });

        (
            shipment.price,
            task.details.payment,
            shipment.shipment.collateral,
            shipment.shipment.penalty,
        )
    };

    transfer(
        &ctx.accounts.shipment.key(),
        &ctx.accounts.carrier_owner.key(),
        collateral + payment,
    );

    transfer(
        &ctx.accounts.shipment.key(),
        &ctx.accounts.forwarder_owner.key(),
        penalty + price - payment,
    );

    Ok(())
}

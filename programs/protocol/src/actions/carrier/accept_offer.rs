use anchor_lang::prelude::*;

use crate::{
    AcceptedOffer, BoughtShipment, Carrier, Error, Forwarder, OfferAccepted, ShipmentOffer,
};

#[derive(Accounts)]
pub struct AcceptOffer<'info> {
    #[account(init,
        seeds = [b"task", carrier.load().unwrap().creator.as_ref(), &carrier.load().unwrap().tasks_count.to_le_bytes()], bump,
        payer = signer,
        space = 8 + std::mem::size_of::<AcceptedOffer>()
    )]
    pub task: AccountLoader<'info, AcceptedOffer>,
    #[account(mut,
        seeds = [b"offer", carrier.load().unwrap().creator.as_ref(), &offer.load().unwrap().no.to_le_bytes()], bump,
        // close = signer,
    )]
    pub offer: AccountLoader<'info, ShipmentOffer>,
    #[account(mut,
        seeds = [b"forwarded", forwarder.load().unwrap().creator.as_ref(), &offer.load().unwrap().shipment_no.to_le_bytes()], bump,
    )]
    pub shipment: AccountLoader<'info, BoughtShipment>,
    #[account(mut,
        seeds = [b"forwarder", forwarder.load().unwrap().creator.as_ref()], bump,
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut,
        seeds = [b"carrier", carrier.load().unwrap().creator.as_ref()], bump,
        constraint = carrier.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub carrier: AccountLoader<'info, Carrier>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AcceptOffer>) -> Result<()> {
    let task = &mut ctx.accounts.task.load_init()?;
    let offer = &mut ctx.accounts.offer.load_mut()?;
    let carrier = &mut ctx.accounts.carrier.load_mut()?;
    let shipment = &mut ctx.accounts.shipment.load_mut()?;

    require_eq!(shipment.buyer, shipment.owner, Error::ShipmentSold);

    shipment.owner = carrier.creator;

    **task = AcceptedOffer {
        owner: carrier.creator,
        details: offer.details,
        shipment: shipment.shipment,
        no: carrier.tasks_count,
        accepted: Clock::get()?.unix_timestamp,
        reserved: [0; 4],
    };

    carrier.tasks_count += 1;

    emit!(OfferAccepted {
        from: shipment.buyer,
        to: shipment.owner,
        offer: ctx.accounts.offer.key(),
    });

    Ok(())
}

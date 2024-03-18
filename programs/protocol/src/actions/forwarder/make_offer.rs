use anchor_lang::prelude::*;

use crate::{BoughtShipment, Carrier, Error, Forwarder, OfferDetails, OfferMade, ShipmentOffer};

#[derive(Accounts)]
pub struct MakeOffer<'info> {
    #[account(init,
        // Potentially DoSable
        seeds = [b"offer", carrier.load().unwrap().creator.as_ref(), &carrier.load().unwrap().offers_count.to_le_bytes()], bump,
        payer = signer,
        space = 8 + std::mem::size_of::<ShipmentOffer>()
    )]
    pub offer: AccountLoader<'info, ShipmentOffer>,
    #[account(mut,
        seeds = [b"forwarded", forwarder.load().unwrap().creator.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
        constraint = shipment.load().unwrap().buyer == *signer.key @ Error::SignerNotAnOwner,
    )]
    pub shipment: AccountLoader<'info, BoughtShipment>,
    #[account(mut,
        seeds = [b"forwarder", forwarder.load().unwrap().creator.as_ref()], bump,
        constraint = forwarder.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut,
        seeds = [b"carrier", carrier.load().unwrap().creator.as_ref()], bump,
    )]
    pub carrier: AccountLoader<'info, Carrier>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<MakeOffer>, payment: u64, timeout: u32) -> Result<()> {
    let offer = &mut ctx.accounts.offer.load_init()?;
    let carrier = &mut ctx.accounts.carrier.load_mut()?;
    let shipment = &mut ctx.accounts.shipment.load_mut()?;

    require_eq!(shipment.buyer, shipment.owner, Error::ShipmentSold);

    let now = Clock::get()?.unix_timestamp;

    **offer = ShipmentOffer {
        owner: carrier.creator,
        details: OfferDetails {
            payment,
            collateral: 0,
            deadline: u64::MAX,
        },
        shipment: shipment.shipment,
        submitted: now,
        timeout: now + timeout as i64,
        no: carrier.offers_count,
        shipment_no: shipment.no,
    };

    carrier.offers_count += 1;

    emit!(OfferMade {
        from: ctx.accounts.forwarder.load()?.creator,
        to: carrier.creator,
        offer: ctx.accounts.offer.key(),
    });

    Ok(())
}

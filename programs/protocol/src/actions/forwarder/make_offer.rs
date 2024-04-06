use anchor_lang::prelude::*;

use crate::{Carrier, Error, Forwarder, OfferDetails, OfferMade, Shipment, ShipmentOffer};

#[derive(Accounts)]
pub struct MakeOffer<'info> {
    #[account(init,
        // Potentially DoSable
        seeds = [b"offer", carrier.load().unwrap().creator.as_ref(), &carrier.load().unwrap().offers_count.to_le_bytes()], bump,
        payer = payer,
        space = 8 + std::mem::size_of::<ShipmentOffer>()
    )]
    pub offer: AccountLoader<'info, ShipmentOffer>,
    #[account(mut,
        seeds = [b"shipment", shipment.load().unwrap().shipper.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
        constraint = shipment.load().unwrap().forwarder == *signer.key @ Error::SignerNotAnOwner,
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    #[account(mut,
        seeds = [b"forwarder", forwarder.load().unwrap().creator.as_ref()], bump,
        constraint = forwarder.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut,
        seeds = [b"carrier", carrier.load().unwrap().creator.as_ref()], bump,
    )]
    pub carrier: AccountLoader<'info, Carrier>,
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<MakeOffer>, payment: u64, timeout: u32) -> Result<()> {
    let offer = &mut ctx.accounts.offer.load_init()?;
    let carrier = &mut ctx.accounts.carrier.load_mut()?;
    let forwarder = &mut ctx.accounts.forwarder.load_mut()?;
    let shipment = &mut ctx.accounts.shipment.load_mut()?;

    require_eq!(shipment.carrier, Pubkey::default(), Error::ShipmentSold);
    shipment.status = 3;

    let now = Clock::get()?.unix_timestamp;

    **offer = ShipmentOffer {
        offeror: forwarder.creator,
        details: OfferDetails {
            payment,
            collateral: 0,
            deadline: u64::MAX,
        },
        shipment: ctx.accounts.shipment.key(),
        submitted: now,
        timeout: now + timeout as i64,
        no: carrier.offers_count,
        reserved: [0; 4],
    };

    carrier.offers_count += 1;

    emit!(OfferMade {
        from: forwarder.creator,
        to: carrier.creator,
        offer: ctx.accounts.offer.key(),
        shipment: ctx.accounts.shipment.key(),
    });

    Ok(())
}

use anchor_lang::prelude::*;

use crate::{BoughtShipment, Carrier, Error, Forwarder, OfferDetails, ShipmentOffer};

#[derive(Accounts)]
pub struct MakeOffer<'info> {
    #[account(init,
        // Potentially DoSable
        seeds = [b"offer", carrier.load().unwrap().creator.as_ref(), &carrier.load().unwrap().offers.to_le_bytes()], bump,
        payer = signer,
        space = 8 + std::mem::size_of::<ShipmentOffer>()
    )]
    pub offer: AccountLoader<'info, ShipmentOffer>,
    #[account(mut,
        seeds = [b"forwarded", forwarder.load().unwrap().creator.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
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

    require_eq!(
        shipment.buyer,
        *ctx.accounts.signer.key,
        Error::ShipmentSold
    );

    require_eq!(
        shipment.buyer,
        *ctx.accounts.signer.key,
        Error::SignerNotAnOwner
    );

    shipment.owner = carrier.creator;

    **offer = ShipmentOffer {
        owner: carrier.creator,
        details: OfferDetails {
            payment,
            collateral: 0,
            deadline: u64::MAX,
        },
        shipment: shipment.shipment,
        submitted: Clock::get()?.unix_timestamp,
        timeout,
        no: carrier.offers,
    };

    carrier.offers += 1;

    Ok(())
}

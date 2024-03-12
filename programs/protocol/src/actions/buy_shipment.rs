use anchor_lang::prelude::*;

use crate::{Error, Forwarder, Shipment, Shipper};

#[derive(Accounts)]
pub struct BuyShipment<'info> {
    #[account(mut,
        seeds = [b"shipment", shipper.load().unwrap().authority.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    #[account(mut, 
        seeds = [b"shipper", shipper.load().unwrap().authority.as_ref()], bump,
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut, 
        seeds = [b"forwarder", forwarder.load().unwrap().authority.as_ref()], bump,
        constraint = forwarder.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyShipment>) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment.load_mut()?;

    shipment.owner = *ctx.accounts.signer.key;

    Ok(())
}

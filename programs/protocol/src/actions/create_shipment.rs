use anchor_lang::prelude::*;

use crate::{Error, Shipper, Shipment};

#[derive(Accounts)]
pub struct CreateShipment<'info> {
    #[account(init,
        seeds = [b"shipment", signer.to_account_info().key.as_ref(), &shipper.load().unwrap().count.to_le_bytes()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Shipment>()
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    #[account(mut, 
        seeds = [b"shipper", signer.to_account_info().key.as_ref()], bump,
        constraint = shipper.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateShipment>, shipment: Shipment) -> Result<()> {
    let shipper = &mut ctx.accounts.shipper.load_mut()?;
    let account = &mut ctx.accounts.shipment.load_init()?;

    **account = shipment;
    shipper.count += 1;

    Ok(())
}

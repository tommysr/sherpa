use anchor_lang::prelude::*;

use crate::Shipper;

#[derive(Accounts)]
pub struct RegisterShipper<'info> {
    #[account(init,
        seeds = [b"shipper", signer.to_account_info().key.as_ref()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Shipper>()
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterShipper>) -> Result<()> {
    let state = &mut ctx.accounts.shipper.load_init()?;

    **state = Shipper {};

    Ok(())
}

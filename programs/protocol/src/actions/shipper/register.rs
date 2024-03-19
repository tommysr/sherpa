use anchor_lang::prelude::*;

use crate::{Name, Shipper};

#[derive(Accounts)]
pub struct RegisterShipper<'info> {
    #[account(init,
        seeds = [b"shipper", signer.key.as_ref()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Shipper>()
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterShipper>, name: Name) -> Result<()> {
    let account = &mut ctx.accounts.shipper.load_init()?;

    **account = Shipper {
        creator: *ctx.accounts.signer.key,
        authority: *ctx.accounts.signer.key,
        name,
        count: 0,
    };

    Ok(())
}

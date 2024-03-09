use anchor_lang::prelude::*;

use crate::Forwarder;

#[derive(Accounts)]
pub struct RegisterForwarder<'info> {
    #[account(init,
        seeds = [b"forwarder", signer.to_account_info().key.as_ref()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Forwarder>()
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterForwarder>) -> Result<()> {
    let account = &mut ctx.accounts.forwarder.load_init()?;

    **account = Forwarder {
        authority: *ctx.accounts.signer.key,
    };

    Ok(())
}

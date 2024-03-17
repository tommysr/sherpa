use anchor_lang::prelude::*;

use crate::{Forwarder, Name};

#[derive(Accounts)]
pub struct RegisterForwarder<'info> {
    #[account(init,
        seeds = [b"forwarder", signer.key.as_ref()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Forwarder>()
    )]
    pub forwarder: AccountLoader<'info, Forwarder>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterForwarder>, name: Name) -> Result<()> {
    let account = &mut ctx.accounts.forwarder.load_init()?;

    **account = Forwarder {
        creator: ctx.accounts.signer.key(),
        authority: ctx.accounts.signer.key(),
        name,
        count: 0,
    };

    Ok(())
}

use anchor_lang::prelude::*;

use crate::State;

#[derive(Accounts)]
pub struct InitializeState<'info> {
    #[account(init, seeds = [b"state".as_ref()], bump, payer = payer, space = 8 + std::mem::size_of::<State>())]
    pub state: AccountLoader<'info, State>,
    pub admin: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeState>) -> Result<()> {
    let account = &mut ctx.accounts.state.load_init()?;

    **account = State {
        admin: *ctx.accounts.admin.key,
    };

    Ok(())
}

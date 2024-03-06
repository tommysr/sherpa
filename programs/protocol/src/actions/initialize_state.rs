use anchor_lang::prelude::*;

use crate::State;

#[derive(Accounts)]
pub struct InitializeState<'info> {
    #[account(init, seeds = [b"state".as_ref()], bump, payer = admin, space = 8 + std::mem::size_of::<State>())]
    pub state: AccountLoader<'info, State>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeState>) -> Result<()> {
    let account = &mut ctx.accounts.state.load_init()?;

    **account = State {
        admin: *ctx.accounts.admin.key,
    };

    Ok(())
}

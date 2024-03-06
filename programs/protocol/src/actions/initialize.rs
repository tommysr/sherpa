use anchor_lang::prelude::*;

use crate::State;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, seeds = [b"state".as_ref()], bump, payer = admin, space = 8 + std::mem::size_of::<State>())]
    pub state: AccountLoader<'info, State>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let state = &mut ctx.accounts.state.load_init()?;

    **state = State {
        admin: *ctx.accounts.admin.key,
    };

    Ok(())
}

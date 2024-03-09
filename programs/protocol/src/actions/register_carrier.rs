use anchor_lang::prelude::*;

use crate::{Availability, Carrier};


#[derive(Accounts)]
pub struct RegisterCarrier<'info> {
    #[account(init,
        seeds = [b"carrier", signer.key.as_ref()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Carrier>()
    )]
    pub carrier: AccountLoader<'info, Carrier>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterCarrier>, availability: Option<Availability>) -> Result<()> {
    let account = &mut ctx.accounts.carrier.load_init()?;

    **account = Carrier {
        authority: *ctx.accounts.signer.key,
        availability: availability.unwrap_or_default()
    };

    Ok(())
}

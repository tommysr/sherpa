use anchor_lang::prelude::*;

use crate::{Availability, Carrier, Name};


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

pub fn handler(ctx: Context<RegisterCarrier>, name: Name, availability: Option<Availability>) -> Result<()> {
    let account = &mut ctx.accounts.carrier.load_init()?;

    **account = Carrier {
        creator: *ctx.accounts.signer.key,
        authority: *ctx.accounts.signer.key,
        name,
        availability: availability.unwrap_or_default(),
        offers_count: 0,
        tasks_count: 0,
    };

    Ok(())
}

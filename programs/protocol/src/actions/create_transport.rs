use anchor_lang::prelude::*;

use crate::{Error, Shipper, Transport};

#[derive(Accounts)]
pub struct CreateTransport<'info> {
    #[account(init,
        seeds = [b"transport", signer.to_account_info().key.as_ref(), &shipper.load().unwrap().count.to_le_bytes()], bump,
        payer = signer, 
        space = 8 + std::mem::size_of::<Transport>()
    )]
    pub transport: AccountLoader<'info, Transport>,
    #[account(mut, 
        seeds = [b"shipper", signer.to_account_info().key.as_ref()], bump,
        constraint = shipper.load().unwrap().authority == *signer.key @ Error::SignerNotAnAuthority
    )]
    pub shipper: AccountLoader<'info, Shipper>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateTransport>, transport: Transport) -> Result<()> {
    let account = &mut ctx.accounts.transport.load_init()?;

    **account = transport;

    Ok(())
}

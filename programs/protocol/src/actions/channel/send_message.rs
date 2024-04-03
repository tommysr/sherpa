use anchor_lang::prelude::*;

use crate::{Error, Name, Public, Shipment};

#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(mut,
        seeds = [b"shipment", shipment.load().unwrap().shipper.as_ref(), &shipment.load().unwrap().no.to_le_bytes()], bump,
    )]
    pub shipment: AccountLoader<'info, Shipment>,
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

pub fn handler(ctx: Context<SendMessage>, key: Public, message: Name) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment.load_mut()?;
    let signer = ctx.accounts.signer.key;

    if signer == &shipment.shipper {
        shipment.channel.shipper = key;
    } else if signer == &shipment.carrier {
        shipment.channel.carrier = key;
    } else {
        return Err(Error::SignerNotInChannel.into());
    }

    shipment.channel.data = message;

    Ok(())
}

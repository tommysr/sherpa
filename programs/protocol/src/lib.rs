mod actions;
mod data;

use actions::*;
use data::*;

use anchor_lang::prelude::*;

declare_id!("91kcQgtnkTYUAddsMZJtMMhifxQgfZEVPqyEMzEaoFT5");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        actions::initialize::handler(ctx)
        // Ok(())
    }
}

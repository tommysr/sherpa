mod actions;
mod data;

use actions::*;
use data::*;

use anchor_lang::prelude::*;

declare_id!("91kcQgtnkTYUAddsMZJtMMhifxQgfZEVPqyEMzEaoFT5");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize_state(ctx: Context<InitializeState>) -> Result<()> {
        actions::initialize_state::handler(ctx)
    }

    pub fn register_shipper(ctx: Context<RegisterShipper>) -> Result<()> {
        crate::actions::register_shipper::handler(ctx)
    }
}

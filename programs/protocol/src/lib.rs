mod actions;
mod data;
mod errors;

use actions::*;
use data::*;
use errors::Error;

use anchor_lang::prelude::*;

declare_id!("91kcQgtnkTYUAddsMZJtMMhifxQgfZEVPqyEMzEaoFT5");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize_state(ctx: Context<InitializeState>) -> Result<()> {
        actions::initialize_state::handler(ctx)
    }

    pub fn register_shipper(ctx: Context<RegisterShipper>) -> Result<()> {
        actions::register_shipper::handler(ctx)
    }

    pub fn create_transport(ctx: Context<CreateTransport>, transport: Transport) -> Result<()> {
        actions::create_transport::handler(ctx, transport)
    }
}

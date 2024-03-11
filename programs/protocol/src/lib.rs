mod actions;
mod data;
mod errors;

use actions::*;
use data::*;
use errors::Error;

use anchor_lang::prelude::*;

declare_id!("82VDeeUheGof2qZ7gM8sTCFLB3xoqFexF7uxet7Cv9N3");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize_state(ctx: Context<InitializeState>) -> Result<()> {
        actions::initialize_state::handler(ctx)
    }

    pub fn register_shipper(ctx: Context<RegisterShipper>) -> Result<()> {
        actions::register_shipper::handler(ctx)
    }

    pub fn register_forwarder(ctx: Context<RegisterForwarder>) -> Result<()> {
        actions::register_forwarder::handler(ctx)
    }

    pub fn register_carrier(
        ctx: Context<RegisterCarrier>,
        availability: Option<Availability>,
    ) -> Result<()> {
        actions::register_carrier::handler(ctx, availability)
    }

    pub fn create_shipment(
        ctx: Context<CreateShipment>,
        price: u64,
        shipment: ShipmentData,
    ) -> Result<()> {
        actions::create_shipment::handler(ctx, price, shipment)
    }

    pub fn buy_shipment(ctx: Context<BuyShipment>) -> Result<()> {
        actions::buy_shipment::handler(ctx)
    }
}

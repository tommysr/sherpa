mod actions;
mod data;
mod errors;
mod events;

use actions::*;
use data::*;
use errors::Error;
use events::*;

use anchor_lang::prelude::*;

declare_id!("2N6nkQuZw64wmLgg3Vj4PMUi6Vv9QLyZc7oVZH5a9aZ1");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize_state(ctx: Context<InitializeState>) -> Result<()> {
        actions::initialize_state::handler(ctx)
    }

    pub fn register_shipper(ctx: Context<RegisterShipper>, name: Name) -> Result<()> {
        actions::shipper::register::handler(ctx, name)
    }

    pub fn register_forwarder(ctx: Context<RegisterForwarder>, name: Name) -> Result<()> {
        actions::forwarder::register::handler(ctx, name)
    }

    pub fn register_carrier(
        ctx: Context<RegisterCarrier>,
        name: Name,
        availability: Option<Availability>,
    ) -> Result<()> {
        actions::carrier::register::handler(ctx, name, availability)
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

    pub fn create_offer(ctx: Context<CreateOffer>, payment: u64) -> Result<()> {
        actions::create_offer::handler(ctx, payment)
    }
}

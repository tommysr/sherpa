use anchor_lang::prelude::*;

#[event]
pub struct ShipmentTransferred {
    pub seller: Pubkey,
    pub buyer: Pubkey,
    pub before: Pubkey,
    pub after: Pubkey,
}

#[event]
pub struct ShipmentCreated {
    pub shipper: Pubkey,
    pub shipment: Pubkey,
}

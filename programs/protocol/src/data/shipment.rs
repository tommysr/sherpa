use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct ShipmentDetails {
    priority: u8,
    fragility: u8,
    access: u8,
    reserved: [u8; 5], // size is excessive, but required for bytemuck
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct ShipmentDimensions {
    pub weight: u32,
    pub width: u32,  // interpret as volume of other dimensions are 0
    pub height: u32, // [cm]
    pub depth: u32,  // [cm]
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Coordinates {
    pub latitude: f32,
    pub longitude: f32,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Shipment {
    pub from: Coordinates,
    pub to: Coordinates,
    pub dimensions: ShipmentDimensions,
    pub when: u64,
    pub deadline: u64,
    pub shipment_details: ShipmentDetails,
}

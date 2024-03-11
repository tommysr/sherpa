use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct ShipmentDetails {
    count: u16,
    priority: u8,
    fragility: u8,
    access: u8,
    reserved: [u8; 3], // size is excessive, but required for bytemuck
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct ShipmentDimensions {
    pub weight: u32, // [g]
    pub width: u32,  // interpret as volume of other dimensions are 0
    pub height: u32, // [mm]
    pub depth: u32,  // [mm]
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct GeoLocation {
    pub latitude: f32,
    pub longitude: f32,
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Geography {
    pub from: GeoLocation,
    pub to: GeoLocation,
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct ShipmentData {
    pub geography: Geography,
    pub details: ShipmentDetails,
    pub dimensions: ShipmentDimensions,
    pub when: u64,
    pub deadline: u64,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq)]
pub struct Shipment {
    pub owner: Pubkey,
    pub shipper: Pubkey,
    pub price: u64,
    pub no: u32,
    pub reserved: [u8; 4],
    pub shipment: ShipmentData,
}

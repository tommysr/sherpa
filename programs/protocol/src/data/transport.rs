use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

#[derive(Debug, Clone, Default, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u8)]
pub enum TransportType {
    #[default]
    Regular = 0,
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct TransportDimensions {
    pub weight: u32,
    pub volume: u32,
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Coordinates {
    pub latitude: f32,
    pub longitude: f32,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Transport {
    pub from: Coordinates,
    pub to: Coordinates,
    pub dimensions: TransportDimensions,
    pub when: u64,
    pub transport_type: [u8; 8], // size is excessive, but required for bytemuck
}

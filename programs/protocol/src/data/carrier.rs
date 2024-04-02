use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

use crate::{GeoLocation, Name};

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Availability {
    pub time: u64, // when 0, carrier is not available
    pub location: GeoLocation,
    pub location_name: Name,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Carrier {
    pub creator: Pubkey,
    pub authority: Pubkey,
    pub name: Name,
    pub availability: Availability,
    pub offers_count: u32,
    pub tasks_count: u32,
}

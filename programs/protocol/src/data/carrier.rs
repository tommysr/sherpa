use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

use crate::GeoLocation;

#[zero_copy]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Availability {
    pub time: u64, // when 0, carrier is not available
    pub location: GeoLocation,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct Carrier {
    pub authority: Pubkey,
    pub availability: Availability,
}

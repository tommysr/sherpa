use anchor_lang::prelude::*;

use crate::ShipmentData;

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq)]
pub struct ShipmentOffer {
    pub owner: Pubkey,
    pub payment: u64,
    pub collateral: u64,
    pub deadline: u64,
    pub shipment: ShipmentData,
}

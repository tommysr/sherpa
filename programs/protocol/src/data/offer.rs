use anchor_lang::prelude::*;

#[zero_copy]
#[derive(Debug, Default, PartialEq, Eq)]
pub struct OfferDetails {
    pub payment: u64,
    pub collateral: u64,
    pub deadline: u64,
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq)]
pub struct ShipmentOffer {
    pub offeror: Pubkey,
    pub shipment: Pubkey,
    pub details: OfferDetails,
    pub submitted: i64,
    pub timeout: i64,
    pub no: u32,
    pub reserved: [u8; 4],
}

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq)]
pub struct AcceptedOffer {
    pub owner: Pubkey,
    pub shipment: Pubkey,
    pub details: OfferDetails,
    pub accepted: i64,
    pub no: u32,
    pub reserved: [u8; 4],
}

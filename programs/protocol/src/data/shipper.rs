use anchor_lang::prelude::*;

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, Eq)]
pub struct Shipper {
    pub authority: Pubkey,
    pub count: u32,
}

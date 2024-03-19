use anchor_lang::prelude::*;

use crate::Name;

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, Eq)]
pub struct Forwarder {
    pub creator: Pubkey,
    pub authority: Pubkey,
    pub name: Name,
    pub count: u32,
}

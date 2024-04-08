use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};
use uint::construct_uint;

use crate::Message;

construct_uint! {
    pub struct Key(4); // 4 * 64bit = 256 bit
}

#[zero_copy]
#[derive(Debug, PartialEq, BorshSerialize, BorshDeserialize, Eq)]
pub struct Public {
    pub value: [u8; 256],
}

#[zero_copy]
#[derive(Debug, Default, PartialEq, Eq)]
pub struct Channel {
    pub shipper: Public,
    pub carrier: Public,
    pub data: Message,
}

impl Default for Public {
    fn default() -> Self {
        Public { value: [0; 256] }
    }
}

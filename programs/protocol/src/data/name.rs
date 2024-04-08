use anchor_lang::prelude::{
    borsh::{BorshDeserialize, BorshSerialize},
    *,
};

#[zero_copy]
#[derive(Debug, PartialEq, BorshSerialize, BorshDeserialize, Eq)]
pub struct Name {
    pub value: [u8; 64],
}

#[zero_copy]
#[derive(Debug, PartialEq, BorshSerialize, BorshDeserialize, Eq)]
pub struct Message {
    pub value: [u8; 256],
}

impl Default for Name {
    fn default() -> Self {
        Name { value: [0; 64] }
    }
}

impl Default for Message {
    fn default() -> Self {
        Message { value: [0; 256] }
    }
}

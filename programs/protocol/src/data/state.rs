use anchor_lang::prelude::*;

#[account(zero_copy)]
#[derive(Debug, Default, PartialEq, Eq)]
pub struct State {
    pub admin: Pubkey,
}

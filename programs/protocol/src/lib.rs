use anchor_lang::prelude::*;

declare_id!("5QBudxMGUXjZ4kQHEa7XvsG8m2bZA19xoPJqwJ7QnW7R");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

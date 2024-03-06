use anchor_lang::prelude::*;

#[error_code]
pub enum Error {
    #[msg("Signer is not an authority of the shipper")]
    SignerNotAnAuthority = 0, // 1770
}

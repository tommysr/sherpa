use anchor_lang::prelude::*;

#[error_code]
pub enum Error {
    #[msg("Signer is not an authority of the shipper")]
    SignerNotAnAuthority = 0, // 1770
    #[msg("Shipper is not the signer")]
    ShipperNotASigner = 1, // 1771
    #[msg("Invalid shipment number")]
    InvalidShipmentNumber = 2, // 1772
    #[msg("Signer is not an owner of the shipment")]
    SignerNotAnOwner = 3, // 1773
    #[msg("Shipment is already sold")]
    ShipmentSold = 4, // 1774
}

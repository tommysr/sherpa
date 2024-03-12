import { type Protocol } from '$utils/idl/types/protocol';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export const STATE_SEED = 'state';
export const SHIPPER_SEED = 'shipper';
export const TRANSPORT_SEED = 'shipment';

export const getStateAddressWithBump = (program: Program<Protocol>): [PublicKey, number] => {
	const [stateAddress, stateBump] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
		program.programId
	);
	return [stateAddress, stateBump];
};

export const getShipperAddress = (program: Program<Protocol>, shipper: PublicKey) => {
	const [shipperAddress, shipperBump] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(SHIPPER_SEED)), shipper.toBuffer()],
		program.programId
	);
	return shipperAddress;
};

export const getShipmentAddress = (
	program: Program<Protocol>,
	shipper: PublicKey,
	index: number
) => {
	const indexBuffer = Buffer.alloc(4);
	indexBuffer.writeInt32LE(index);

	const [shipmentAddress, shipmentBump] = PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode(TRANSPORT_SEED)), shipper.toBuffer(), indexBuffer],
		program.programId
	);

	return shipmentAddress;
};

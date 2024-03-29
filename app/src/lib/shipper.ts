import { getShipperAddress } from '$sdk/sdk';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { Program } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';

export const fetchShipperAccount = async (program: Program<Protocol>, owner: PublicKey) => {
	const shipper = getShipperAddress(program, owner);

	return {
		account: await program.account.forwarder.fetchNullable(shipper),
		accountKey: shipper
	};
};

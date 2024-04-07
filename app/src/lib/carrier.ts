import { encodeName, getCarrierAddress } from '$src/sdk/sdk';
import type { Availability } from '$src/utils/account/carrier';
import type { AccountName } from '$src/utils/account/common';
import type { Protocol } from '$src/utils/idl/types/protocol';
import { BN, type Program } from '@coral-xyz/anchor';
import type { PublicKey, TransactionInstruction } from '@solana/web3.js';

export const fetchCarrierAccount = async (program: Program<Protocol>, owner: PublicKey) => {
	const carrier = getCarrierAddress(program, owner);

	return {
		account: await program.account.carrier.fetchNullable(carrier),
		accountKey: carrier
	};
};

export const getRegisterCarrierIx = async (
	program: Program<Protocol>,
	signer: PublicKey,
	name: string,
	availability: Availability<Date, string>
): Promise<TransactionInstruction> => {

	const carrier = getCarrierAddress(program, signer);

	const availabilityAnchor: Availability<BN, AccountName> = {
		location: availability.location,
		time: new BN(availability.time.valueOf()),
		locationName: encodeName(availability.locationName)
	};

	const registerCarrierIx = await program.methods
		.registerCarrier(encodeName(name), availabilityAnchor)
		.accounts({
			carrier,
			signer,
			payer: signer
		})
		.instruction();

	return registerCarrierIx;
};

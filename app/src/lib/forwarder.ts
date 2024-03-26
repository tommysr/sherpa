import {
	encodeName,
	getBoughtShipmentAddress,
	getForwarderAddress,
	getShipperAddress
} from '$sdk/sdk';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { Program } from '@coral-xyz/anchor';
import { Transaction, PublicKey, type TransactionInstruction, Connection } from '@solana/web3.js';

export const fetchForwarderAccount = async (program: Program<Protocol>, owner: PublicKey) => {
	const forwarder = getForwarderAddress(program, owner);

	return {
		account: await program.account.forwarder.fetchNullable(forwarder),
		accountKey: forwarder
	};
};

export const getRegisterForwarderIx = async (
	program: Program<Protocol>,
	forwarder: PublicKey,
	signer: PublicKey,
	name: string
): Promise<TransactionInstruction> => {
	const registerShipperIx = await program.methods
		.registerForwarder(encodeName(name))
		.accounts({
			forwarder,
			signer
		})
		.instruction();

	return registerShipperIx;
};

export const getBuyShipmentTx = async (
	program: Program<Protocol>,
	signer: PublicKey,
	shipment: PublicKey,
	shipperAuthority: PublicKey,
	forwarderName: string
): Promise<Transaction> => {
	const tx = new Transaction();

	const { account: forwarderAccount, accountKey: forwarder } = await fetchForwarderAccount(
		program,
		signer
	);

	if (!forwarderAccount) {
		const ix = await getRegisterForwarderIx(program, forwarder, signer, forwarderName);
		tx.add(ix);
	}

	const shipper = getShipperAddress(program, shipperAuthority);
	const bought = getBoughtShipmentAddress(program, signer, forwarderAccount?.count ?? 0);

	const ix = await program.methods
		.buyShipment()
		.accounts({
			shipper,
			shipment,
			forwarder,
			bought,
			signer
		})
		.instruction();

	tx.add(ix);

	return tx;
};

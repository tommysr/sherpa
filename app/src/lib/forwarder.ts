import {
	encodeString,
	getBoughtShipmentAddress,
	getCarrierAddress,
	getForwarderAddress,
	getOfferAddress,
	getShipperAddress,
	getStateAddress
} from '$sdk/sdk';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { BN, Program } from '@coral-xyz/anchor';
import { Transaction, PublicKey, type TransactionInstruction } from '@solana/web3.js';

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
		.registerForwarder(encodeString(name))
		.accounts({
			forwarder,
			signer,
			payer: signer
		})
		.instruction();

	return registerShipperIx;
};

export const getBuyShipmentTx = async (
	program: Program<Protocol>,
	signer: PublicKey,
	shipment: PublicKey,
	shipmentOwner: PublicKey,
	forwarderName: string // CONSIDER: how to handle it, also in make offer
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

	const shipper = getShipperAddress(program, shipmentOwner);
	const bought = getBoughtShipmentAddress(
		program,
		signer,
		forwarderAccount ? forwarderAccount.count : 0
	);

	const ix = await program.methods
		.buyShipment()
		.accounts({
			shipper,
			shipment,
			forwarder,
			bought,
			signer,
			payer: signer
		})
		.instruction();

	tx.add(ix);

	return tx;
};

export const getMakeOfferTx = async (
	program: Program<Protocol>,
	price: BN,
	timeoutSecs: number,
	signer: PublicKey,
	shipment: PublicKey,
	carrierAuthority: PublicKey
): Promise<Transaction> => {
	const carrier = getCarrierAddress(program, carrierAuthority);
	const carrierAccount = await program.account.carrier.fetchNullable(carrier);

	if (!carrierAccount) {
		throw 'Carrier account not found';
	}

	const offer = getOfferAddress(program, carrierAuthority, carrierAccount.offersCount);
	const forwarder = getForwarderAddress(program, signer);

	const ix = await program.methods
		.makeOffer(price, timeoutSecs)
		.accounts({
			offer,
			shipment,
			forwarder,
			carrier,
			signer,
			payer: signer
		})
		.instruction();

	return new Transaction().add(ix);
};

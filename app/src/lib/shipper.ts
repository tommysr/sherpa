import { encodeName, getShipmentAddress, getShipperAddress } from '$sdk/sdk';
import type { ShipmentData } from '$src/utils/account/shipment';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { Program } from '@coral-xyz/anchor';
import { Transaction, type PublicKey, type TransactionInstruction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { deprecate } from 'util';

export type CreateShipmentParams = ShipmentData<Date, string> & {
	price: number; // in SOL currently
	name: string; // max 64 characters, but idk where to enforce it
};

export const fetchShipperAccount = async (program: Program<Protocol>, owner: PublicKey) => {
	const shipper = getShipperAddress(program, owner);

	return {
		account: await program.account.shipper.fetchNullable(shipper),
		accountKey: shipper
	};
};

export const getRegisterShipperIx = async (
	program: Program<Protocol>,
	shipper: PublicKey,
	signer: PublicKey,
	name: string
): Promise<TransactionInstruction> => {
	const registerShipperIx = await program.methods
		.registerShipper(encodeName(name))
		.accounts({
			shipper,
			signer,
			payer: signer,
		})
		.instruction();

	return registerShipperIx;
};

export const getCreateShipmentTx = async (
	program: Program<Protocol>,
	signer: PublicKey,
	shipmentParams: CreateShipmentParams,
	shipperName: string
): Promise<Transaction> => {
	console.log(shipmentParams)

	const tx = new Transaction();

	const { account: shipperAccount, accountKey: shipper } = await fetchShipperAccount(
		program,
		signer
	);

	if (!shipperAccount) {
		const ix = await getRegisterShipperIx(program, shipper, signer, shipperName);
		tx.add(ix);
	}


	const shipment = getShipmentAddress(program, signer, shipperAccount ? shipperAccount.count : 0);

	const { deadline, when, price, name, details, dimensions, geography } = shipmentParams;



	const ix = await program.methods
		.createShipment(new BN(price * 10 ** 9), encodeName(name), {
			deadline: new BN(deadline.valueOf()),
			details,
			dimensions: {
				depth: dimensions.depth * 1000,
				height: dimensions.height * 1000,
				width: dimensions.width * 1000,
				weight: dimensions.weight * 1000
			},
			geography: {
				...geography,
				fromName: encodeName(geography.fromName),
				toName: encodeName(geography.toName)
			},
			when: new BN(when.valueOf())
		})
		.accounts({
			shipper,
			shipment,
			signer,
			payer: signer,
		})
		.instruction();

	tx.add(ix);

	return tx;
};

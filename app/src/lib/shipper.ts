import { encodeString, getShipmentAddress, getShipperAddress } from '$sdk/sdk';
import type { ShipmentData } from '$src/utils/account/shipment';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { Program } from '@coral-xyz/anchor';
import { Transaction, type PublicKey, type TransactionInstruction } from '@solana/web3.js';
import { BN } from 'bn.js';

export type CreateShipmentParams = ShipmentData<number, Date, string> & {
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
		.registerShipper(encodeString(name))
		.accounts({
			shipper,
			signer,
			payer: signer
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

	const { deadline, when, price, name, details, dimensions, geography, collateral, penalty } =
		shipmentParams;

	const ix = await program.methods
		.createShipment(new BN(price * 10 ** 9), encodeString(name), {
			deadline: new BN(deadline.valueOf() / 1000),
			details,
			collateral: new BN(collateral),
			penalty: new BN(penalty),
			dimensions: {
				depth: dimensions.depth * 1000,
				height: dimensions.height * 1000,
				width: dimensions.width * 1000,
				weight: dimensions.weight * 1000
			},
			geography: {
				...geography,
				fromName: encodeString(geography.fromName),
				toName: encodeString(geography.toName)
			},
			when: new BN(Math.floor(when.valueOf() / 1000))
		})
		.accounts({
			shipper,
			shipment,
			signer,
			payer: signer
		})
		.instruction();

	tx.add(ix);

	return tx;
};

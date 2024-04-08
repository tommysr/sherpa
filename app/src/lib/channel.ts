import { DF_BASE, DF_MODULUS, encodeString } from '$src/sdk/sdk';
import type { Protocol } from '$src/utils/idl/types/protocol';
import type { Program } from '@coral-xyz/anchor';
import { TransactionInstruction, type PublicKey } from '@solana/web3.js';
import {  createDiffieHellman } from 'diffie-hellman';
import { AES } from 'crypto-ts';
import { zoomTransition } from 'svelte-maplibre';

const getSharedKeyFromAccount = async (
	program: Program<Protocol>,
	shipment: PublicKey,
	whose: 'carrier' | 'shipper'
) => {
	const shipmentAccount = await program.account.shipment.fetchNullable(shipment);

	if (shipmentAccount) {
		const value =
			whose === 'carrier'
				? shipmentAccount.channel.carrier.value
				: shipmentAccount.channel.shipper.value;
		return Buffer.from(Uint8Array.from(value)).toString('base64');
	}

	throw new Error('Shipment account not found');
};

export const getSendMessageIx = async (
	program: Program<Protocol>,
	shipment: PublicKey,
	signer: PublicKey,
	privateKey: Buffer,
	otherPublic: Buffer,
	message: string
): Promise<TransactionInstruction> => {
	const dh = createDiffieHellman(DF_MODULUS);
	dh.setPrivateKey(privateKey)
	dh.generateKeys()

	const secret = dh.computeSecret(otherPublic);
	const shared = Uint8Array.from(dh.getPublicKey());
	const encryptedMessage = AES.encrypt(message, secret.toString('hex')).toString();

	const value = Array(256)
		.fill(0)
		.map((_, i) => shared[i] ?? 0);

	return await program.methods
		.sendMessage({ value }, encodeString(encryptedMessage, 256))
		.accounts({
			shipment,
			signer
		})
		.instruction();
};

export const getOpenChannelIx = async (
	program: Program<Protocol>,
	shipment: PublicKey,
	signer: PublicKey,
	sharedKey: Buffer
): Promise<TransactionInstruction> => {
	const shared = new Uint8Array(sharedKey);

	const value = Array(256)
		.fill(0)
		.map((_, i) => shared[i] ?? 0);

	return await program.methods
		.openChannel({ value })
		.accounts({
			shipment,
			signer
		})
		.instruction();
};

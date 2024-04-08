<script lang="ts">
	import { get } from 'svelte/store';
	import Modal from './Modal.svelte';
	import { PublicKey } from '@solana/web3.js';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { createNotification } from '../Notification/notificationsStore';
	import { getAcceptShipmentOfferTx } from '$src/lib/offer';
	import type { OfferedShipment } from '$src/stores/offers';
	import Input from '../Inputs/Input.svelte';
	import Button from '../Buttons/Button.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import { messageFormSchema as schema } from './schemas';
	import { reporter } from '@felte/reporter-svelte';
	import { createDiffieHellman } from 'diffie-hellman';
	import { DF_BASE, DF_MODULUS } from '$src/sdk/sdk';
	import { getSendMessageIx } from '$src/lib/channel';
	import type { Program } from '@coral-xyz/anchor';
	import type { Protocol } from '$src/utils/idl/types/protocol';
	import { setLocalStorage } from '$src/utils/wallet/localStorage';

	export let showModal: boolean;
	export let offer: OfferedShipment;

	async function prepareSendMessageIx(
		program: Program<Protocol>,
		signer: PublicKey,
		shipment: PublicKey,
		shipperSharedKey: Buffer,
		message: string
	) {
		const { privateKey, sharedKey } = generateKeys();

		setLocalStorage<string>(`carrier${shipment.toString()}` , privateKey.toString('hex'));

		return await getSendMessageIx(program, shipment, signer, privateKey, shipperSharedKey, message);
	}
	
	function generateKeys() {
		let dh = createDiffieHellman(DF_MODULUS);
		dh.generateKeys();
		const privateKey = dh.getPrivateKey();
		const sharedKey = dh.getPublicKey();

		return { privateKey, sharedKey };
	}	
	const handleAcceptOfferClick = async (message: string) => {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);

		if (!$walletStore.publicKey) {
			walletStore.openModal();

			createNotification({
				text: 'Wallet not connected',
				type: 'failed',
				removeAfter: 5000
			});

			return;
		}

		const tx = await getAcceptShipmentOfferTx(
			program,
			$walletStore.publicKey,
			new PublicKey(offer.meta.account.offeror),
			new PublicKey(offer.shipment.publicKey),
			offer.meta.account.no
		);


		console.log(offer.shipment.account.channel.shipper)
		console.log(offer.shipment.account.channel.carrier)
		const ix = await prepareSendMessageIx(
			program,
			$walletStore.publicKey!,
			new PublicKey(offer.shipment.publicKey),
			Buffer.from(Uint8Array.from(offer.shipment.account.channel.shipper)),
			message
		);

		tx.add(ix);
    
		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({
				text: 'Transaction send',
				type: 'success',
				removeAfter: 5000,
				signature: sig
			});
		} catch (err) {
			createNotification({ text: 'Transaction send', type: 'failed', removeAfter: 5000 });
		}
	};

	const { form, data } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit: async (values) => {
			handleAcceptOfferClick(values.message)
		},
		initialValues: { message: '' }
	});
</script>

<Modal bind:showModal>
	<div>
		<h2
			class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
		>
			Message to shipper
		</h2>
		<p class="text-neutral-600 text-sm max-w-sm mt-2">
			You can send an encrypted message with contact information or other details.
		</p>

		<form use:form class="mt-8">
			<Input name="message" placeholder="Enter message" required />

			<div class="flex justify-center space-x-5 mt-8">
				<Button class="uppercase tracking-widest" type="submit">Accept</Button>
			</div>
		</form>
	</div></Modal
>

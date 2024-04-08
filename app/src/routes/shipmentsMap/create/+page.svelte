<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { CarrierFormStage } from '$src/components/CarrierForm/carrierFormStage';
	import Modal from '$src/components/Modals/Modal.svelte';
	import {
		createNotification,
		updateNotification
	} from '$src/components/Notification/notificationsStore';
	import CollateralForm from '$src/components/ShipmentForm/CollateralForm.svelte';
	import DatesForm from '$src/components/ShipmentForm/DatesForm.svelte';
	import DetailsForm from '$src/components/ShipmentForm/DetailsForm.svelte';
	import DimensionsForm from '$src/components/ShipmentForm/DimensionsForm.svelte';
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import LocationsForm from '$src/components/ShipmentForm/LocationsForm.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import PriceForm from '$src/components/ShipmentForm/PriceForm.svelte';
	import SummaryForm from '$src/components/ShipmentForm/SummaryForm.svelte';
	import { FormStage, nextStage } from '$src/components/ShipmentForm/formStage';
	import type { CreateShipmentFormInterface } from '$src/components/ShipmentForm/interfaces';
	import { getOpenChannelIx } from '$src/lib/channel';
	import { fetchShipperAccount, getCreateShipmentTx } from '$src/lib/shipper';
	import { DF_MODULUS, getShipmentAddress } from '$src/sdk/sdk';
	import { anchorStore } from '$src/stores/anchor';
	import { awaitedConfirmation } from '$src/stores/confirmationAwait';
	import { defaultLocation } from '$src/stores/locationsPick';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import type { Protocol } from '$src/utils/idl/types/protocol';
	import { setLocalStorage } from '$src/utils/wallet/localStorage';
	import { userStore } from '$stores/user';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import type { Program } from '@coral-xyz/anchor';
	import type { PublicKey } from '@solana/web3.js';
	import { createDiffieHellman } from 'diffie-hellman';
	import { get } from 'svelte/store';

	let states: CreateShipmentFormInterface = {
		name: {
			name: ''
		},
		shipmentName: {
			name: ''
		},
		price: { price: undefined },
		collateral: {
			collateral: undefined,
			penalty: undefined
		},
		dates: {
			deadline: new Date(),
			when: new Date()
		},
		details: {
			access: 0,
			count: 1,
			fragility: 1,
			priority: 1
		},
		dimensions: {
			distanceMetrics: 'm',
			isMetricTon: false,
			weightMetrics: 'kg',
			weight: undefined,
			depth: undefined,
			height: undefined,
			volume: undefined,
			width: undefined
		},
		locations: {
			destinationLocationLat: defaultLocation.lat,
			destinationLocationLng: defaultLocation.lng,
			sourceLocationLat: defaultLocation.lat,
			sourceLocationLng: defaultLocation.lng,
			destinationName: 'default',
			sourceName: 'default'
		}
	};

	const forms = {
		name: {
			component: NameForm,
			props: {
				header: 'Shipper name',
				text: "You're not registered as a shipper, enter desired shipper name."
			}
		},
		shipmentName: {
			component: NameForm,
			props: { header: 'Shipment Name', text: 'Enter short name describing your shipment.' }
		},
		price: {
			component: PriceForm,
			props: {}
		},
		collateral: {
			component: CollateralForm,
			props: {}
		},
		dates: {
			component: DatesForm,
			props: {}
		},
		dimensions: {
			component: DimensionsForm,
			props: {}
		},
		details: {
			component: DetailsForm,
			props: {}
		},
		locations: {
			component: LocationsForm,
			props: {}
		},

		summary: {
			component: SummaryForm,
			props: { states: states }
		}
	};

	let startForm = $userStore.shipper.registered ? FormStage.ShipmentName : FormStage.Name;

	let showModal = true;

	$: form = $page.state.form ?? startForm;

	function summarizeState() {
		const endState = {};
		for (const key in states) {
			endState[key] = states[key];
		}
		states[FormStage.Summary] = endState;
	}

	function generateKeys() {
		let dh = createDiffieHellman(DF_MODULUS);
		dh.generateKeys();
		const privateKey = dh.getPrivateKey();
		const sharedKey = dh.getPublicKey();

		return { privateKey, sharedKey };
	}

	async function prepareOpenChannelIx(program: Program<Protocol>, signer: PublicKey) {
		const { account: shipperAccount, accountKey: shipper } = await fetchShipperAccount(
			program,
			signer
		);

		const shipment = getShipmentAddress(program, signer, shipperAccount ? shipperAccount.count : 0);

		const { privateKey, sharedKey } = generateKeys();

		setLocalStorage<string>(`shipper${shipment.toString()}`, privateKey.toString('hex'));

		return await getOpenChannelIx(program, shipment, signer, sharedKey);
	}

	async function buyShipment(values: CreateShipmentFormInterface) {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);
		const { shipper } = get(userStore);

		if (!$walletStore.publicKey) {
			showModal = false;

			createNotification({ text: 'wallet not connected', type: 'failed', removeAfter: 5000 });

			walletStore.openModal();

			return;
		}

		const {
			dates,
			details: { access, count, fragility, priority },
			dimensions,
			locations: {
				destinationLocationLat,
				destinationLocationLng,
				destinationName,
				sourceLocationLat,
				sourceLocationLng,
				sourceName
			},
			price: { price },
			shipmentName,
			name: { name },
			collateral: { collateral, penalty }
		} = values;

		// WELCOME TO CIRCUS

		const shitCheck = (n: number | undefined) => {
			return n ? (typeof n == 'string' ? parseFloat(n) : n) : 0;
		};

		let width = shitCheck(dimensions.width);

		if (dimensions.isMetricTon) {
			width = shitCheck(dimensions.volume);
		}

		const id = createNotification({ text: 'Signing', type: 'loading', removeAfter: undefined });

		const tx = await getCreateShipmentTx(
			program,
			wallet.publicKey!,
			{
				name: shipmentName.name,
				deadline: dates.deadline,
				when: dates.when,
				details: {
					access,
					count,
					fragility,
					priority,
					reserved: [0, 0, 0]
				},
				dimensions: {
					depth: shitCheck(dimensions.depth),
					height: shitCheck(dimensions.height),
					weight: shitCheck(dimensions.weight),
					width
				},
				geography: {
					from: { latitude: sourceLocationLat, longitude: sourceLocationLng },
					to: {
						latitude: destinationLocationLat,
						longitude: destinationLocationLng
					},
					fromName: sourceName,
					toName: destinationName
				},
				collateral: collateral ?? 0,
				penalty: penalty ?? 0,
				price: price ?? 0
			},
			shipper.name ?? name
		);

		const openChannelIx = await prepareOpenChannelIx(program, wallet.publicKey!);
		tx.add(openChannelIx);

		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			updateNotification(id, {
				text: 'Creating shipment',
				type: 'success',
				removeAfter: 5000,
				signature
			});

			const confirmation = createNotification({
				text: 'waiting for confirmation',
				type: 'loading',
				removeAfter: 30000
			});
			awaitedConfirmation.set(confirmation);
		} catch (err) {
			updateNotification(id, { text: 'Creating shipment', type: 'failed', removeAfter: 5000 });
		}
	}

	async function onSubmit(values) {
		if (form == FormStage.Summary) {
			await buyShipment(states as CreateShipmentFormInterface);
		} else {
			console.log(form, values);
			states[form] = values;

			if (form == FormStage.Locations) {
				summarizeState();
				console.log(states);
			}
			states = states;
			pushState('', { form: nextStage(form), showModal: true, carrierForm: CarrierFormStage.Name });
		}
	}

	function onBack(values) {
		if (form == startForm) return;
		states[form] = values;
		states = states;
		history.back();
	}
</script>

<Modal
	{showModal}
	on:backdropClick={() => goto('/shipmentsMap')}
	closeHandler={() => goto('/shipmentsMap')}
>
	<svelte:component
		this={forms[form].component}
		{onSubmit}
		{onBack}
		initialValues={states[form]}
		bind:showModal
		{...forms[form].props}
	/>
</Modal>

{#if !showModal}
	<LocationPick bind:showModal type="double" />
{/if}

<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$src/components/Modals/Modal.svelte';

	import AvailabilityForm from '$src/components/CarrierForm/AvailabilityForm.svelte';
	import { CarrierFormStage, nextStage } from '$src/components/CarrierForm/carrierFormStage';
	import type { RegisterCarrierFormInterface } from '$src/components/CarrierForm/interfaces';
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import { getRegisterCarrierIx } from '$src/lib/carrier';
	import { anchorStore } from '$src/stores/anchor';
	import { defaultLocation } from '$src/stores/locationsPick';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { userStore } from '$stores/user';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import { Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	import {
		createNotification,
		removeNotification
	} from '$src/components/Notification/notificationsStore';

	import SummaryForm from '$src/components/CarrierForm/SummaryForm.svelte';
	import { FormStage } from '$src/components/ShipmentForm/formStage';

	const forms = {
		name: {
			component: NameForm,
			props: {
				header: 'Carrier name',
				text: "You're not registered as a carrier yet. Please provide your name."
			}
		},
		locationWithTime: {
			component: AvailabilityForm,
			props: {}
		},
		summary: {
			component: SummaryForm,
			props: {}
		}
	};

	let startForm = $userStore.carrier.registered
		? CarrierFormStage.LocationWithTime
		: CarrierFormStage.Name;

	let states: RegisterCarrierFormInterface = {
		name: {
			name: ''
		},
		locationWithTime: {
			when: new Date(),
			latitude: defaultLocation.lat,
			longitude: defaultLocation.lng,
			name: 'default'
		}
	};
	let showModal = true;

	$: form = $page.state.carrierForm ?? startForm;

	function summarizeState() {
		const endState = {};
		for (const key in states) {
			endState[key] = states[key];
		}
		states[CarrierFormStage.Summary] = endState;
	}

	async function registerCarrier(values: RegisterCarrierFormInterface) {
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

		const {
			locationWithTime: { latitude, longitude, name: locationName, when },
			name: { name }
		} = values;

		const tx = new Transaction().add(
			await getRegisterCarrierIx(program, wallet.publicKey!, name, {
				location: {
					latitude,
					longitude
				},
				time: when,
				locationName
			})
		);
		try {
			const signature = await useSignAndSendTransaction(connection, wallet, tx);

			createNotification({
				text: 'Transaction',
				type: 'success',
				removeAfter: 10000,
				signature
			});

			const latestBlockHash = await connection.getLatestBlockhash();

			const confirmId = createNotification({
				text: 'confirm',
				type: 'loading',
				removeAfter: undefined
			});

			const confirmation = await connection.confirmTransaction({
				blockhash: latestBlockHash.blockhash,
				lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
				signature
			});

			removeNotification(confirmId);
			if (confirmation.value.err) {
				createNotification({
					text: 'create',
					type: 'failed',
					removeAfter: 5000
				});
			} else {
				createNotification({
					text: 'create',
					type: 'success',
					removeAfter: 5000
				});

				createNotification({
					text: 'redirecting',
					type: 'loading',
					removeAfter: 5000
				});

				// redirect but its kind of shit, cause route has to wait
				setTimeout(() => goto(`/carrier/${$walletStore.publicKey}/incoming`), 15000);
			}
		} catch (e) {
			createNotification({ text: 'Transaction send', type: 'failed', removeAfter: 10000 });
		}
	}

	async function onSubmit(values) {
		if (form == CarrierFormStage.Summary) {
			await registerCarrier(states as RegisterCarrierFormInterface);
		} else {
			states[form] = values;

			if (form == CarrierFormStage.LocationWithTime) {
				summarizeState();
			}
			states = states;
			pushState('', { carrierForm: nextStage(form), showModal: true, form: FormStage.Name });
		}
	}

	function onBack(values) {
		if (form == startForm) return;
		states[form] = values;
		states = states;
		history.back();
	}
</script>

<svelte:head><title>Register as a carrier</title></svelte:head>

<Modal
	{showModal}
	closeHandler={() => goto('/carrier')}
	on:backdropClick={() => goto('/carrier')}
	showCloseButton={true}
>
	<div class="w-full flex flex-col space-y-7">
		<svelte:component
			this={forms[form].component}
			{onSubmit}
			{onBack}
			initialValues={states[form]}
			bind:showModal
			{...forms[form].props}
		/>
	</div>
</Modal>

{#if !showModal}
	<LocationPick bind:showModal />
{/if}

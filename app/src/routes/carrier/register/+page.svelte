<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$src/components/Modals/Modal.svelte';

	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { userStore } from '$stores/user';
	import { get } from 'svelte/store';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import { defaultLocation } from '$src/stores/locationsPick';
	import type { RegisterCarrierFormInterface } from '$src/components/CarrierForm/interfaces';
	import { CarrierFormStage, nextStage } from '$src/components/CarrierForm/carrierFormStage';
	import { getRegisterCarrierIx } from '$src/lib/carrier';
	import { Transaction } from '@solana/web3.js';
	import AvailabilityForm from '$src/components/CarrierForm/AvailabilityForm.svelte';

	import { FormStage } from '$src/components/ShipmentForm/formStage';
	import SummaryForm from '$src/components/ShipmentForm/SummaryForm.svelte';
	import { createNotification } from '$src/components/Notification/notificationsStore';

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

			return
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

			createNotification({text: 'Transaction send', type:'success', removeAfter: 10000, signature})
		} catch (e) {
			createNotification({text: 'Transaction send', type: 'failed', removeAfter: 10000})
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

<Modal {showModal} closeHandler={() => history.back()}>
	<div class="mt-10 w-full flex flex-col space-y-7">
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

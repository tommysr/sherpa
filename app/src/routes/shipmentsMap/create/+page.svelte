<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { CarrierFormStage } from '$src/components/CarrierForm/carrierFormStage';
	import Modal from '$src/components/Modals/Modal.svelte';
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
	import { getCreateShipmentTx } from '$src/lib/shipper';
	import { anchorStore } from '$src/stores/anchor';
	import { defaultLocation } from '$src/stores/locationsPick';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { userStore } from '$stores/user';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import { get } from 'svelte/store';

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
			props: {}
		}
	};

	let startForm = $userStore.shipper.registered ? FormStage.Price : FormStage.Name;

	let states: CreateShipmentFormInterface = {
		name: {
			name: ''
		},
		shipmentName: {
			name: ''
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
		price: { price: undefined },
		locations: {
			destinationLocationLat: defaultLocation.lat,
			destinationLocationLng: defaultLocation.lng,
			sourceLocationLat: defaultLocation.lat,
			sourceLocationLng: defaultLocation.lng,
			destinationName: 'default',
			sourceName: 'default'
		}
	};
	let showModal = true;

	$: form = $page.state.form ?? startForm;

	function summarizeState() {
		const endState = {};
		for (const key in states) {
			endState[key] = states[key];
		}
		states[FormStage.Summary] = endState;
	}

	async function buyShipment(values: CreateShipmentFormInterface) {
		const { program } = get(anchorStore);
		const wallet = get(walletStore);
		const { connection } = get(web3Store);
		const { shipper } = get(userStore);

		if (!$walletStore.publicKey) {
			showModal = false;
			walletStore.openModal();

			throw 'wallet not connected';
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
			name: { name }
		} = values;

		// WELCOME TO CIRCUS

		const shitCheck = (n: number | undefined) => {
			return n ? (typeof n == 'string' ? parseFloat(n) : n) : 0;
		};

		let width = shitCheck(dimensions.width);

		if (dimensions.isMetricTon) {
			width = shitCheck(dimensions.volume);
		}

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

				price: price ?? 0
			},
			shipper.name != '' ? shipper.name : name
		);

		return await useSignAndSendTransaction(connection, wallet, tx);
	}

	async function onSubmit(values) {
		if (form == FormStage.Summary) {
			await buyShipment(states as CreateShipmentFormInterface)
				.then((sig) => console.log(sig))
				.catch((err) => console.error(err));
		} else {
			console.log(form, values);
			states[form] = values;

			if (form == FormStage.Locations) {
				summarizeState();
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
	showCloseButton={false}
	on:backdropClick={() => goto('/shipmentsMap')}
	closeHandler={() => history.back()}
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

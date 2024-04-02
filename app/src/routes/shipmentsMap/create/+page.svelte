<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$src/components/Modals/Modal.svelte';
	import DatesForm from '$src/components/ShipmentForm/DatesForm.svelte';
	import DetailsForm from '$src/components/ShipmentForm/DetailsForm.svelte';
	import DimensionsForm from '$src/components/ShipmentForm/DimensionsForm.svelte';
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import LocationsForm from '$src/components/ShipmentForm/LocationsForm.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import PriceForm from '$src/components/ShipmentForm/PriceForm.svelte';
	import SummaryForm from '$src/components/ShipmentForm/SummaryForm.svelte';
	import type { CreateShipmentFormInterface } from '$src/components/ShipmentForm/interfaces';
	import { FormStage } from '$src/components/ShipmentForm/interfaces';
	import { getCreateShipmentTx } from '$src/lib/shipper';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import { userStore } from '$stores/user';
	import { get } from 'svelte/store';
	import { useSignAndSendTransaction } from '$utils/wallet/singAndSendTx';
	import ShipmentNameForm from '$src/components/ShipmentForm/ShipmentNameForm.svelte';

	function nextStage(f: FormStage): FormStage {
		switch (f) {
			case FormStage.Name:
				return FormStage.ShipmentName;
			case FormStage.ShipmentName:
				return FormStage.Price;
			case FormStage.Price:
				return FormStage.Dates;
			case FormStage.Dates:
				return FormStage.Dimensions;
			case FormStage.Dimensions:
				return FormStage.Details;
			case FormStage.Details:
				return FormStage.Locations;
			case FormStage.Locations:
				return FormStage.Summary;
			default:
				return FormStage.Summary;
		}
	}

	const forms = {
		name: NameForm,
		shipmentName: ShipmentNameForm,
		price: PriceForm,
		dates: DatesForm,
		dimensions: DimensionsForm,
		details: DetailsForm,
		locations: LocationsForm,
		summary: SummaryForm
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
			access: '0',
			count: 1,
			fragility: 1,
			priority: 1
		},
		dimensions: {
			distanceMetrics: 'm',
			isMetricTon: false,
			weightMetrics: 'kg',
			weight: '',
			depth: '',
			height: '',
			volume: '',
			width: ''
		},
		price: { price: '' },
		locations: {
			destinationLocationLat: 0,
			destinationLocationLng: 0,
			destinationName: '',
			sourceLocationLat: 0,
			sourceLocationLng: 0,
			sourceName: ''
		}
	};
	let showModal = true;

	$: form = $page.state.form ?? (startForm as FormStage);

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

		let depth = 0;
		let height = 0;
		let width = 0;
		let weight = parseFloat(dimensions.weight!);

		if (dimensions.isMetricTon) {
			width = parseFloat(dimensions.volume!);
		} else {
			height = parseFloat(dimensions.height!);
			depth = parseFloat(dimensions.depth!);
		}

		const tx = await getCreateShipmentTx(
			program,
			wallet.publicKey!,
			{
				name: shipmentName.name,
				deadline: dates.deadline,
				when: dates.when,
				details: {
					access: parseInt(access),
					count,
					fragility,
					priority,
					reserved: [0, 0, 0]
				},
				dimensions: {
					depth,
					height,
					weight,
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

				price: parseFloat(price)
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
			states[form] = values;

			if (form == FormStage.Locations) {
				summarizeState();
			}
			states = states;
			pushState('', { form: nextStage(form), showModal: true });
		}
	}

	function onBack(values) {
		if (form == startForm) return;
		states[form] = values;
		states = states;
		history.back();
	}
</script>

<Modal {showModal} closeHandler={() => history.back()}>
	<div class="mt-10 w-full flex flex-col space-y-7">
		<svelte:component
			this={forms[form]}
			{onSubmit}
			{onBack}
			initialValues={states[form]}
			bind:showModal
		/>
	</div>
</Modal>

{#if !showModal}
	<LocationPick bind:showModal />
{/if}

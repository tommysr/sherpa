<script lang="ts">
	import Modal from '$src/components/Modals/Modal.svelte';
	import DatesForm from '$src/components/ShipmentForm/DatesForm.svelte';
	import DetailsForm from '$src/components/ShipmentForm/DetailsForm.svelte';
	import DimensionsForm from '$src/components/ShipmentForm/DimensionsForm.svelte';
	import LocationPick from '$src/components/ShipmentForm/LocationPick.svelte';
	import LocationsForm from '$src/components/ShipmentForm/LocationsForm.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import PriceForm from '$src/components/ShipmentForm/PriceForm.svelte';
	import { userStore } from '$stores/user';

	enum FormStage {
		Name,
		Price,
		Dates,
		Dimensions,
		Details,
		Locations,
		END
	}

	const forms = [NameForm, PriceForm, DatesForm, DimensionsForm, DetailsForm, LocationsForm];
	let startForm = $userStore.shipper.registered ? FormStage.Price : FormStage.Name;
	let form: FormStage = startForm;
	let states = {};
	let showModal = true;

	function onSubmit(values) {
		console.log(states);
		if (form == FormStage.END) {
			//TODO: submit
			console.log(states);
		} else {
			states[form] = values;
			states = states;
			form += 1;
		}
	}

	function onBack(values) {
		if (form == startForm) return;
		states[form] = values;
		states = states;
		form -= 1;
	}

	$: console.log(showModal);
</script>

<Modal {showModal}>
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

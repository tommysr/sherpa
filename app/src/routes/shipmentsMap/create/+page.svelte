<script lang="ts">
	import Modal from '$src/components/Modals/Modal.svelte';
	import DimensionsForm from '$src/components/ShipmentForm/DimensionsForm.svelte';
	import NameForm from '$src/components/ShipmentForm/NameForm.svelte';
	import PriceForm from '$src/components/ShipmentForm/PriceForm.svelte';

	enum FormStage {
		name,
		price,
		dimensions,
		end
	}

	const forms = { 0: NameForm, 1: PriceForm, 2: DimensionsForm };
	let form = FormStage.name;
	let states = {};

	function onSubmit(values) {
		console.log(states);
		if (form == FormStage.end) {
			console.log(states);
		} else {
			states[form] = values;
			states = states;
			form += 1;
		}
	}

	function onBack(values) {
		if (form == FormStage.name) return;
		states[form] = values;
		states = states;
		form -= 1;
	}
</script>

<Modal showModal>
	<div class="mt-10 w-full flex flex-col space-y-7">
		<svelte:component this={forms[form]} {onSubmit} {onBack} initialValues={states[form]} />
	</div>
</Modal>

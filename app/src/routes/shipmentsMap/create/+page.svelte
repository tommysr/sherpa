<script lang="ts">
	import Button from '$src/components/Buttons/Button.svelte';
	import Modal from '$src/components/Modals/Modal.svelte';
	import Form from '$src/components/ShipmentForm/Form.svelte';
	import { formStore } from '$src/stores/orderForm';
	import { onMount } from 'svelte';

	let stage = 0;
	let showModal = true;
</script>

<Modal {showModal}>
	<Form />

	<div class="flex justify-center mt-4 gap-x-2">
		<Button disabled={!formStore.canPrev($formStore)} on:click={() => formStore.prevStage()}
			>Prev</Button
		>
		<Button on:click={() => formStore.nextStage()}>Next</Button>
	</div>
</Modal>

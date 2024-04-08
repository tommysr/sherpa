<script lang="ts">
	import NumberInput from '../Inputs/NumberInput.svelte';
</script>

<div class="flex flex-col px-4 space-y-7">
	<div class="flex justify-left items-center space-x-4">
		<label for="count">Count:</label>
		<NumberInput name="count" class="w-32 h-9" />
	</div>

	<div class="flex justify-left items-center space-x-4">
		<label for="priority">Priority:</label>
		<select
			name="priority"
			required
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
		>
			<option value="1">Very low</option>
			<option value="2">Low</option>
			<option value="3">Medium</option>
			<option value="4">High</option>
			<option value="5">Very high</option>
		</select>
	</div>

	<div class="flex justify-left items-center space-x-4">
		<label for="fragility">Fragility:</label>
		<select
			name="fragility"
			required
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
		>
			<option value="1">Very fragile</option>
			<option value="2">Fragile</option>
			<option value="3">Normal</option>
			<option value="4">Robust</option>
			<option value="5">Very robust</option>
		</select>
	</div>

	<div class="flex justify-left items-center space-x-4">
		<label for="access">Access:</label>
		<select
			name="access"
			required
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
		>
			<option selected disabled value="0"></option>
			<option value="1">Only car</option>
			<option value="2">Truck up to 10t</option>
			<option value="3">Truck over 10t</option>
			<option value="4">Something else</option>
			<option value="5">Can't tell</option>
		</select>
	</div>
</div>

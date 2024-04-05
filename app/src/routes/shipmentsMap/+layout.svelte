<script lang="ts">
	import { searchableShipments } from '$src/stores/searchableShipments';

	let storeToSearchIn = searchableShipments;

	function handleSearchKeyUp(e: KeyboardEvent) {
		if ($storeToSearchIn.searchString && e.key == 'Enter') {
			storeToSearchIn.performSearch();
		} else if (!$storeToSearchIn.searchString) {
			storeToSearchIn.purgeFiltered();
		}
	}


</script>

<div
	class="absolute z-10 w-3/4 md:w-1/3 xl:w-1/4 left-5 md:left-1/2 md:transform md:-translate-x-1/2 top-4"
>
	<div class="m-3 p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
		<label for="name" class="sr-only">Name</label>
		<input
			class="px-3 py-1.5 w-full rounded-full bg-background focus:outline-none text-sm md:text-lg"
			type="text"
			id="name"
			placeholder="Search"
			bind:value={$storeToSearchIn.searchString}
			on:keyup={handleSearchKeyUp}
		/>
	</div>
</div>

<slot />

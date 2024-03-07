<script lang="ts">
	import type { MockTransportOrder } from '$src/utils/types/mockTransport';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: orders = data.orders as MockTransportOrder[];
</script>

<svelte:head><title>Orders</title></svelte:head>

<main class="container">
	<ul>
		{#each orders as order}
			<li>{order.from.latitude}</li>
		{/each}
	</ul>
</main>

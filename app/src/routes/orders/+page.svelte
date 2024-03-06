<script lang="ts">
	import { onMount } from 'svelte';

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const orders = [
		{ id: 0, val: 0 },
		{ id: 1, val: 1 },
		{ id: 2, val: 2 }
	];

	async function loadOrders() {
		await delay(1000);
	}

	onMount(loadOrders);
</script>

<svelte:head><title>Orders</title></svelte:head>

<main class="container">
	<ul>
		{#each orders as order}
			<li>{order.val}</li>
		{/each}
	</ul>
</main>

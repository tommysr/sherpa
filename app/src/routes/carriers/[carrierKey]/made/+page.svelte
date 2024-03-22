<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: addresses = data.offers.map((o) => o.publicKey.toString());
</script>

<svelte:head><title>Offers</title></svelte:head>

{#each addresses as address}
	<p>{address}</p>
{/each}

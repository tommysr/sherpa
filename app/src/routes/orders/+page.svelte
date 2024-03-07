<script lang="ts">
	import type { MockTransportOrder } from '$src/utils/types/mockTransport';
	import image from '$lib/images/logo.png';
	import ShipmentMap from '$components/ShipmentMap/ShipmentMap.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;
	$: orders = data.orders as MockTransportOrder[];

	let scrollableMenu: HTMLDivElement;
	let offsetOfScroll: number;

	const categoryButtons = [
		'small',
		'big',
		'small',
		'big',
		'small',
		'big',
		'small',
		'big',
		'small',
		'big',
		'small',
		'big',
		'small'
	];

	function scrollCategoryMenuRight() {
		const newOffsetLeft = scrollableMenu.offsetLeft + scrollableMenu.offsetWidth;
		offsetOfScroll = newOffsetLeft;
		scrollableMenu.scrollTo({ left: newOffsetLeft });
	}

	function scrollCategoryMenuLeft() {
		const newOffsetLeft = Math.max(scrollableMenu.offsetLeft - scrollableMenu.offsetWidth, 0);
		offsetOfScroll = newOffsetLeft;
		scrollableMenu.scrollTo({ left: newOffsetLeft });
	}

	function getClassNameFromPriority(priority: number) {
		if (priority < 2) {
			return 'normal';
		} else if (priority < 5) {
			return 'low';
		} else if (priority < 8) {
			return 'medium';
		} else {
			return 'high';
		}
	}
</script>

<svelte:head><title>Orders</title></svelte:head>

<main class="container">
	<div class="scrollable">
		<button class="secondary" on:click={scrollCategoryMenuLeft}>-</button>
		<div class="scroll" bind:this={scrollableMenu}>
			{#each categoryButtons as category}
				<button>{category}</button>
			{/each}
		</div>
		<button class="secondary" on:click={scrollCategoryMenuRight}>+</button>
	</div>

	<div class="grid access-nav">
		<div>
			<nav>
				<ul>
					<li><a href="#">Latest</a></li>
					<li><a href="#">Nearest</a></li>
				</ul>
			</nav>
		</div>
		<div><input type="search" name="search" placeholder="Search" aria-label="Search" /></div>
	</div>

	<div class="grid">
		<div>
			{#each orders as order}
				<div class="card priority-{getClassNameFromPriority(order.details.priority)}">
					<article>
						<header>Name of the thing to transport</header>
						<div class="grid">
							<div>
								<img alt="img" src={image} />
							</div>
							<div>
								Volume: {order.dimensions.volume.toFixed(2)}
								Weight: {order.dimensions.weight.toFixed(2)}
								Fragile: {order.details.fragility.toFixed(0)}
							</div>
							<div>Location: Krakow</div>
						</div>
					</article>
					<article>
						<details>
							<summary>Precise location</summary>
							<ul>
								<li>Source: {Object.values(order.from)}</li>
								<li>Destination: {Object.values(order.to)}</li>
							</ul>
						</details>
						<details>
							<summary>Other informations</summary>
							<ul>
								<li>Source: {Object.values(order.from)}</li>
								<li>Destination: {Object.values(order.to)}</li>
							</ul>
						</details>

						<footer>Date of shipment: {new Date(order.when).toDateString()}</footer>
					</article>
				</div>
			{/each}
		</div>
		<div><ShipmentMap /></div>
	</div>
</main>

<style lang="scss">
	.card {
		background-color: cadetblue;
		padding: 10px;
		margin-bottom: 20px;
	}
	.access-nav {
		margin-top: 1em;
	}
	.scrollable {
		margin-top: 1em;
		display: grid;
		grid-template-columns: fit-content(300px) auto fit-content(300px);
	}

	.scroll {
		display: flex;
		flex: initial;
		flex-direction: row;
		justify-content: space-evenly;
		overflow-y: hidden;
		overflow-x: hidden;
		white-space: nowrap;
	}
</style>

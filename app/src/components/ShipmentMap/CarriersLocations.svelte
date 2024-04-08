<script lang="ts">
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';
	import clsx from 'clsx';
	import { createEventDispatcher, getContext } from 'svelte';
	import { Marker, Popup } from 'svelte-maplibre';
	import type { MapContext } from 'svelte-maplibre/context.svelte';
	import Button from '../Buttons/Button.svelte';

	export let carriers: ApiCarrierAccount[];
	export let selectedCarrier: ApiCarrierAccount | undefined = undefined;

	const dispatch = createEventDispatcher<{ makeOfferClick: MouseEvent }>();

	const onMakeOfferClick = (e: MouseEvent) => {
		dispatch('makeOfferClick', e);
	};

	const onMarkerClick = (carrier: ApiCarrierAccount) => {
		selectedCarrier = carrier;
	};

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: displayedLocations = carriers;

	$: if ($store) {
		map = $store;
	}

	const fitCarriersToBounds = () => {
		const bounds = map.getBounds();

		displayedLocations = carriers.filter(
			({
				account: {
					availability: { location }
				}
			}) => bounds.contains([location.longitude, location.latitude])
		);
	};

	$: if (map) {
		map.on('dragend', (e) => {
			fitCarriersToBounds();
		});

		map.on('zoomend', (e) => {
			fitCarriersToBounds();
		});
	}

	$: console.log(selectedCarrier);
</script>

{#each displayedLocations as { publicKey, account }, i (publicKey)}
	{@const name = account.name}
	{@const location = account.availability.location}
	{@const offersCount = account.offersCount}
	{@const taskCount = account.tasksCount}
	{@const availableTime = account.availability.time}
	{@const selectedKey = selectedCarrier?.publicKey}

	<Marker
		on:click={() => onMarkerClick({ publicKey, account })}
		lngLat={[location.longitude, location.latitude]}
	>
		<Popup offset={[-5, -10]}>
			<div class="flex flex-col px-2 justify-center items-start">
				<div class="w-full text-center">
					<div
						class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-base font-bold"
					>
						{name}
					</div>
				</div>

				<div class="mt-2 text-neutral-600 text-sm">
					Offers: {offersCount}
				</div>
				<div class="text-neutral-600 text-sm">
					Tasks: {taskCount}
				</div>
				<div class="text-neutral-600 text-sm">
					Available on: {new Date(availableTime).toLocaleTimeString()}
				</div>

				<div class="w-full text-center">
					<Button class="uppercase tracking-widest text-xs mt-2" on:click={onMakeOfferClick}
						>Make offer</Button
					>
				</div>
			</div>
		</Popup>
		<div
			class={clsx(
				'carrier pin bounce cursor-pointer',
				selectedKey === publicKey ? 'active' : 'inactive'
			)}
		></div>
		{#if selectedKey === publicKey}
			<div class="pulse"></div>
		{/if}
	</Marker>
{/each}

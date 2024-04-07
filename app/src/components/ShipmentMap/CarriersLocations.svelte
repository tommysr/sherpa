<script lang="ts">
	import { Marker, Popup } from 'svelte-maplibre';
	import clsx from 'clsx';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { MapContext } from 'svelte-maplibre/context.svelte';
	import type { ApiCarrierAccount } from '$src/utils/account/carrier';

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
		<Popup>
			<div class="flex align-items-center flex-col rounded-lg cursor-pointer">
				Name: {name}<br />
				Offers: {offersCount}<br />
				Tasks: {taskCount}<br />
				Available on: {new Date(availableTime).toUTCString()}<br />
				Key: {publicKey}<br />
				<button
					class="border rounded-xl border-primary-500 px-2 py-1 text-sm font-md"
					on:click={onMakeOfferClick}>Make offer</button
				>
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

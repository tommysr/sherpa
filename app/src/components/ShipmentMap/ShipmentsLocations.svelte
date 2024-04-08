<script lang="ts">
	import type { ApiShipmentAccount } from '$src/utils/account/shipment';
	import clsx from 'clsx';
	import { LngLatBounds } from 'maplibre-gl';
	import { getContext } from 'svelte';
	import { GeoJSON as GeoJson, LineLayer, Marker } from 'svelte-maplibre';
	import type { MapContext } from 'svelte-maplibre/context.svelte';

	export let shipments: ApiShipmentAccount[];
	export let selectedShipment: ApiShipmentAccount | undefined = undefined;

	function isSelected(key: string) {
		return selectedShipment ? selectedShipment.publicKey == key : false;
	}

	$: selectedShipmentLocation = selectedShipment?.account.shipment.geography;

	const getBounds = ([lng1, lat1], [lng2, lat2]): LngLatBounds => {
		return new LngLatBounds([
			Math.min(lng1, lng2),
			Math.min(lat1, lat2),
			Math.max(lng1, lng2),
			Math.max(lat1, lat2)
		]);
	};

	$: if (selectedShipmentLocation !== undefined) {
		flyToLocation(
			getBounds(
				[selectedShipmentLocation.from.longitude, selectedShipmentLocation.from.latitude],
				[selectedShipmentLocation.to.longitude, selectedShipmentLocation.to.latitude]
			)
		);
	}

	let store = getContext<MapContext>(Symbol.for('svelte-maplibre')).map;
	let map: maplibregl.Map;

	$: if ($store) {
		map = $store;
	}

	const onMarkerClick = (shipment: ApiShipmentAccount) => {
		selectedShipment = shipment;
	};

	function flyToLocation(bounds: LngLatBounds) {
		map.fitBounds(bounds, {
			duration: 2000,
			animate: true,
			// offset: isMobile ? [0, -100] : [-200, 0],
			// padding: {'right': 600, 'left':100},
			padding: 100
		});
		// map.flyTo({
		// 	center: location,
		// 	zoom: isMobile ? 7 : 8,
		// 	duration: 2000,
		// 	offset: isMobile ? [0, -100] : [-200, 0]
		// });
	}
</script>

{#each shipments as shipment}
	{@const location = shipment.account.shipment.geography}
	{@const selectedKey = selectedShipment?.publicKey}
	{@const currentKey = shipment.publicKey}

	<Marker
		on:click={() => onMarkerClick(shipment)}
		lngLat={[location.from.longitude, location.from.latitude]}
	>
		<div
			class={clsx(
				'pin bounce-a cursor-pointer',
				selectedKey === currentKey ? 'active' : 'inactive'
			)}
		></div>
		{#if selectedKey === currentKey}
			<div class="pulse"></div>
		{/if}
	</Marker>

	{#if selectedKey === currentKey}
		<Marker lngLat={[location.to.longitude, location.to.latitude]}>
			<div class={clsx('pin', 'active')}></div>
			<div class="pulse"></div>
		</Marker>

		<GeoJson
			data={{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: [
						[location.from.longitude, location.from.latitude],
						[location.to.longitude, location.to.latitude]
					]
				}
			}}
		>
			<LineLayer
				layout={{
					'line-cap': 'round',
					'line-join': 'round'
				}}
				paint={{
					'line-width': 1,
					'line-color': '#3b2871',
					'line-opacity': 0.8
				}}
			/>
		</GeoJson>
	{/if}
{/each}

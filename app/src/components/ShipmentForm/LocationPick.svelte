<script lang="ts">
	import ShipmentMap from '../ShipmentMap/ShipmentMap.svelte';
	import { LngLat } from 'maplibre-gl';

	let shipmentSourceCoords: LngLat = new LngLat(15, 50);
	let shipmentDestinationCoords: LngLat = new LngLat(15, 50);
</script>

<div>
	<div>
		<table>
			<tbody>
				<tr>
					<td>Source Location Coordinates</td>
					<td>
						<div data-type="amount">
							<span>Longitude: {shipmentSourceCoords.lng.toFixed(6)}</span>
							<span>Latitude: {shipmentSourceCoords.lat.toFixed(6)}</span>
						</div>
					</td>
				</tr>

				<tr>
					<td>Destination Location Coordinates</td>
					<td>
						<div data-type="amount">
							<span>Longitude: {shipmentDestinationCoords.lng.toFixed(6)}</span>
							<span>Latitude: {shipmentDestinationCoords.lat.toFixed(6)}</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div>
		<ShipmentMap
			bind:sourceLocation={shipmentSourceCoords}
			bind:destinationLocation={shipmentDestinationCoords}
		/>
	</div>
</div>

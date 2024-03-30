<script lang="ts">
	import type { ShipmentDetails } from '$src/utils/account/shipment';
</script>

<label for="count">Count</label>
<input name="count" type="number" min="1" step="1" placeholder="count" value="1" required />

<label for="priority">Priority</label>
<input name="priority" type="range" min="1" max="5" step="1" value="2" required />

<label for="fragility">Fragility</label>
<input name="fragility" type="range" min="1" max="5" step="1" value="1" required />

<select name="access" required>
	<option selected disabled value="0"> Tell how hard is to access source place </option>
	<option value="1">Only car</option>
	<option value="2">Truck up to 10t</option>
	<option value="3">Truck over 10t</option>
	<option value="4">Something else</option>
	<option value="5">Can't tell</option>
</select>

<script lang="ts">
	export let count: number = 1;
</script>

<div class="amount">
	<label for="amount">Count</label>
	<input
		id="amount"
		name="amount"
		type="number"
		min="1"
		step="1"
		placeholder="1"
		required
		bind:value={count}
	/>
</div>

<label for="priority">Priority</label>
<input
	id="priority"
	name="priority"
	list="priorities"
	type="range"
	min="1"
	max="7"
	step="1"
	value="3"
	required
/>
<datalist id="priorities">
	<option value="1">Min</option>
	<option value="2">Low</option>
	<option value="3">Medium</option>
	<option value="4">High</option>
	<option value="5">Max</option>
</datalist>

<label for="fragility">Fragility</label>
<input
	id="priority"
	name="priority"
	list="priorities"
	type="range"
	min="1"
	max="7"
	step="1"
	value="3"
	required
/>
<datalist id="priorities">
	<option value="1">Min</option>
	<option value="2">Low</option>
	<option value="3">Medium</option>
	<option value="4">High</option>
	<option value="5">Max</option>
</datalist>

<!-- 
  ><fieldset>
    <legend>Describe the package:</legend>
    <label>
      <input type="radio" name="fragility" checked />
      Ice Packaging
    </label>
    <label>
      <input type="radio" name="fragility" />
      Vacuum-Sealed Packaging
    </label>
    <label>
      <input type="radio" name="fragility" />
      Glass Containers
    </label>
    <label>
      <input type="radio" name="fragility" />
      Thin Plastic Wrap
    </label>
  </fieldset></td
>
</tr> -->
<!-- //</tbody>
<tfoot>

<td colspan="2">
  <fieldset>
    <legend>Shipment preferences:</legend>
    <input type="checkbox" id="international" name="international" />
    <label for="international">International</label>
    <input type="checkbox" id="tracked" name="tracked" />
    <label for="tracked">Tracked shipping</label>
    <input type="checkbox" id="signature" name="signature" />
    <label for="signature">Signature Required</label>
  </fieldset></td
>
</tr> -->
-->

<style lang="scss">
	.amount {
		margin-bottom: 20px;
		margin-top: 20px;
	}
</style>

<script lang="ts">
	export let name: string = 'datetime-local';
	export let date = new Date();
</script>

<tr>
	<td>
		<label for={name}>{name}</label>
	</td>
	<td>
		<input type="datetime-local" {name} aria-label="Datetime local" required bind:value={date} />
	</td>
</tr>

<style class="scss">
</style>

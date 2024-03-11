<script lang="ts">
	export let name: string = 'datetime-local';
	export let date = new Date();
</script>

<div class="grid">
	<h5>
		{name}
	</h5>
	<input type="datetime-local" {name} aria-label="Datetime local" required bind:value={date} />
</div>

<style class="scss">
</style>

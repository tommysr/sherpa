<script lang="ts">
	import { Control, ControlButton, ControlGroup } from 'svelte-maplibre';
	import { page } from '$app/stores';


	$: key = $page.params['carrierKey']
</script>

<Control position="top-left">
	<ControlGroup>
		<a href="/carrier/{key}/incoming">
			<ControlButton>N</ControlButton>
		</a>
		<a href="/carrier/{key}/accepted">
			<ControlButton>A</ControlButton>
		</a>
	</ControlGroup>
</Control>

<slot />
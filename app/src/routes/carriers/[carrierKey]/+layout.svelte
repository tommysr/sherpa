<script lang="ts">
	import { Control, ControlButton, ControlGroup } from 'svelte-maplibre';
	import { page } from '$app/stores';
</script>

<Control class="flex flex-col gap-y-2">
	<ControlGroup>
		<a href="{$page.url.pathname}/made">
			<ControlButton>N</ControlButton>
		</a>
		<a href="{$page.url.pathname}/accepted">
			<ControlButton>A</ControlButton>
		</a>
	</ControlGroup>
</Control>

<slot />

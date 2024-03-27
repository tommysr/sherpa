<script lang="ts">
	import NotificationLink from './NotificationLink.svelte';

	export let signature: string | undefined;
	export let title: string;
	export let text: string | undefined;
</script>

<div class="flex flex-col justify-around items-start">
	<div
		class="w-full text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold"
	>
		<h2>{title}</h2>
	</div>
	<div class="flex items-center space-x-2">
		<slot />
		{#if signature}<NotificationLink {signature} />{/if}

		{#if text}
			<p class="text-sm">{text}</p>
		{/if}
	</div>
</div>

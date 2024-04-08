<script lang="ts">
	import Notification from './Notification.svelte';
	import { notificationStore } from './notificationsStore';
</script>

<slot />

<div class="fixed bottom-0 left-0 z-40">
	{#each $notificationStore as notification}
		<Notification {notification} />
	{/each}
</div>

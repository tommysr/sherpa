<script lang="ts">
	import Notification from './Notification.svelte';
	import { notificationStore } from './notificationsStore';

	export let notificationComponent: ConstructorOfATypedSvelteComponent;
</script>

<slot />
<div>
	<div class="fixed bottom-0 left-0">
		{#each $notificationStore as notification}
			<Notification {notification} {notificationComponent} />
		{/each}
	</div>
</div>

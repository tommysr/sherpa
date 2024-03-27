<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { removeNotification, updateNotification, type INotification } from './notificationsStore';

	export let notificationComponent: ConstructorOfATypedSvelteComponent;
	export let notification: INotification;

	const removeNotificationHandler = () => removeNotification(id);
	let timeout: NodeJS.Timeout;
	let timeout2: NodeJS.Timeout;

	$: ({ id, removeAfter, text, signature } = notification);

	$: if (removeAfter) {
		timeout = setTimeout(removeNotificationHandler, removeAfter);
		clearTimeout(timeout2);
	}

	onMount(() => {
		timeout2 = setTimeout(() => {
			updateNotification(id, { text, removeAfter: 3000, type: 'unknown', signature });
		}, 15000);
	});

	onDestroy(() => {
		if (removeAfter && timeout) {
			clearTimeout(timeout);
			clearTimeout(timeout2);
		}
	});
</script>

<svelte:component
	this={notificationComponent}
	{notification}
	onRemove={removeNotificationHandler}
/>

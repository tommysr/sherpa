<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { INotification } from './notificationsStore';
	import NotificationLoader from './NotificationLoader.svelte';
	import NotificationWrapper from './NotificationWrapper.svelte';

	export let notification: INotification;
</script>

<div class="bg-white shadow-lg flex rounded-2xl w-72 h-24 m-5 px-5 py-2" in:fade out:fade>
	{#if notification.type == 'success'}
		<NotificationWrapper
			signature={notification.signature}
			title={`${notification.text} confirmed`}
			text={undefined}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="#16df16e5"
				class="bi bi-check-circle-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
				/>
			</svg>
		</NotificationWrapper>
	{:else if notification.type == 'failed'}
		<NotificationWrapper
			signature={notification.signature}
			title={`${notification.text} failed`}
			text={undefined}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="#ca2c2c"
				class="bi bi-x-circle-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
				/>
			</svg>
		</NotificationWrapper>
	{:else if notification.type == 'unknown'}
		<NotificationWrapper
			signature={notification.signature}
			title={`${notification.text} unknown`}
			text={undefined}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="#df9432"
				class="bi bi-question-circle-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"
				/>
			</svg>
		</NotificationWrapper>
	{:else}
		<NotificationWrapper
			signature={notification.signature}
			title={`Confirming transaction`}
			text={`Transaction: ${notification.text}`}
		>
			<NotificationLoader />
		</NotificationWrapper>
	{/if}
</div>

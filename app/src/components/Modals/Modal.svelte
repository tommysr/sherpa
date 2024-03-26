<script>
	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="backdrop:backdrop-blur-sm rounded-3xl p-4 bg-white shadow-lg max-w-sm xl:max-w-md w-full z-index-1"
>
	<div class="absolute top-5 right-5 text-lg">
		<button on:click={() => (showModal = false)}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-11 cursor-pointer">
				<path
					stroke="var(--secondary)"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
					d="M368 368L144 144M368 144L144 368"
				/>
			</svg></button
		>
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="p-5">
		<slot />
	</div>
</dialog>

<style>
	dialog[open] {
		animation: zoom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.5s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

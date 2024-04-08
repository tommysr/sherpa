<script lang="ts">
	import { page } from '$app/stores';
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import clsx from 'clsx';
	import { get } from 'svelte/store';

	let isMobileOpen = false;
	$: isWalletConnected = $walletStore.publicKey != null;

	const routes = [
		{
			name: 'Incoming'
		},
		{
			name: 'Accepted'
		}
	];

	$: key = $page.params['carrierKey'];
	$: absolutePath = `/carrier/${key}`;
	$: url = $page.url.pathname;
	$: carrierPage = url.split('/').at(-1);
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if !isWalletConnected}
		<div class="w-full flex justify-center items-center">
			<p
				class="text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-2/3"
			>
				Connect your wallet to view shipments
			</p>
		</div>
	{:else}
		<div class="h-full flex w-full flex-col items-center">
			<div class="inline-flex shadow-sm bg-white rounded-lg m-4 flex-none">
				{#each routes as { name }, i}
					<a href={`${absolutePath}/${name.toLowerCase()}`}>
						<button
							aria-current="page"
							class={clsx(
								'px-4 py-2 text-md font-semibold',
								carrierPage == name.toLowerCase()
									? 'bg-gradient-to-r from-primary to-secondary text-white'
									: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
								i == 0 && 'rounded-l-lg',
								i == routes.length - 1 && 'rounded-r-lg'
							)}
						>
							{name}
						</button>
					</a>
				{/each}
			</div>
			<slot />
		</div>
	{/if}
</LayoutListWrapper>

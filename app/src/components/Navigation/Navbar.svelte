<script lang="ts">
	import clsx from 'clsx';

	import Logo from '$lib/images/logo.png';
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';

	import { page } from '$app/stores';

	$: currentPage = $page.url.pathname;
	$: isNavbarOpen = false;

	const navigation = [
		{
			name: 'Shippers',
			link: '/shipments'
		},
		{
			name: 'Forwarders',
			link: '/forwarder'
		},
		{
			name: 'Carriers',
			link: '/carrier'
		}
	];
</script>

<header class="">
	<nav class="lg:flex items-center justify-between p-3 hidden px-10">
		<div class="flex lg:flex-1">
			<a class="p-2" href="/"> <img class="h-8 w-auto" src={Logo} alt="LOGO" /></a>
		</div>

		<div class="lg:flex lg:gap-x-10">
			{#each navigation as { name, link }}
				<a href={link} class={clsx('custome-button', currentPage === link ? 'active-nav' : '')}>
					{name}
				</a>
			{/each}
		</div>

		<div class="flex lg:flex-1 lg:justify-end">
			<WalletMultiButton onClose={() => {}} />
		</div>
	</nav>

	<div class="flex justify-end px-5 py-3 lg:hidden">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			class={clsx('relative z-10 w-12 cursor-pointer', isNavbarOpen ? 'hidden' : '')}
			on:click={() => (isNavbarOpen = !isNavbarOpen)}
		>
			<path
				stroke="var(--primary)"
				stroke-linecap="round"
				stroke-miterlimit="10"
				stroke-width="32"
				d="M80 160h352M80 256h352M80 352h352"
			/>
		</svg>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			class={clsx('relative z-10 w-12 cursor-pointer', !isNavbarOpen ? 'hidden' : '')}
			on:click={() => (isNavbarOpen = !isNavbarOpen)}
		>
			<path
				stroke="var(--secondary)"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="32"
				d="M368 368L144 144M368 144L144 368"
			/>
		</svg>

		<div
			class={clsx(
				'fixed left-0 z-20 top-0 flex flex-col h-screen w-full items-center justify-between bg-background',
				!isNavbarOpen ? 'hidden' : ''
			)}
		>
			<div></div>
			<nav class="">
				<ul class="flex h-3/4 flex-col items-center space-y-12">
					{#each navigation as { name, link }}
						<a
							href={link}
							on:click={() => (isNavbarOpen = false)}
							class={clsx('custome-button', currentPage === link ? 'active-nav' : '')}
						>
							{name}
						</a>
					{/each}
				</ul>
			</nav>

			<div class="mb-5">
				<WalletMultiButton onClose={() => (isNavbarOpen = false)} />
			</div>
		</div>
	</div>
</header>

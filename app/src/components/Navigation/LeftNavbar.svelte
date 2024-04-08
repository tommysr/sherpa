<script lang="ts">
	import clsx from 'clsx';

	import { page } from '$app/stores';

	import { userStore } from '$src/stores/user';
	import { walletStore } from '$src/stores/wallet';
	import WalletMultiButton from '../Wallet/WalletMultiButton.svelte';
	import BoxIcon from './NavbarIcons/BoxIcon.svelte';
	import DashboardIcon from './NavbarIcons/DashboardIcon.svelte';
	import HomeIcon from './NavbarIcons/HomeIcon.svelte';
	import IssuedIcon from './NavbarIcons/IssuedIcon.svelte';
	import PlusIcon from './NavbarIcons/PlusIcon.svelte';
	import SendIcon from './NavbarIcons/SendIcon.svelte';
	import TrackIcon from './NavbarIcons/TrackIcon.svelte';

	import logoImage from '$lib/images/logo-small.svg';

	$: currentPage = $page.url.pathname;
	$: isNavbarOpen = false;

	$: carrierRoute =
		$userStore.carrier.registered && $walletStore.publicKey
			? `${$walletStore.publicKey.toString()}/incoming`
			: 'register';

	$: navigation = [
		{
			name: 'Home',
			link: '/',
			svg: HomeIcon
		},
		{
			name: 'Shippers',
			link: '/shipmentsMap',
			svg: BoxIcon,
			routes: [
				{
					name: 'Issued',
					link: '/shipmentsMap/issued',
					svg: IssuedIcon
				},
				{
					name: 'Create',
					link: '/shipmentsMap/create',
					svg: PlusIcon
				}
			]
		},
		{
			name: 'Forwarders',
			link: '/forwarder/bought',
			svg: SendIcon
		},

		{
			name: 'Carriers',
			link: '/carrier',
			svg: TrackIcon,
			routes: [
				{
					name: 'Dashboard',
					link: `/carrier/${carrierRoute}`,
					svg: DashboardIcon
				}
			]
		}
	];
</script>

<nav class="hidden md:block">
	<div class="fixed left-5 top-5 z-10">
		<a href="/">
			<img src={logoImage} alt="logo" class="w-16" />
		</a>
	</div>

	<div
		class="fixed left-5 w-10 z-10 bg-white rounded-full top-1/2 transform -translate-y-1/2 py-1.5 px-7 shadow-lg"
	>
		<div class="flex flex-col items-center justify-center space-y-3">
			{#each navigation as { name, link, svg, routes }}
				<div
					class={clsx(
						'flex flex-col justify-center items-center space-y-4 rounded-full px-2.5 py-4',
						currentPage.includes(link) && routes ? 'bg-primary-100' : ''
					)}
				>
					<div class={clsx('group relative')}>
						<a href={link}
							><svelte:component
								this={svg}
								className={clsx(
									'hover:scale-125 transition-all ease-in-out duration-150',
									currentPage === link ? 'fill-primary' : 'fill-gray-500'
								)}
							/></a
						>
						<span
							class="opacity-0 group-hover:opacity-100 duration-300 bg-white absolute left-12 -top-2 p-2 rounded-lg shadow"
						>
							{name}
						</span>
					</div>

					{#if routes && currentPage.includes(link)}
						{#each routes as { name, link, svg }}
							<div class="group relative">
								<a href={link}
									><svelte:component
										this={svg}
										className={clsx(
											'hover:scale-125 transition-all ease-in-out duration-150',
											currentPage === link ? 'fill-primary' : 'fill-gray-500'
										)}
									/></a
								>
								<span
									class="opacity-0 group-hover:opacity-100 duration-300 bg-white absolute left-11 -top-3 p-2 rounded-lg shadow"
								>
									{name}
								</span>
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="fixed top-7 right-7 z-40">
		<WalletMultiButton onClose={() => {}} />
	</div>
</nav>

<nav class="md:hidden">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		class={clsx('fixed z-30 right-0 w-12 m-5 cursor-pointer', isNavbarOpen ? 'hidden' : '')}
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
		class={clsx('fixed z-30 right-0 w-12 m-5 cursor-pointer', !isNavbarOpen ? 'hidden' : '')}
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
				{#each navigation as { name, link, routes }}
					<div
						class={clsx(
							'p-5 rounded-xl flex flex-col justify-center items-center',
							routes && currentPage.includes(link) ? 'bg-primary-100' : ''
						)}
					>
						<a
							href={link}
							on:click={() => (isNavbarOpen = false)}
							class={clsx(
								'text-2xl',
								currentPage === link
									? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
									: ''
							)}
						>
							{name}
						</a>

						{#if routes && currentPage.includes(link)}
							{#each routes as { name, link, svg }}
								<div class="mt-5">
									<a on:click={() => (isNavbarOpen = false)} href={link} class="text-sm">{name}</a>
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			</ul>
		</nav>

		<div class="mb-5">
			<WalletMultiButton onClose={() => (isNavbarOpen = false)} />
		</div>
	</div>
</nav>

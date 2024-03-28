<script lang="ts">
	import clsx from 'clsx';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import BoxIcon from './NavbarIcons/BoxIcon.svelte';
	import HomeIcon from './NavbarIcons/HomeIcon.svelte';
	import SendIcon from './NavbarIcons/SendIcon.svelte';
	import TrackIcon from './NavbarIcons/TrackIcon.svelte';

	$: currentPage = $page.url.pathname;
	$: isNavbarOpen = false;

	const navigation = [
		{
			name: 'Home',
			link: '/',
			svg: HomeIcon
		},
		{
			name: 'Shippers',
			link: '/shipmentsMap',
			svg: BoxIcon
		},
		{
			name: 'Forwarders',
			link: '/forwarder',
			svg: SendIcon
		},
		{
			name: 'Carriers',
			link: '/carrier',
			svg: TrackIcon
		}
	];
</script>

<nav
	class="fixed left-5 w-10 z-10 bg-white rounded-full top-1/2 transform -translate-y-1/2 py-7 px-6 shadow-lg"
>
	<div class="flex flex-col items-center justify-center space-y-8">
		{#each navigation as { name, link, svg }}
			<button
				on:click={() => goto(link)}
				data-tooltip-target="tooltip-right"
				data-tooltip-placement="right"
				><svelte:component
					this={svg}
					className={clsx(currentPage === link ? 'fill-primary' : 'fill-gray-500')}
				/></button
			>
		{/each}
	</div>
</nav>

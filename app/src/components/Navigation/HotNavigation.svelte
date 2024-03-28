<script lang="ts">
	import { page } from '$app/stores';

	export let searchValue: string = '';

	$: ({ url } = $page);

	// TODO: consider how to do it, if it should be final component or reusable one
	$: paths = [
		{
			name: 'Latest',
			href: '/orders/latest',
			isActive: url.pathname === '/orders/latest' ? true : false
		},
		{
			name: 'Nearest',
			href: '/orders/nearest',
			isActive: url.pathname === '/orders/nearest' ? true : false
		}
	];
</script>

<div class="flex justify-start items-center p-3">
	<!-- <div class="flex lg:gap-x-2">
		{#each paths as { name, href }}
			<a {href}>
				<div
					class="mx-1 px-4 py-1 text-sm text-orange-600 font-semibold rounded-full border border-orange-200 hover:text-white hover:bg-orange-600"
				>
					{name}
				</div>
			</a>
		{/each}
	</div> -->
	<div>
		<input
			class="outline-none max-w-70 text-black rounded-full border border-white px-4 py-1"
			type="search"
			name="search"
			placeholder="Search"
			aria-label="Search"
			bind:value={searchValue}
			on:keyup
		/>
	</div>
</div>

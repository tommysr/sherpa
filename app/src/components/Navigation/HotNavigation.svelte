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

<div class="flex  justify-between items-center p-3">
	<div class="flex lg:gap-x-2">
		{#each paths as { name, href }}
			<a {href}>
				<div
					class="mx-1 px-4 py-1 text-sm text-orange-600 font-semibold rounded-full border border-orange-200 hover:text-white hover:bg-orange-600"
				>
					{name}
				</div>
			</a>
		{/each}
		<!-- <nav>
			<ul>
			
			</ul>
		</nav> -->
	</div>
	<div>
		<input
			class="outline-none bg-[theme(colors.turquoise)] max-w-70 text-white rounded-full border border-white px-4 py-1 text-sm font-semibold"
			type="search"
			name="search"
			placeholder="Search"
			aria-label="Search"
			bind:value={searchValue}
			on:keydown
		/>
	</div>
</div>

<style lang="scss">
	// .navigation {
	// 	margin-top: 20px;
	// }
</style>

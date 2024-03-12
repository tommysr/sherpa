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

<div class="grid navigation">
	<div>
		<nav>
			<ul>
				{#each paths as { name, href }}
					<li><a {href}>{name}</a></li>
				{/each}
			</ul>
		</nav>
	</div>
	<div>
		<input
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
	.navigation {
		margin-top: 20px;
	}
</style>

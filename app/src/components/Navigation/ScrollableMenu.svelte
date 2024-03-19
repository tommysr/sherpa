<script lang="ts">
	let scrollableMenu: HTMLDivElement;

	function scrollCategoryMenuRight() {
		const scrollLeft = scrollableMenu.scrollLeft + scrollableMenu.offsetWidth;
		scrollableMenu.scrollTo({ left: scrollLeft });
	}

	function scrollCategoryMenuLeft() {
		const scrollLeft = Math.max(scrollableMenu.scrollLeft - scrollableMenu.offsetWidth, 0);
		scrollableMenu.scrollTo({ left: scrollLeft });
	}
</script>

<div class="flex mt-4">
	<button
		class="mx-1 px-4 py-1 text-sm text-orange-600 font-semibold border-none"
		on:click={scrollCategoryMenuLeft}>-</button
	>
	<div class="flex overflow-x-hidden" bind:this={scrollableMenu}>
		<slot />
	</div>
	<button
		class=" mx-1 px-4 py-1 text-sm text-orange-600 font-semibold border-none"
		on:click={scrollCategoryMenuRight}>+</button
	>
</div>

<style lang="scss">
	// .scrollable {
	// 	margin-top: 20px;
	// 	display: grid;
	// 	grid-template-columns: 50px auto 50px;
	// }

	// .scroll {
	// 	display: flex;
	// 	overflow-x: hidden;
	// 	gap: 20px;
	// }
</style>

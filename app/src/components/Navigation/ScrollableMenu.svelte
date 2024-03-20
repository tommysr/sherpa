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
</style>

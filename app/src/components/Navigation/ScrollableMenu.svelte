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

<div class="scrollable">
	<button class="secondary" on:click={scrollCategoryMenuLeft}>-</button>
	<div class="scroll" bind:this={scrollableMenu}>
		<slot />
	</div>
	<button class="secondary" on:click={scrollCategoryMenuRight}>+</button>
</div>

<style lang="scss">
	.scrollable {
		margin-top: 20px;
		display: grid;
		grid-template-columns: 50px auto 50px;
	}

	.scroll {
		display: flex;
		overflow-x: hidden;
		gap: 20px;
	}
</style>

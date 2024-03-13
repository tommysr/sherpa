<script lang="ts">
</script>

<div class="card">
	<article>
		<header>
			<slot name="header" />
		</header>
		<div class="grid">
			<div>
				<slot name="first-info" />
			</div>
			<div>
				<slot name="second-info" />
			</div>
			<div>
				<slot name="third-info" />
			</div>
		</div>
		<footer>
			<slot name="footer" />
		</footer>
	</article>
</div>

<style lang="scss">
	.card {
		margin-bottom: 20px;
	}
</style>

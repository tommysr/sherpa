<script lang="ts">
</script>

<div class="card">
	<article>
		<header>
			<slot name="name" />
		</header>
		<div class="grid">
			<div>
				<slot name="image" />
			</div>
			<div>
				<slot name="first-info" />
			</div>
			<div>
				<slot name="second-info" />
			</div>
		</div>
	</article>
	<article>
		<slot name="details" />
		<footer>
			<slot name="footer-info" />
		</footer>
	</article>
</div>

<style lang="scss">
	.card {
		margin-bottom: 20px;
	}
</style>

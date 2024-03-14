<script lang="ts">
</script>

<div class="card">
	<article>
		<!-- <header>
			<slot name="header" />
		</header> -->
		<div class="mygrid">
			<div class="info">
				<slot name="first-info" />
			</div>
			<div class="info">
				<slot name="second-info" />
			</div>
			<div class="info">
				<slot name="third-info" />
			</div>
			<div class="info">
				<slot name="fourth-info" />
			</div>
		</div>
		<footer>
			<slot name="footer" />
		</footer>
	</article>
</div>

<style lang="scss">
	.mygrid {
		display: grid;
		grid-template-columns: 1fr 2.5fr 2.5fr 1fr;
	}
	.info {
		text-align: left;
		display: flex;
		align-content: center;
		align-items: center;
	}

	footer {
		display: flex;
		justify-content: space-between;
	}

	.grid :last-child {
		display: flex;
		justify-content: flex-end;
	}

	.card {
		margin-bottom: 20px;
	}
</style>

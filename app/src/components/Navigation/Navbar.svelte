<script lang="ts">
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import Logo from '$lib/images/logo.png';
</script>

<header class="container">
	<nav>
		<div>
			<a href="/orders"> <img src={Logo} alt="LOGO" /></a>
		</div>

		<ul>
			<li><a href="/orders">Sellers</a></li>
			<li><a href="/orders/bought">Forwarders</a></li>
			<li><a href="/carrier">Carriers</a></li>
		</ul>

		<div>
			<WalletMultiButton />
		</div>
	</nav>
</header>

<style lang="scss">
	div {
		margin-top: 20px;
	}
</style>

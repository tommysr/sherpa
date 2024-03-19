<script lang="ts">
	import WalletMultiButton from '$src/components/Wallet/WalletMultiButton.svelte';
	import Logo from '$lib/images/logo.png';
</script>

<header class="bg-[theme(colors.turquoise)]">
	<nav class="flex items-center justify-between p-3">
		<div class="flex lg:flex-1">
			<a class="-m-2 p-2" href="/shipments"> <img class="h-8 w-auto" src={Logo} alt="LOGO" /></a>
		</div>

		<div class="lg:flex lg:gap-x-10">
			<a href="/shipments" class="text-sm font-semibold">Shippers</a>
			<a href="/shipments/add" class="text-sm font-semibold">Forwarders</a>
			<a href="/carrier" class="text-sm font-semibold">Carriers</a>
		</div>

		<div class="flex lg:flex-1 lg:justify-end">
			<WalletMultiButton />
		</div>
	</nav>
</header>

<style lang="scss">
</style>

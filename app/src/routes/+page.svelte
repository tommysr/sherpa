<script>
	import image from '$lib/images/logo.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="container mx-auto flex justify-center items-center flex-col mt-56">
	<div class="font-bold text-gray-300 text-7xl lg:text-8xl xl:text-9xl">
		<p class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Transhub</p>
	</div>
	<div class="mt-16 w-3/4 xl:w-3/5 text-center">
		<p class="flex text-sm font-semibold text-gray-400 lg:text-lg justify-center items-center">
			Powered by Solana <img src={image} alt="Solana" class="ml-4" width="30" />
		</p>
	</div>
</main>

import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	optimizeDeps: {
		include: ['@coral-xyz/anchor', '@solana/web3.js', 'buffer']
	},

	kit: {
		alias: {
			$src: './src/',
			'$src/*': './src/*',
			'$components/*': './src/components/*',
			$utils: './src/utils',
			'$utils/*': './src/utils/*',
			$tests: './tests',
			'$tests/*': './tests/*',
			'$stores/*': './src/stores/*',
			'$actions/*': './src/actions/*',
			'$sdk/*': './src/sdk/*'
		},
		adapter: adapter()
	}
};

export default config;

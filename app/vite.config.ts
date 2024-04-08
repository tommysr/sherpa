import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';
import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			globals: {
				Buffer: true,
			}
		}),
	],
	resolve: {
		alias: {
			$src: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
			$stores: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'stores'),
			$components: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'components'),
			$utils: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'utils')
		}
	},

	ssr: {
		noExternal: ['@coral-xyz/anchor']
	},
	define: {
		'process.env.ANCHOR_BROWSER': true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

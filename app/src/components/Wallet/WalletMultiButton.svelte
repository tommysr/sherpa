<script lang="ts">
	import { walletStore, type WalletStore } from '$src/stores/wallet';
	import WalletButton from './WalletButton.svelte';
	import WalletConnectButton from './WalletConnectButton.svelte';
	import WalletModal from './WalletModal.svelte';

	export let maxNumberOfWallets = 6;
	export let onClose: CallbackType;

	$: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);

	let showWalletDisconnect = false;

	$: base58 = publicKey && publicKey?.toBase58();
	$: content = showAddressContent($walletStore);

	const openModal = () => walletStore.openModal();

	const closeModal = () => walletStore.closeModal();

	function showAddressContent(store: WalletStore) {
		const base58 = store.publicKey?.toBase58();
		if (!store.wallet || !base58) return null;
		return base58.slice(0, 4) + '..' + base58.slice(-4);
	}

	async function connectWallet(event: any) {
		closeModal();
		select(event.detail);
		await connect();
		onClose && onClose();
	}

	async function disconnectWallet(event: any) {
		await disconnect();
		onClose && onClose();
	}

	interface CallbackType {
		(arg?: string): void;
	}
</script>

{#if !wallet}
	<WalletButton class="wallet-adapter-button-trigger" on:click={openModal}>
		<slot>Connect Wallet</slot>
	</WalletButton>
{:else if !base58}
	<WalletConnectButton />
{:else}
	<div class="wallet-adapter-dropdown">
		<WalletButton
			on:click={disconnectWallet}
			on:mouseover={() => (showWalletDisconnect = true)}
			on:mouseout={() => (showWalletDisconnect = false)}
			class="wallet-adapter-button-trigger"
		>
			<svelte:fragment slot="start-icon">
				<img src={wallet.icon} alt={`${wallet.name} icon`} />
			</svelte:fragment>
			{showWalletDisconnect ? 'Disconnect' : content}
		</WalletButton>
	</div>
{/if}

{#if $walletStore.isModalVisible}
	<WalletModal on:close={closeModal} on:connect={connectWallet} {maxNumberOfWallets} />
{/if}

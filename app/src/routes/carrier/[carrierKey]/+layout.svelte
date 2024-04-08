<script lang="ts">
	import { page } from '$app/stores';
	import LayoutListWrapper from '$src/components/LayoutListWrapper.svelte';
	import { acceptedShipmentsOffersMeta } from '$src/stores/acceptedOffers';
	import { anchorStore } from '$src/stores/anchor';
	import type { ApiShipmentOfferAccount, ShipmentOffer } from '$src/utils/account/offer';
	import { parseOfferToApiOffer } from '$src/utils/parse/offer';

	import { shipmentsOffersMeta } from '$src/stores/offers';
	import { walletStore } from '$src/stores/wallet';
	import type {
		AcceptedShipmentOffer,
		ApiAcceptedShipmentOfferAccount
	} from '$src/utils/account/acceptedOffer';
	import { parseAcceptedOfferToApiAcceptedOffer } from '$src/utils/parse/acceptedOffer';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	const { program } = get(anchorStore);

	let isMobileOpen = false;
	$: isWalletConnected = $walletStore.publicKey != null;

	const routes = [
		{
			name: 'Incoming'
		},
		{
			name: 'Accepted'
		}
	];

	function subscribeToOffersEvents(): number[] {
		const unsubscribeOfferMade = program.addEventListener('OfferMade', async (event) => {
			const offerPublicKey = event.offer;

			// Carrier is only interested in offers made to him
			if (!$walletStore.publicKey || event.to.toString() != $walletStore.publicKey.toString()) {
				return;
			}

			const offer: ShipmentOffer = await program.account.shipmentOffer.fetch(offerPublicKey);

			const parsedOffer: ApiShipmentOfferAccount = {
				publicKey: offerPublicKey.toString(),
				account: parseOfferToApiOffer(offer)
			};

			shipmentsOffersMeta.update((s) => {
				s = [...s, parsedOffer];
				return s;
			});
		});

		// this is also information which forwarder cares about
		const unsubscribeOfferAccepted = program.addEventListener('OfferAccepted', async (event) => {
			const acceptedOfferPublicKey = event.offer;

			// Check not to include foreign offers just these which carrier accepted during session
			if (!$walletStore.publicKey || event.to.toString() != $walletStore.publicKey.toString()) {
				return;
			}

			const acceptedOffer: AcceptedShipmentOffer =
				await program.account.acceptedOffer.fetch(acceptedOfferPublicKey);

			const parsedOffer: ApiAcceptedShipmentOfferAccount = {
				publicKey: acceptedOfferPublicKey.toString(),
				account: parseAcceptedOfferToApiAcceptedOffer(acceptedOffer)
			};

			acceptedShipmentsOffersMeta.update((s) => {
				s = [...s, parsedOffer];
				return s;
			});
		});

		return [unsubscribeOfferMade, unsubscribeOfferAccepted];
	}

	onMount(() => {
		const unsubscribe = subscribeToOffersEvents();
		return () => {
			for (const listener of unsubscribe) {
				program.removeEventListener(listener);
			}
		};
	});

	$: key = $page.params['carrierKey'];
	$: absolutePath = `/carrier/${key}`;
	$: url = $page.url.pathname;
	$: carrierPage = url.split('/').at(-1);
</script>

<LayoutListWrapper bind:isMobileOpen>
	{#if !isWalletConnected}
		<div class="w-full flex justify-center items-center">
			<p
				class="text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-2/3"
			>
				Connect your wallet to view shipments
			</p>
		</div>
	{:else}
		<div class="h-full flex w-full flex-col items-center">
			<div class="inline-flex shadow-sm bg-white rounded-lg m-4 flex-none">
				{#each routes as { name }, i}
					<a href={`${absolutePath}/${name.toLowerCase()}`}>
						<button
							aria-current="page"
							class={clsx(
								'px-4 py-2 text-md font-semibold',
								carrierPage == name.toLowerCase()
									? 'bg-gradient-to-r from-primary to-secondary text-white'
									: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
								i == 0 && 'rounded-l-lg',
								i == routes.length - 1 && 'rounded-r-lg'
							)}
						>
							{name}
						</button>
					</a>
				{/each}
			</div>
			<slot />
		</div>
	{/if}
</LayoutListWrapper>

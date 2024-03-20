<script lang="ts">
	import BoughtShipmentCard from '$src/components/Shipment/BoughtShipmentCard.svelte';
	import ShipmentsMap from '$src/components/ShipmentMap/ShipmentsMap.svelte';
	import {
		searchableBoughtShipments,
		type SearchableBoughtOrder
	} from '$src/stores/forwarderShipments';
	import type {
		ApiShipmentAccount,
		GeoLocation,
		Geography,
		ShipmentAccount
	} from '$src/utils/idl/shipment';
	import type { ComponentEvents } from 'svelte';
	import type { PageData } from './$types';
	import { Marker, Popup } from 'svelte-maplibre';
	import CategoryButton from '$src/components/Buttons/CategoryButton.svelte';
	import SimpleButton from '$src/components/Buttons/SimpleButton.svelte';
	import {
		encodeName,
		getBoughtShipmentAddress,
		getCarrierAddress,
		getForwarderAddress,
		getOfferAddress
	} from '$sdk/sdk';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';
	import { anchorStore } from '$src/stores/anchor';
	import OfferDetailsModal from '$src/components/Offer/OfferDetailsModal.svelte';
	import { BN } from 'bn.js';
	import { walletStore } from '$src/stores/wallet';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';

	export let data: PageData;
	let center: [number, number] = [19, 50];
	let isOfferDetailsOpen: boolean = false;
	let offerDetailsModal: OfferDetailsModal;
	let isOfferChosen: boolean = false;
	let shipmentChosen: SearchableBoughtOrder;

	$: locationsOnMap = $searchableBoughtShipments.data.map((s) => s.account.shipment.geography);

	$: carriers = data.carriers;

	async function makeOffer(carrier: string) {
		const { program, connection } = get(anchorStore);
		const wallet = get(walletStore);

		const carrierAddress = getCarrierAddress(program, new PublicKey(carrier));

		const carrierAccount = await program.account.carrier.fetchNullable(carrierAddress);

		if (!carrierAccount) {
			throw new Error('Carrier account not found');
		}

		const offerAddress = getOfferAddress(
			program,
			new PublicKey(carrier),
			carrierAccount.offersCount
		);

		isOfferDetailsOpen = true;

		// TODO: make cancelation
		const { time, price } = await waitForOfferDetails();

		const ix = await program.methods
			.makeOffer(new BN(price), time)
			.accounts({
				offer: offerAddress,
				shipment: new PublicKey(shipmentChosen.publicKey),
				forwarder: getForwarderAddress(program, wallet.publicKey!),
				carrier: carrierAddress,
				signer: wallet.publicKey!
			})
			.instruction();

		const tx = new Transaction().add(ix);
		const sig = await useSignAndSendTransaction(connection, wallet, tx);
		console.log(sig);
	}
	async function waitForOfferDetails(): Promise<{
		price: number;
		time: number;
	}> {
		return new Promise<{
			price: number;
			time: number;
		}>((resolve) => {
			offerDetailsModal.$on(
				'offerDetails',
				(e: ComponentEvents<OfferDetailsModal>['offerDetails']) => {
					resolve(e.detail);
				}
			);
		});
	}

	const handleMakeOfferButtonClick = (authority: string) => async (e: Event) => {
		await makeOffer(authority);
		console.log('make offer button clicked');
	};

	const handleCardClick =
		(account: SearchableBoughtOrder) => (e: ComponentEvents<BoughtShipmentCard>['cardFocus']) => {
			isOfferChosen = true;
			shipmentChosen = account;

			const cardCoords = e.detail as Geography;

			const [lowerLongitude, higherLongitude] = [
				cardCoords.from.longitude,
				cardCoords.to.longitude
			].sort();

			const [lowerLatitude, higherLatitude] = [
				cardCoords.from.latitude,
				cardCoords.to.latitude
			].sort();

			const middle = {
				longitude: (lowerLongitude + higherLongitude) / 2,
				latitude: (lowerLatitude + higherLatitude) / 2
			};

			center = [middle.longitude, middle.latitude];
		};
</script>

<svelte:head><title>Forwarder shipments list</title></svelte:head>

<main class="container">
	<div class="grid">
		<div>
			{#if $searchableBoughtShipments.filtered.length != 0}
				{#each $searchableBoughtShipments.filtered as account}
					<BoughtShipmentCard
						boughtShipmentAccount={account}
						on:cardFocus={handleCardClick(account)}
					/>
				{/each}
			{:else}
				<p>Nothing found</p>
			{/if}
		</div>
		<div>
			<ShipmentsMap locations={locationsOnMap} {center}>
				{#each carriers as { account }}
					{@const {
						location: { latitude, longitude },
						time
					} = account.availability}

					{@const { name, authority, creator } = account}

					<Marker
						lngLat={[longitude, latitude]}
						on:click={() => console.log('clicked', time)}
						class="grid h-8 w-8 place-items-center rounded-xl border border-2 border-[theme(colors.green)] bg-red-400 text-[theme(colors.green)]  shadow-2xl focus:outline-2 focus:outline-black"
					>
						<span>
							{name}
						</span>

						<Popup openOn="hover" offset={[0, -10]}>
							<div class="flex flex-col">
								<span class="text-sm font-bold text-[theme(colors.mint)]"
									>available time: {new Date(time).toUTCString()}
								</span>

								<SimpleButton
									class="border-[theme(colors.mint)] text-[theme(colors.mint)]"
									value={'make offer'}
									on:click={handleMakeOfferButtonClick(creator)}
								/>
							</div>
						</Popup>
					</Marker>
				{/each}
			</ShipmentsMap>
		</div>
	</div>
</main>

<OfferDetailsModal bind:open={isOfferDetailsOpen} bind:this={offerDetailsModal} />

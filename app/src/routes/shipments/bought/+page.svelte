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
	import { BN } from 'bn.js';
	import { walletStore } from '$src/stores/wallet';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import TransactionSendModal from '$src/components/Modals/TransactionSendModal.svelte';
	import { walletModalStore } from '$src/stores/walletModalHelper';

	const SECS_IN_MINUTE = 60;
	export let data: PageData;

	let center: [number, number] = [19, 50];
	let isOfferDetailsOpen: boolean = false;
	let isOfferChosen: boolean = false;
	let shipmentChosen: SearchableBoughtOrder;
	let carrierAuthority: string;
	let time: number;
	let price: number;

	$: timeInSecs = time * SECS_IN_MINUTE;
	$: locationsOnMap = $searchableBoughtShipments.data.map((s) => s.account.shipment.geography);
	$: carriers = data.carriers;

	$: if ($walletStore.publicKey) {
		searchableBoughtShipments.update((s) => {
			s.filtered = s.data.filter((s) => s.account.buyer === $walletStore.publicKey?.toString());

			s.data = s.filtered;

			return s;
		});
	}

	async function makeOffer(): Promise<{ signature: string }> {
		const { program, connection } = get(anchorStore);
		const wallet = get(walletStore);

		const carrierAddress = getCarrierAddress(program, new PublicKey(carrierAuthority));
		const carrierAccount = await program.account.carrier.fetchNullable(carrierAddress);

		if (!carrierAccount) {
			throw 'Carrier account not found';
		}

		validateMakeOfferParams();

		const offerAddress = getOfferAddress(
			program,
			new PublicKey(carrierAuthority),
			carrierAccount.offersCount
		);

		const ix = await program.methods
			.makeOffer(new BN(price), timeInSecs)
			.accounts({
				offer: offerAddress,
				shipment: new PublicKey(shipmentChosen.publicKey),
				forwarder: getForwarderAddress(program, wallet.publicKey!),
				carrier: carrierAddress,
				signer: wallet.publicKey!
			})
			.instruction();

		const tx = new Transaction().add(ix);
		try {
			const sig = await useSignAndSendTransaction(connection, wallet, tx);

			return { signature: sig };
		} catch (err) {
			throw err;
		}
	}

	const validateMakeOfferParams = () => {
		console.log(price, timeInSecs, price > 0 && timeInSecs > SECS_IN_MINUTE * 30);
		if (!(price > 0 && timeInSecs > SECS_IN_MINUTE * 30)) {
			throw 'Price must be higher than zero and time must be at least 30 minutes';
		}
	};

	const handleMakeOfferButtonClick = (authority: string) => async (e: Event) => {
		const wallet = get(walletStore);

		if (wallet.publicKey) {
			isOfferDetailsOpen = true;
			carrierAuthority = authority;
		} else {
			walletModalStore.openModal();
		}
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
			{#if !$walletStore.publicKey}
				<p>Please connect your wallet to view bought shipments</p>
			{:else if $searchableBoughtShipments.filtered.length != 0}
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

<TransactionSendModal bind:open={isOfferDetailsOpen} sendTransactionHandler={makeOffer}>
	<svelte:fragment>
		<p>Enter the amount you want to pay and the time when the offer will expire.</p>

		<input
			class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
			type="amount"
			bind:value={time}
			placeholder="enter expiration in minutes"
		/>

		<input
			class="w-full p-4 rounded-xl border border-[theme(colors.mint)] mt-4"
			type="amount"
			bind:value={price}
			placeholder="enter amount to pay"
		/>
	</svelte:fragment>
</TransactionSendModal>

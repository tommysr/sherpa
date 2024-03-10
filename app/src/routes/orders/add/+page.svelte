<script lang="ts">
	import ShipmentMap from '$components/ShipmentMap/ShipmentMap.svelte';
	import {
		getShipmentAddress,
		getShipperAddress,
		getStateAddressWithBump
	} from '$src/lib/addresses';
	import { anchorStore } from '$src/stores/anchor';
	import { walletStore } from '$src/stores/wallet';
	import { web3Store } from '$src/stores/web3';
	import type { MockTransportOrder } from '$src/utils/types/mockTransport';
	import { useSignAndSendTransaction } from '$src/utils/wallet/singAndSendTx';
	import { Transaction, type PublicKey } from '@solana/web3.js';
	import { BN } from 'bn.js';
	import Geolocation from 'svelte-geolocation';
	import { get } from 'svelte/store';

	const START_POSITION: [number, number] = [15, 50];
	const OFFSET_START_POSITION: [number, number] = [START_POSITION[0] + 1, START_POSITION[1] + 1];

	let shipmentSourceCoord: [number, number] = START_POSITION;
	let shipmentDestinationCoord: [number, number] = OFFSET_START_POSITION;
	let price: number = 0.01;
	let when: Date = new Date();
	let deadline: Date = new Date();

	function handleBrowserPosition(e: any) {
		const coords = e.detail.coords;
		shipmentSourceCoord = [coords.longitude, coords.latitude];
	}

	async function registerShipper(shipper: PublicKey) {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const registerShipperIx = await program.methods
			.registerShipper()
			.accounts({
				shipper,
				signer: wallet.publicKey!
			})
			.instruction();
		const tx = new Transaction().add(registerShipperIx);

		await useSignAndSendTransaction(connection, wallet, tx);
	}

	function validateOrderForm() {
		console.log(price, when, deadline);

		if (price <= 0) {
			throw new Error('Price must be greater than 0');
		}
		// if (when < new Date()) {
		// 	throw new Error('When must be in the future');
		// }
		// if (deadline < when) {
		// 	throw new Error('Deadline must be after when');
		// }
	}

	async function addOrder() {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);
		const [stateAddress, _] = getStateAddressWithBump(program);

		// DEV
		let stateExists = (await program.account.state.fetchNullable(stateAddress)) !== null;

		if (!stateExists) {
			throw new Error('State not initialized');
		}
		// END DEV

		const shipper = getShipperAddress(program, wallet.publicKey!);
		const shipperAccount = await program.account.shipper.fetchNullable(shipper);

		if (!shipperAccount) {
			await registerShipper(shipper);
		}

		const shipment = getShipmentAddress(program, shipper, shipperAccount?.count || 0);

		const createShipmentIx = await program.methods
			.createShipment(new BN(price * 10 ** 6), {
				deadline: new BN(0),
				// 0 for now, will be updated later
				details: {
					priority: 0,
					access: 0,
					count: 0,
					fragility: 0,
					reserved: [0, 0, 0, 0]
				},
				// same as above, would be nice to implement logic used in protocol
				// to avoid getting all the values from the user
				dimensions: { depth: 0, height: 0, weight: 0, width: 0 },
				// TODO: array is awful, should be an object
				geography: {
					from: { latitude: shipmentSourceCoord[0], longitude: shipmentSourceCoord[1] },
					to: { latitude: shipmentDestinationCoord[0], longitude: shipmentDestinationCoord[1] }
				},
				when: new BN(0)
			})
			.accounts({
				shipper,
				shipment,
				signer: wallet.publicKey!
			})
			.instruction();

		const tx = new Transaction().add(createShipmentIx);
		const sig = await useSignAndSendTransaction(connection, wallet, tx);
		console.log(sig);
	}

	async function handleOrderAdd(event: { currentTarget: EventTarget & HTMLFormElement }) {
		validateOrderForm();
		await addOrder();
	}
</script>

<!-- A lot of is commented out to test anchor handling on little data -->
<main class="container">
	<div class="grid" id="maingrid">
		<div id="order">
			<form method="post" on:submit|preventDefault={handleOrderAdd}>
				<label for="amount">Ship payment in SOL</label>
				<input
					id="amount"
					name="amount"
					type="number"
					min="0.001"
					step="0.001"
					placeholder="0.01"
					required
					bind:value={price}
				/>
				<table>
					<tbody>
						<tr>
							<td>Source Location </td>
							<td>
								<div data-type="amount">
									<span>Longitude: {shipmentSourceCoord[0].toFixed(4)}</span>
									<span>Latitude: {shipmentSourceCoord[1].toFixed(4)}</span>
								</div>
							</td>
						</tr>

						<tr>
							<td>Destination Location</td>
							<td>
								<div data-type="amount">
									<span>Longitude: {shipmentDestinationCoord[0].toFixed(4)}</span>
									<span> Latitude: {shipmentDestinationCoord[1].toFixed(4)}</span>
								</div>
							</td>
						</tr>

						<!-- <tr>
							<td>Weight</td>
							<td>
								<div class="grid">
									<input
										type="weight"
										name="weight"
										placeholder="weight"
										aria-label="weight"
										required
									/>
									<select
										name="favorite-cuisine"
										aria-label="Select your favorite cuisine..."
										required
									>
										<option selected disabled value=""> kg/lb </option>
										<option>kg</option>
										<option>lb</option>
									</select>
								</div>
							</td></tr
						> -->
						<!-- <tr>
							<td>Date</td><td>
								<input
									type="datetime-local"
									name="datetime-local"
									aria-label="Datetime local"
									required
									bind:value={when}
								/></td
							>
						</tr>
						<tr>
							<td>Deadline</td><td>
								<input
									type="datetime-local"
									name="datetime-deadline"
									aria-label="Datetime local"
									required
									bind:value={deadline}
								/></td
							>
						</tr> -->
						<!-- <tr
							><td colspan="2">
								<label for="priority">Priority</label>
								<input
									id="priority"
									name="priority"
									list="priorities"
									type="range"
									min="1"
									max="7"
									step="1"
									value="3"
									required
								/>
								<datalist id="priorities">
									<option value="1">Min</option>
									<option value="2">Low</option>
									<option value="3">Medium</option>
									<option value="4">High</option>
									<option value="5">Max</option>
								</datalist>
							</td></tr
						>
						<tr>
							<td>Fragility</td><td
								><fieldset>
									<legend>Describe the package:</legend>
									<label>
										<input type="radio" name="fragility" checked />
										Ice Packaging
									</label>
									<label>
										<input type="radio" name="fragility" />
										Vacuum-Sealed Packaging
									</label>
									<label>
										<input type="radio" name="fragility" />
										Glass Containers
									</label>
									<label>
										<input type="radio" name="fragility" />
										Thin Plastic Wrap
									</label>
								</fieldset></td
							>
						</tr> -->
					</tbody>
					<tfoot>
						<!-- <tr>
							<td colspan="2">
								<fieldset>
									<legend>Shipment preferences:</legend>
									<input type="checkbox" id="international" name="international" />
									<label for="international">International</label>
									<input type="checkbox" id="tracked" name="tracked" />
									<label for="tracked">Tracked shipping</label>
									<input type="checkbox" id="signature" name="signature" />
									<label for="signature">Signature Required</label>
								</fieldset></td
							>
						</tr> -->
					</tfoot>
				</table>

				<button type="submit">Create</button>
			</form>
		</div>
		<div>
			<Geolocation getPosition watch on:position={handleBrowserPosition} />
			<ShipmentMap
				bind:sourceLocation={shipmentSourceCoord}
				bind:destinationLocation={shipmentDestinationCoord}
			/>
		</div>
	</div>
</main>

<style lang="scss">
	#maingrid {
		margin-top: 50px;
	}
</style>

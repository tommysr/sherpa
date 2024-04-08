<script lang="ts">
	import { sleep } from '$src/utils/utils';
	import { defaultLocation, pickedLocations } from '$stores/locationsPick';
	import { ValidationMessage, reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import { LngLat } from 'maplibre-gl';
	import * as yup from 'yup';
	import Button from '../Buttons/Button.svelte';

	import { DateInput } from 'date-picker-svelte';
	import type { LocationWithTimeFormInterface } from './interfaces';
	import { locationsWithTimeFormSchema as schema } from './schemas';

	export let initialValues: LocationWithTimeFormInterface;

	export let onSubmit;
	export let onBack;
	export let showModal = true;

	let lastRequestTime = Date.now();
	let lastLocation = defaultLocation;

	let locationDisabled = true;

	// maybe store there some default location or cache some.
	$: location = $pickedLocations.src;

	$: if (location.toString() != lastLocation.toString()) {
		locationDisabled = true;
		lastLocation = location;

		setFields('latitude', location.lat, true);
		setFields('longitude', location.lng, true);

		fetchLocation(location)
			.then((name) => setFields('name', name))
			.catch((_) => {
				locationDisabled = false;
				$data.name = 'default';
			});
	}

	const fetchLocation = async (lngLat: LngLat): Promise<string> => {
		await sleep(2 + Math.floor(Math.random() * 7));

		const currentTime = Date.now();
		const timeSinceLastRequest = currentTime - lastRequestTime;

		if (timeSinceLastRequest < 1000) {
			await sleep(1000 - timeSinceLastRequest);
		}

		lastRequestTime = Date.now();

		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lngLat.lat}&lon=${lngLat.lng}&format=geocodejson`
		);
		const parsed = await response.json();

		const geo = parsed.features[0].properties.geocoding;

		return geo.city + ', ' + geo.country;
	};

	const { form, data, setData, touched, setFields } = createForm<yup.InferType<typeof schema>>({
		extend: [reporter, validator({ schema })],
		onSubmit,
		initialValues
	});

	const nameInitial = $data.name;

	$: {
		if (nameInitial !== $data.name) {
			$touched.name = true;
		}
	}
</script>

<div class="text-neutral-600">
	<h2
		class="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
	>
		Carrier availability
	</h2>
	<p class="text-neutral-600 text-sm max-w-sm mt-2">Choose you availability date and location.</p>

	<form use:form class="mt-10 px-4">
		<table class="w-full mt-10">
			<tr>
				<td></td>
				<td>Location</td>
				<td>Longitude</td>
				<td>Latitude</td>
			</tr>

			<tr>
				<td class="py-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="var(--primary)"
						class="bi bi-geo-alt"
						viewBox="0 0 16 16"
					>
						<path
							d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"
						/>
						<path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
					</svg>
				</td>
				<td>{$data.name}</td>
				<td>{$data.latitude.toFixed(4)}</td>
				<td>{$data.longitude.toFixed(4)}</td>
			</tr>
		</table>

		<div class="flex justify-center mt-6">
			<button
				type="button"
				class="flex items-center text-accent hover:text-gray-500 transition-colors duration-200 ease-in-out"
				on:click={() => (showModal = false)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					class="inline-block mr-2"
					viewBox="0 0 16 16"
				>
					<path
						d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
					/>
				</svg>
				<p>Select locations</p>
			</button>
		</div>

		<hr class="my-6" />

		<span class="flex items-center justify-between mt-8">
			<p class="text-neutral-600">Deadline of the shipment:</p>
			<div>
				<DateInput
					format="yyyy/MM/dd HH:mm"
					placeholder="2000/31/12 23:59"
					required
					timePrecision="minute"
					bind:value={$data.when}
				/>

				<ValidationMessage for="deadline" let:messages>
					{#if messages}
						<div class="absolute mt-1 -ml-10" role="alert">
							<p class="text-md text-red-600 font-semibold">{messages[0]}</p>
						</div>
					{/if}
				</ValidationMessage>
			</div>
		</span>

		<div class="flex justify-center space-x-5 mt-10">
			<Button class="uppercase tracking-widest" on:click={() => onBack($data)}>Prev</Button>
			<Button class="uppercase tracking-widest" type="submit">Next</Button>
		</div>
	</form>
</div>

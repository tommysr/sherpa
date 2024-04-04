<script lang="ts">
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import Button from '../Buttons/Button.svelte';
	import { defaultLocation, pickedLocations } from '$stores/locationsPick';
	import { sleep } from '$src/utils/utils';
	import { LngLat } from 'maplibre-gl';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import NumberInput from '../Inputs/NumberInput.svelte';

	import type { LocationWithTimeFormInterface } from './interfaces';
	import { locationsWithTimeFormSchema as schema } from './schemas';
	import { DateInput } from 'date-picker-svelte';

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

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Carrier availability
	</h2>
</div>

<form use:form>


	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Choose you availability date and location</p>
	</div>

	<div class="flex flex-col items-center gap-y-2 mb-3">
		<span>
			Deadline of the shipment:
			<DateInput
				format="yyyy/MM/dd HH:mm"
				placeholder="2000/31/12 23:59"
				required
				timePrecision="minute"
				bind:value={$data.when}
			/>
		</span>
    </div>

	<div
		class="col-span-2 grid grid-cols-4 opacity-100 items-center justify-items-center w-full text-white py-2 bg-gradient-to-r from-primary to-secondary"
	>
		<div></div>
		<div>Longitude</div>
		<div>Latitude</div>
		<div>Name</div>
	</div>
	<div
		class="row-span-2 grid grid-cols-4 opacity-80 items-center justify-items-center w-full text-white py-2 bg-gradient-to-t from-primary to-secondary mb-3"
	>
		<div>Source</div>

		<NumberInput name="longitude" disabled />
		<NumberInput name="latitude" disabled />

		<div>
			<input
				class="bg-transparent"
				name="name"
				type="text"
				disabled={locationDisabled}
				bind:value={$data.name}
			/>
		</div>
	</div>
	

	<div class="flex justify-center">
		<Button type="button" on:click={() => (showModal = false)}>Change locations</Button>
	</div>
	{#each ['latitude', 'longitude', 'name' ,'when'] as name}
		{@const realName = name[0] == 's' ? 'source' : 'destination'}
		<ValidationMessage for={name} let:messages={message}>
			{#if message}
				<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
					<p class="font-bold">Invalid {realName} location</p>
					<p>{message || ''}</p>
				</div>
			{/if}
		</ValidationMessage>
	{/each}

	<div class="flex justify-center mt-4 gap-x-2">
		<Button on:click={() => onBack($data)}>Prev</Button>
		<Button type="submit">Next</Button>
	</div>
</form>

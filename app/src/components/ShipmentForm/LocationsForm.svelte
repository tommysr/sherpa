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
	import clsx from 'clsx';

	export let initialValues: {
		destinationLocationLng: number;
		destinationLocationLat: number;
		sourceLocationLat: number;
		sourceLocationLng: number;
		sourceName: string;
		destinationName: string;
	} = {
		destinationLocationLat: defaultLocation.lat,
		destinationLocationLng: defaultLocation.lng,
		sourceLocationLat: defaultLocation.lat,
		sourceLocationLng: defaultLocation.lng,
		destinationName: 'default',
		sourceName: 'default'
	};

	export let onSubmit;
	export let onBack;
	export let showModal = true;

	let lastRequestTime = Date.now();
	let lastSrcLocation = defaultLocation;
	let lastDestLocation = defaultLocation;

	let srcLocationDisabled = true;
	let dstLocationDisabled = true;

	const schema = yup.object({
		destinationLocationLng: yup.number().required(),
		destinationLocationLat: yup.number().required(),
		sourceLocationLat: yup.number().required(),
		sourceLocationLng: yup.number().required(),
		sourceName: yup.string().required(),
		destinationName: yup.string().required()
	});

	// maybe store there some default location or cache some.
	$: src = $pickedLocations.src;
	$: dst = $pickedLocations.dst;

	$: console.log(src, $pickedLocations.src);

	$: if (src.toString() != lastSrcLocation.toString()) {
		srcLocationDisabled = true;
		lastSrcLocation = src;

		setFields('sourceLocationLat', src.lat, true);
		setFields('sourceLocationLng', src.lng, true);

		fetchLocation(src)
			.then((name) => setFields('sourceName', name))
			.catch((_) => {
				srcLocationDisabled = false;
				$data.sourceName = 'default';
			});
	}

	$: if (dst.toString() != lastDestLocation.toString()) {
		dstLocationDisabled = true;
		lastDestLocation = dst;

		setFields('destinationLocationLat', dst.lat, true);
		setFields('destinationLocationLng', dst.lng, true);

		fetchLocation(dst)
			.then((name) => setFields('destinationName', name))
			.catch((_) => {
				dstLocationDisabled = false;
				$data.destinationName = 'default';
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
		initialValues,
		validate: (values) => {
			const errors = {
				destination: '',
				source: '',
				sourceLocationLat: '',
				sourceLocationLng: '',
				destinationLocationLat: '',
				destinationLocationLng: '',
				sourceName: '',
				destinationName: ''
			};

			const {
				sourceLocationLat,
				destinationLocationLat,
				destinationLocationLng,
				sourceLocationLng,
				destinationName,
				sourceName
			} = values;

			if (sourceName == 'default') {
				errors.source = 'change location or enter name manually';
			}

			if (destinationName == 'default') {
				errors.destination = 'change location or enter name manually';
			}

			const sourceLngLat = LngLat.convert([sourceLocationLng, sourceLocationLat]);
			const destinationLngLat = LngLat.convert([destinationLocationLng, destinationLocationLat]);

			console.log(sourceLngLat, destinationLngLat);

			if (sourceLngLat.toString() === defaultLocation.toString()) {
				errors.source = 'you need to change source location';
			}

			if (destinationLngLat.toString() === defaultLocation.toString()) {
				errors.destination = 'you need to change destination location';
			}

			if (sourceLocationLat < -90 || sourceLocationLat > 90) {
				errors.source = 'Invalid latitude value';
			}

			if (destinationLocationLat < -90 || destinationLocationLat > 90) {
				errors.destination = 'Invalid latitude value';
			}

			if (sourceLocationLng < -180 || sourceLocationLng > 180) {
				errors.source = 'Invalid longitude value';
			}

			if (destinationLocationLng < -180 || destinationLocationLng > 180) {
				errors.destination = 'Invalid longitude value';
			}

			return errors;
		}
	});

	const sourceNameInitial = $data.sourceName;
	const destinationNameInitial = $data.destinationName;

	$: {
		if (sourceNameInitial !== $data.sourceName) {
			$touched.sourceName = true;
		}

		if (destinationNameInitial !== $data.destinationName) {
			$touched.destinationName = true;
		}
	}
</script>

<div class="my-10 flex justify-center">
	<h2
		class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-3xl"
	>
		Locations
	</h2>
</div>

<form use:form>
	<div class="border-primary border-t text-primary-800 px-4 py-3 mb-5" role="alert">
		<p class="font-bold">Action needed</p>
		<p class="text-sm">Choose start and end location on map</p>
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
		class="row-span-2 grid grid-cols-4 opacity-80 items-center justify-items-center w-full text-white py-2 bg-gradient-to-t from-primary to-secondary"
	>
		<div>Source</div>

		<NumberInput name="sourceLocationLng" disabled />
		<NumberInput name="sourceLocationLat" disabled />

		<div>
			<input
				class="bg-transparent"
				name="sourceName"
				type="text"
				disabled={srcLocationDisabled}
				bind:value={$data.sourceName}
			/>
		</div>
	</div>
	<div
		class="mb-3 row-span-2 grid grid-cols-4 opacity-70 items-center justify-items-center w-full text-white py-2 bg-gradient-to-b from-primary to-secondary"
	>
		<div>Destination</div>
		<NumberInput disabled name="destinationLocationLng" />
		<NumberInput disabled name="destinationLocationLat" />

		<div>
			<input
				class="bg-transparent"
				name="destinationName"
				type="text"
				disabled={srcLocationDisabled}
				bind:value={$data.destinationName}
			/>
		</div>
	</div>

	<div class="flex justify-center">
		<Button type="button" on:click={() => (showModal = false)}>Change locations</Button>
	</div>
	{#each ['source', 'destination'] as name}
		<ValidationMessage for={name} let:messages={message}>
			{#if message}
				<div class="bg-red-200 border-l-4 mt-3 border-red-400 text-orange-700 p-2" role="alert">
					<p class="font-bold">Invalid {name} location</p>
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

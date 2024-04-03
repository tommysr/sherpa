import * as yup from 'yup';
import type {
	DatesFormInterface,
	DetailsFormInterface,
	DimensionsFormInterface,
	LocationsFormInterface,
	NameFormInterface,
	PriceFormInterface
} from './interfaces';
import { defaultLocation } from '$src/stores/locationsPick';

export const dateFormSchema: yup.ObjectSchema<DatesFormInterface> = yup.object({
	when: yup
		.date()
		.required('desired shipment date is required')
		.min(new Date(), 'desired date should be in the future'),
	deadline: yup
		.date()
		.required('deadline date is required')
		.min(new Date(), 'deadline should be in the future')
});

export const detailsFormSchema: yup.ObjectSchema<DetailsFormInterface> = yup.object({
	count: yup.number().required().min(1, 'count must be at least 1'),
	access: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('can not be empty')
		.test('is-zero', 'you have to pick access', (val) => val > 0),
	priority: yup.number().required(),
	fragility: yup.number().required()
});

export const dimensionsFormSchema: yup.ObjectSchema<DimensionsFormInterface> = yup.object({
	isMetricTon: yup.boolean().required(),
	weight: yup
		.number()
		.transform((value) => (value == null || value == undefined || isNaN(value) ? 0 : value))
		.required('can not be empty')
		.test('is-zero', 'weight must be greater than 0', (val) => val > 0),
	volume: yup.number().when('isMetricTon', ([isMetricTon], schema) => {
		console.log('v', isMetricTon, schema);
		return isMetricTon
			? schema
					.transform((value) => {
						console.log('t', value);
						return value == null || value == undefined || isNaN(value) ? 0 : value;
					})
					.required('can not be empty')
					.test('is-zero', 'volume must be greater than 0', (val) => val > 0)
			: schema.transform((value) => {
					console.log('f', value);
					return value == null || value == undefined || isNaN(value) ? 0 : value;
				});
	}),
	width: yup.number().when('isMetricTon', ([isMetricTon], schema) => {
		return !isMetricTon
			? schema
					.transform((value) => (value == null || value == undefined || isNaN(value) ? 0 : value))
					.required('can not be empty')
					.test('is-zero', 'width must be greater than 0', (val) => val > 0)
			: schema.transform((value) =>
					value == null || value == undefined || isNaN(value) ? 0 : value
				);
	}),
	depth: yup.number().when('isMetricTon', ([isMetricTon], schema) => {
		return !isMetricTon
			? schema
					.transform((value) => (value == null || value == undefined || isNaN(value) ? 0 : value))
					.required('can not be empty')
					.test('is-zero', 'depth must be greater than 0', (val) => val > 0)
			: schema.transform((value) =>
					value == null || value == undefined || isNaN(value) ? 0 : value
				);
	}),
	height: yup.number().when('isMetricTon', ([isMetricTon], schema) => {
		console.log('h', isMetricTon);

		return !isMetricTon
			? schema
					.transform((value) => (value == null || value == undefined || isNaN(value) ? 0 : value))
					.required('can not be empty')
					.test('is-zero', 'height must be greater than 0', (val) => val > 0)
			: schema.transform((value) =>
					value == null || value == undefined || isNaN(value) ? 0 : value
				);
	}),
	distanceMetrics: yup.string<'ft' | 'm'>().required(),
	weightMetrics: yup.string<'kg' | 'lb'>().required()
});

export const locationsFormSchema: yup.ObjectSchema<LocationsFormInterface> = yup.object({
	destinationLocationLng: yup
		.number()
		.required()
		.min(-90, 'invalid latitude value')
		.max(90, 'invalid latitude value')
		.test('is-default', 'you have to change location', (el) => el != defaultLocation.lng),
	destinationLocationLat: yup
		.number()
		.required()
		.min(-180, 'invalid longitude value')
		.max(180, 'invalid longitude value')
		.test('is-default', 'you have to change location', (el) => el != defaultLocation.lat),
	sourceLocationLat: yup
		.number()
		.required()
		.min(-90, 'invalid latitude value')
		.max(90, 'invalid latitude value')
		.test('is-default', 'you have to change location', (el) => el != defaultLocation.lat),
	sourceLocationLng: yup
		.number()
		.required()
		.min(-180, 'invalid longitude value')
		.max(180, 'invalid longitude value')
		.test('is-default', 'you have to change location', (el) => el != defaultLocation.lng),
	sourceName: yup
		.string()
		.required()
		.test('is-default', 'change location or enter name manually', (el) => el != 'default'),
	destinationName: yup
		.string()
		.required()
		.test('is-default', 'change location or enter name manually', (el) => el != 'default')
});

export const nameFormSchema: yup.ObjectSchema<NameFormInterface> = yup.object({
	name: yup.string().required('name is required').max(64, 'Name must be less than 64 characters')
});

export const priceFormSchema: yup.ObjectSchema<PriceFormInterface> = yup.object({
	price: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('price is required')
		.test('is-zero', 'Price must be greater than 0', (val) => val > 0)
});

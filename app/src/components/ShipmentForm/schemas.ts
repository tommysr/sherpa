import { defaultLocation } from '$src/stores/locationsPick';
import * as yup from 'yup';
import type {
	CollateralFormInterface,
	DatesFormInterface,
	DetailsFormInterface,
	DimensionsFormInterface,
	LocationsFormInterface,
	NameFormInterface,
	PriceFormInterface
} from './interfaces';

export const dateFormSchema: yup.ObjectSchema<DatesFormInterface> = yup.object({
	when: yup
		.date()
		.required('Desired shipment date is required')
		.min(new Date(), 'Desired date should be in the future'),
	deadline: yup
		.date()
		.required('Deadline date is required')
		.min(new Date(), 'Deadline should be in the future')
});

export const detailsFormSchema: yup.ObjectSchema<DetailsFormInterface> = yup.object({
	count: yup.number().required().min(1, 'count must be at least 1'),
	access: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('Can not be empty')
		.test('is-zero', 'You have to pick access', (val) => val > 0),
	priority: yup.number().required(),
	fragility: yup.number().required()
});

export const dimensionsFormSchema: yup.ObjectSchema<DimensionsFormInterface> = yup.object({
	isMetricTon: yup.boolean().required(),
	weight: yup
		.mixed<number>()
		.test('number', 'Must be a number', (value) => !Number.isNaN(value))
		.transform((value) => parseInt(value, 10))
		.required('Can not be empty')
		.test('is-zero', 'Weight must be greater than 0', (val) => val > 0),

	volume: yup.mixed<number>().when('isMetricTon', ([isMetricTon], schema) => {
		return isMetricTon
			? schema
					.test('number', 'Must be a number', (value) => !Number.isNaN(value))
					.transform((value) => parseInt(value, 10))
					.required('Can not be empty')
					.test('is-zero', 'Volume must be greater than 0', (val) => val > 0)
			: schema;
	}),
	width: yup.mixed<number>().when('isMetricTon', ([isMetricTon], schema) => {
		return !isMetricTon
			? schema
					.test('number', 'Must be a number', (value) => !Number.isNaN(value))
					.transform((value) => parseInt(value, 10))
					.required('Can not be empty')
					.test('is-zero', 'Width must be greater than 0', (val) => val > 0)
			: schema;
	}),
	depth: yup.mixed<number>().when('isMetricTon', ([isMetricTon], schema) => {
		return !isMetricTon
			? schema

					.test('number', 'Must be a number', (value) => !Number.isNaN(value))
					.transform((value) => parseInt(value, 10))
					.required('Can not be empty')
					.test('is-zero', 'Depth must be greater than 0', (val) => val > 0)
			: schema;
	}),
	height: yup.mixed<number>().when('isMetricTon', ([isMetricTon], schema) => {
		return !isMetricTon
			? schema
					.test('number', 'Must be a number', (value) => !Number.isNaN(value))
					.transform((value) => parseInt(value, 10))
					.required('Can not be empty')
					.test('is-zero', 'Height must be greater than 0', (val) => val > 0)
			: schema;
	}),
	distanceMetrics: yup.string<'ft' | 'm'>().required(),
	weightMetrics: yup.string<'kg' | 'lb'>().required()
});

export const locationsFormSchema: yup.ObjectSchema<LocationsFormInterface> = yup.object({
	destinationLocationLng: yup
		.number()
		.required()
		.min(-90, 'Invalid latitude value')
		.max(90, 'Invalid latitude value')
		.test('is-default', 'You have to change location', (el) => el != defaultLocation.lng),
	destinationLocationLat: yup
		.number()
		.required()
		.min(-180, 'Invalid longitude value')
		.max(180, 'Invalid longitude value')
		.test('is-default', 'You have to change location', (el) => el != defaultLocation.lat),
	sourceLocationLat: yup
		.number()
		.required()
		.min(-90, 'Invalid latitude value')
		.max(90, 'Invalid latitude value')
		.test('is-default', 'You have to change location', (el) => el != defaultLocation.lat),
	sourceLocationLng: yup
		.number()
		.required()
		.min(-180, 'invalid longitude value')
		.max(180, 'Invalid longitude value')
		.test('is-default', 'You have to change location', (el) => el != defaultLocation.lng),
	sourceName: yup
		.string()
		.required()
		.test('is-default', 'Change location or enter name manually', (el) => el != 'default'),
	destinationName: yup
		.string()
		.required()
		.test('is-default', 'Change location or enter name manually', (el) => el != 'default')
});

export const nameFormSchema: yup.ObjectSchema<NameFormInterface> = yup.object({
	name: yup.string().required('Name is required').max(64, 'Name must be less than 64 characters')
});

export const priceFormSchema: yup.ObjectSchema<PriceFormInterface> = yup.object({
	price: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('Price is required')
		.test('is-zero', 'Price must be greater than 0', (val) => val > 0)
});

export const collateralFormSchema: yup.ObjectSchema<CollateralFormInterface> = yup.object({
	collateral: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('Collateral is required')
		.test('is-zero', 'Collateral must be non negative', (val) => val >= 0),

	penalty: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.required('Penalty is required')
		.test('is-zero', 'Penalty must be non negative', (val) => val >= 0)
});

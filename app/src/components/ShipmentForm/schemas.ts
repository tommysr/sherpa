import * as yup from 'yup';

export const dateFormSchema = yup.object({
	when: yup.date().required('desired shipment date is required'),
	deadline: yup.date().required('deadline date is required')
});

export const detailsFormSchema = yup.object({
	count: yup.number().required(),
	access: yup.string().transform(parseInt).required(),
	priority: yup.number().required(),
	fragility: yup.number().required()
});

export const dimensionsFormSchema = yup.object({
	isMetricTon: yup.boolean().required(),
	weight: yup.string().transform(parseInt).required(),
	volume: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
		return isMetricTon ? schema.transform(parseInt).required() : schema;
	}),
	width: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
		return isMetricTon ? schema : schema.transform(parseInt).required();
	}),
	depth: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
		return isMetricTon ? schema : schema.transform(parseInt).required();
	}),
	height: yup.string().when('isMetricTon', ([isMetricTon], schema) => {
		return isMetricTon ? schema : schema.transform(parseInt).required();
	}),
	distanceMetrics: yup.string().required(),
	weightMetrics: yup.string().required()
});

export const locationsFormSchema = yup.object({
	destinationLocationLng: yup.number().required(),
	destinationLocationLat: yup.number().required(),
	sourceLocationLat: yup.number().required(),
	sourceLocationLng: yup.number().required(),
	sourceName: yup.string().required(),
	destinationName: yup.string().required()
});

export const nameFormSchema = yup.object({
	name: yup.string().required('name is required')
});

export const priceFormSchema = yup.object({
	price: yup.string().transform(parseInt).required('price is required')
});

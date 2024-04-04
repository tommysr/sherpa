import * as yup from 'yup';
import type { LocationWithTimeFormInterface } from './interfaces';
import { defaultLocation } from '$src/stores/locationsPick';

export const locationsWithTimeFormSchema: yup.ObjectSchema<LocationWithTimeFormInterface> =
	yup.object({
		longitude: yup
			.number()
			.required()
			.min(-90, 'invalid latitude value')
			.max(90, 'invalid latitude value')
			.test('is-default', 'you have to change location', (el) => el != defaultLocation.lng),
		latitude: yup
			.number()
			.required()
			.min(-180, 'invalid longitude value')
			.max(180, 'invalid longitude value')
			.test('is-default', 'you have to change location', (el) => el != defaultLocation.lat),
		name: yup
			.string()
			.required()
			.test('is-default', 'change location or enter name manually', (el) => el != 'default'),
		when: yup
			.date()
			.required('availability date is required')
			.min(new Date(), 'availability date should be in the future')
	});

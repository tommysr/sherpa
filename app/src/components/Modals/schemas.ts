import * as yup from 'yup';
import type { MessageFormInterface } from './interfaces';

export const messageFormSchema: yup.ObjectSchema<MessageFormInterface> = yup.object({
	message: yup.string().required('message is required').max(128, 'message must be less than 128 characters')
});

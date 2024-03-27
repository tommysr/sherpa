import { createNotification, updateNotification } from './notificationsStore';

const main = async () => {
	const notification = createNotification({
		text: 'Swap',
		type: 'loading'
	});

	await new Promise((resolve) => setTimeout(resolve, 4000));

	updateNotification(notification, {
		text: 'Swap',
		type: 'success',
		signature: 'some-signature',
		removeAfter: 3000
	});
};

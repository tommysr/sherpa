import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export interface INotification {
	id: string;
	text: string;
	type: 'loading' | 'success' | 'failed' | 'unknown';
	signature?: string;
	removeAfter?: number;
}

export interface ICreateNotification {
	text: string;
	type: 'loading' | 'success' | 'failed' | 'unknown';
	signature?: string;
	removeAfter?: number;
}

export interface IUpdateNotification {
	text?: string;
	type?: 'loading' | 'success' | 'failed' | 'unknown';
	signature?: string;
	removeAfter?: number;
}

export const notificationStore = writable<INotification[]>([]);

/**
 * Create a new notification
 * @param data Notification data
 * @returns Notification ID
 * @example
 * const notification = createNotification({
 * 	text: 'Swap',
 * 	type: 'loading'
 * });
 *
 * await new Promise((resolve) => setTimeout(resolve, 4000));
 *
 * updateNotification(notification, {
 * 	text: 'Swap',
 * 	type: 'success',
 * 	signature
 * });
 */
export const createNotification = (data: ICreateNotification): string => {
	const id = uuidv4();
	notificationStore.update((store) => {
		store.push({ id, ...data });
		return store;
	});

	return id;
};

/**
 * Remove a notification
 * @param uid Notification ID
 */
export const removeNotification = (uid: string) => {
	notificationStore.update((store) => {
		const newStore = store.filter(({ id }) => id !== uid);
		return newStore;
	});
};

/**
 * Update a notification
 * @param uid Notification ID
 * @param data Notification data
 */
export const updateNotification = (uid: string, data: IUpdateNotification) => {
	notificationStore.update((store) => {
		const index = store.findIndex(({ id }) => id !== uid);
		store.splice(index, 1, { ...store[index], ...data });
		return store;
	});
};

/**
 * Clear all notifications
 */
export const clearNotifications = () => {
	notificationStore.set([]);
};

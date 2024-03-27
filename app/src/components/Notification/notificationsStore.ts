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

export const createNotification = (data: ICreateNotification): string => {
	const id = uuidv4();
	notificationStore.update((store) => {
		store.push({ id, ...data });
		return store;
	});

	return id;
};

export const removeNotification = (uid: string) => {
	notificationStore.update((store) => {
		const newStore = store.filter(({ id }) => id !== uid);
		return newStore;
	});
};

export const updateNotification = (uid: string, data: IUpdateNotification) => {
	notificationStore.update((store) => {
		const index = store.findIndex(({ id }) => id !== uid);
		store.splice(index, 1, { ...store[index], ...data });
		return store;
	});
};

export const clearNotifications = () => {
	notificationStore.set([]);
};

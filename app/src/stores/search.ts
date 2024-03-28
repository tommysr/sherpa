import { writable } from 'svelte/store';

export type SearchItem = { searchParams: string };

interface StoreInt<T> {
	data: T[];
	filtered: T[];
	searchString: string;
	searchState: string;
}

export interface SearchStore<T extends SearchItem> {
	subscribe: (value: (value: StoreInt<T>) => void) => () => void;
	set: (value: StoreInt<T>) => void;
	update: (updater: (value: StoreInt<T>) => StoreInt<T>) => void;
	default: (defData: T[]) => void;
	performSearch: () => void;
	purgeFiltered: () => void;
	extend: (item: T) => void;
	shrink: (index: number) => void;
}

const filterByString = <T extends SearchItem>(s: StoreInt<T>) => {
	s.filtered = s.data.filter((i) => {
		return i.searchParams.includes(s.searchString);
	});

	s.searchState = 'performed';

	return s;
};

const purgeFiltered = <T>(s: StoreInt<T>) => {
	s.filtered = s.data;
	s.searchState = 'none';
	return s;
};

const addItem = <T>(item: T) => {
	return (s: StoreInt<T>) => {
		s.data.push(item);
		return s;
	};
};

const removeItem = <T>(index: number) => {
	return (s: StoreInt<T>) => {
		const deleted = s.data.splice(index, 1)[0];

		if (s.searchState === 'performed') {
			s.filtered = s.filtered.filter((i) => {
				return i !== deleted;
			});
		}

		return s;
	};
};

export function createSearchStore<T extends SearchItem>(initialData: T[]): SearchStore<T> {
	const { subscribe, set, update } = writable<StoreInt<T>>({
		data: initialData,
		filtered: initialData,
		searchString: '',
		searchState: 'none'
	});

	return {
		subscribe,
		set,
		update,
		default: (defData: T[]) =>
			set({ data: defData, filtered: defData, searchString: '', searchState: 'none' }),
		performSearch: () => update(filterByString),
		purgeFiltered: () => update(purgeFiltered),
		extend: (item: T) => update(addItem(item)),
		shrink: (index: number) => update(removeItem(index))
	};
}

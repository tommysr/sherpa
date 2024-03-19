import { writable } from 'svelte/store';

export type SearchItem = { searchParams: string };

interface SearchStoreInt<T> {
	data: T[];
	filtered: T[];
	searchString: string;
	searchState: string;
}

const filterByString = <T extends SearchItem>(s: SearchStoreInt<T>) => {
	s.filtered = s.data.filter((i) => {
		return i.searchParams.includes(s.searchString);
	});

	s.searchState = 'performed';

	return s;
};

const purgeFiltered = <T>(s: SearchStoreInt<T>) => {
	s.filtered = s.data;
	s.searchState = 'none';
	return s;
};

const addItem = <T>(item: T) => {
	return (s: SearchStoreInt<T>) => {
		s.data.push(item);
		return s;
	};
};

const removeItem = <T>(index: number) => {
	return (s: SearchStoreInt<T>) => {
		s.data.splice(index, 1);
		return s;
	};
};

export function createSearchStore<T extends SearchItem>(initialData: T[]) {
	const { subscribe, set, update } = writable<SearchStoreInt<T>>({
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

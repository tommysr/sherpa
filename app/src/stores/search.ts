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
		performSearch: () => update(filterByString),
		purgeFiltered: () => update(purgeFiltered)
	};
}

export type ApiProgramAccount<T> = {
	publicKey: string;
	account: T;
};

export type AccountName = {
	value: number[]; // 64
};


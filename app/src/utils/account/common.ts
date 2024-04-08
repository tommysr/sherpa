export type ApiProgramAccount<T> = {
	publicKey: string;
	account: T;
};

export type AccountName = {
	value: number[]; // 64
};

export type Message = {
	value: number[]; // 256
}

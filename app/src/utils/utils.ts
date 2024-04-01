export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isSeparator = (s: string) => {
	if (s == ',' || s == '.') {
		return true;
	} else {
		return false;
	}
};

import { IDL, type Protocol } from '$src/utils/idl/types/protocol';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { writable } from 'svelte/store';

export type IAnchorStore = {
	connected: boolean;
	connection: Connection;
	program: Program<Protocol>;
	network: string;
};

// TODO: make it dynamic
export const PROGRAM_ID = new PublicKey('2hLH8kSCZB8DswFRukGEW3x3eahQ9K1pf5BTBUiEZZ7t');

// TODO: change it to helius
const unconnectedConnection = new Connection('https://api.devnet.solana.com');
const unconnectedProvider = new AnchorProvider(
	unconnectedConnection,
	{
		publicKey: Keypair.generate().publicKey,
		// @ts-expect-error not a valid sign
		signAllTransactions: () => {},
		// @ts-expect-error not a valid sign
		signTransaction: () => {}
	},
	{
		preflightCommitment: 'processed'
	}
);

const unconnectedProgram = new Program<Protocol>(IDL, PROGRAM_ID, unconnectedProvider);

const unconnected: IAnchorStore = {
	connected: false,
	connection: unconnectedConnection,
	program: unconnectedProgram,
	network: clusterApiUrl('devnet')
};

export const anchorStore = writable<IAnchorStore>(unconnected);

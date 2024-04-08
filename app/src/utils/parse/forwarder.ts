import { decodeName } from '$sdk/sdk';
import type { ApiForwarder, Forwarder } from '../account/forwarder';

export function parseForwarderToApiForwarder(forwarderAccount: Forwarder): ApiForwarder {
	return {
		...forwarderAccount,
		authority: forwarderAccount.authority.toString(),
		creator: forwarderAccount.creator.toString(),
		name: decodeName(forwarderAccount.name)
	};
}

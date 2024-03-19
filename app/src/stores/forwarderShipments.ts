import { derived, get } from "svelte/store";
import { searchableShipments } from "./searchableShipments";
import { walletStore } from "./wallet";

export const forwarderShipments = derived(searchableShipments, ($searchableShipments) => {
    const { publicKey } = get(walletStore)
    // messy cause requires to wallet to be present and is scoped to the owner, nothing generic
    // and of course no searching ;/
    return $searchableShipments.data.filter((shipment) => shipment.account.shipper != shipment.account.owner && shipment.account.owner == publicKey!.toString())
});
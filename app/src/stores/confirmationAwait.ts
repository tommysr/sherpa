
import { writable } from "svelte/store";


export const awaitedConfirmation = writable<string|null>(null)
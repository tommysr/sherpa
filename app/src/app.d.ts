// See https://kit.svelte.dev/docs/types#app

import type { CarrierFormStage } from "./components/CarrierForm/carrierFormStage";
import type { FormStage } from "./components/ShipmentForm/formStage";

// import type { FormStages } from './stores/orderForm';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			form: FormStage;
			carrierForm: CarrierFormStage
			showModal: boolean;
		}
		// interface Platform {}
	}
}

export {};

import type { NameFormInterface } from "../ShipmentForm/interfaces";

export interface LocationWithTimeFormInterface {
	when: Date;
	latitude: number;
	longitude: number;
	name: string;
}

export interface RegisterCarrierFormInterface {
	name: NameFormInterface;
	locationWithTime: LocationWithTimeFormInterface;
}

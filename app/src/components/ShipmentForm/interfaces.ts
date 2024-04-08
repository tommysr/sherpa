export interface DatesFormInterface {
	when: Date;
	deadline: Date;
}

export interface NameFormInterface {
	name: string;
}

export interface PriceFormInterface {
	price?: number;
}

export interface CollateralFormInterface {
	collateral?: number;
	penalty?: number;
}

export interface DimensionsFormInterface {
	isMetricTon: boolean;
	weight?: number;
	volume?: number;
	width?: number;
	depth?: number;
	height?: number;
	distanceMetrics: 'm' | 'ft';
	weightMetrics: 'kg' | 'lb';
}

export interface DetailsFormInterface {
	count: number;
	access: number;
	priority: number;
	fragility: number;
}

export interface LocationsFormInterface {
	destinationLocationLng: number;
	destinationLocationLat: number;
	sourceLocationLat: number;
	sourceLocationLng: number;
	sourceName: string;
	destinationName: string;
}

export interface CreateShipmentFormInterface {
	name: NameFormInterface;
	shipmentName: NameFormInterface;
	price: PriceFormInterface;
	collateral: CollateralFormInterface;
	dates: DatesFormInterface;
	dimensions: DimensionsFormInterface;
	details: DetailsFormInterface;
	locations: LocationsFormInterface;
}

export interface DatesFormInterface {
	when: Date;
	deadline: Date;
}

export interface NameFormInterface {
	name: string;
}

export interface PriceFormInterface {
	price: string;
}

export interface DimensionsFormInterface {
	isMetricTon: boolean;
	weight: string;
	volume?: string;
	width?: string;
	depth?: string;
	height?: string;
	distanceMetrics: 'm' | 'ft';
	weightMetrics: 'kg' | 'lb';
}

export interface DetailsFormInterface {
	count: number;
	access: string;
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
	dates: DatesFormInterface;
	dimensions: DimensionsFormInterface;
	details: DetailsFormInterface;
	locations: LocationsFormInterface;
}

export enum FormStage {
	Name = 'name',
	ShipmentName = 'shipmentName',
	Price = 'price',
	Dates = 'dates',
	Dimensions = 'dimensions',
	Details = 'details',
	Locations = 'locations',
	Summary = 'summary'
}

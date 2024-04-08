import type { CreateShipmentFormInterface } from '$src/components/ShipmentForm/interfaces';
import type { ParsedShipment } from './account/shipment';

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

export const getShipmentSummary = (shipmentData: ParsedShipment) => {
	return {
		dates: {
			when: new Date(shipmentData.shipment.when),
			deadline: new Date(shipmentData.shipment.deadline)
		},
		details: {
			access: shipmentData.shipment.details.access,
			count: shipmentData.shipment.details.count,
			fragility: shipmentData.shipment.details.fragility,
			priority: shipmentData.shipment.details.priority
		},
		dimensions: {
			distanceMetrics: 'm',
			isMetricTon: shipmentData.shipment.dimensions.height == 0 ? true : false,
			weightMetrics: 'kg',
			volume: shipmentData.shipment.dimensions.width,

			depth: shipmentData.shipment.dimensions.depth,
			height: shipmentData.shipment.dimensions.height,
			weight: shipmentData.shipment.dimensions.weight,
			width: shipmentData.shipment.dimensions.width
		},
		locations: {
			destinationLocationLat: shipmentData.shipment.geography.to.latitude,
			destinationLocationLng: shipmentData.shipment.geography.to.longitude,
			destinationName: shipmentData.shipment.geography.toName,
			sourceLocationLat: shipmentData.shipment.geography.from.latitude,
			sourceLocationLng: shipmentData.shipment.geography.from.longitude,
			sourceName: shipmentData.shipment.geography.fromName
		},
		shipmentName: {
			name: shipmentData.name
		},
		name: {
			name: shortPublicKey(shipmentData.shipper)
		},
		price: {
			price: shipmentData.price / 10 ** 9
		}
	} as CreateShipmentFormInterface;
};

export const shortPublicKey = (publicKey: string) => {
	return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

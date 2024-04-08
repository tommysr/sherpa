export enum FormStage {
	Name = 'name',
	ShipmentName = 'shipmentName',
	Price = 'price',
	Collateral = 'collateral',
	Dates = 'dates',
	Dimensions = 'dimensions',
	Details = 'details',
	Locations = 'locations',
	Summary = 'summary'
}

export function nextStage(f: FormStage): FormStage {
	switch (f) {
		case FormStage.Name:
			return FormStage.ShipmentName;
		case FormStage.ShipmentName:
			return FormStage.Price;
		case FormStage.Price:
			return FormStage.Collateral;
		case FormStage.Collateral:
			return FormStage.Dates;
		case FormStage.Dates:
			return FormStage.Dimensions;
		case FormStage.Dimensions:
			return FormStage.Details;
		case FormStage.Details:
			return FormStage.Locations;
		case FormStage.Locations:
			return FormStage.Summary;
		default:
			return FormStage.Summary;
	}
}

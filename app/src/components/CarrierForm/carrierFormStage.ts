export enum CarrierFormStage {
	Name = 'name',
	LocationWithTime = 'locationWithTime',
	Summary = 'summary'
}

export function nextStage(f: CarrierFormStage): CarrierFormStage {
	switch (f) {
		case CarrierFormStage.Name:
			return CarrierFormStage.LocationWithTime;
		case CarrierFormStage.LocationWithTime:
			return CarrierFormStage.Summary;
		default:
			return CarrierFormStage.Summary;
	}
}

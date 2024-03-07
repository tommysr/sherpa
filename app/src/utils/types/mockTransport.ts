export type Coordinates = {
  latitude: number,
  longitude: number
}

export type MockTransportDimensions = {
  weight: number,
  volume: number
}

export type MockTransportDetails = {
  priority: number,
  fragility: number,
  reserved: Array<number>
}

export type MockTransportOrder = {
  from: Coordinates,
  to: Coordinates,
  dimensions: MockTransportDimensions,
  when: EpochTimeStamp,
  details: MockTransportDetails
}
import { encodeString } from '../../tests/sdk'

const schoolGeolocation = { latitude: 50.0472897, longitude: 19.9199597 }
const airportGeolocation = { latitude: 50.0749092, longitude: 19.8061164 }

export const schoolAirportRoute = {
  from: schoolGeolocation,
  fromName: encodeString('Kraków'),
  to: airportGeolocation,
  toName: encodeString('Katowice')
}

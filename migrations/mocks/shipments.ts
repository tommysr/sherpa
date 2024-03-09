import BN from 'bn.js'
import { schoolAirportRoute } from './routes'

export const crateFromSchoolToAirport = {
  geography: schoolAirportRoute,
  dimensions: {
    weight: 1500 * 1000, // 1.5t
    width: 1200, // 1.2m
    depth: 800, // 0.8m
    height: 2000 // 2m
  },
  details: {
    count: 2,
    priority: 2,
    fragility: 5,
    access: 2,
    reserved: [0, 0, 0]
  },
  when: new BN((Date.now() + 1000 * 60 * 60).toString()),
  deadline: new BN((Date.now() + 1000 * 60 * 60).toString()) // 1 hour
}

import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import type { Protocol } from '../target/types/protocol'

export const STATE_SEED = 'state'
export const SHIPPER_SEED = 'shipper'
export const FORWARDER_SEED = 'forwarder'
export const CARRIER_SEED = 'carrier'
export const SHIPMENT_SEED = 'shipment'
export const BOUGHT_SHIPMENT_SEED = 'forwarded'
export const OFFER_SEED = 'offer'
export const ACCEPTED_OFFER_SEED = 'task'

export const DF_BASE = new BN(5)
export const DF_MODULUS = new BN(23)


export const getStateAddress = (program: Program<Protocol>) => {
  const [stateAddress, stateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
    program.programId
  )
  return stateAddress
}

export const getShipperAddress = (program: Program<Protocol>, shipper: PublicKey) => {
  const [shipperAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(SHIPPER_SEED)), shipper.toBuffer()],
    program.programId
  )
  return shipperAddress
}

export const getForwarderAddress = (program: Program<Protocol>, forwarder: PublicKey) => {
  const [forwarderAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(FORWARDER_SEED)), forwarder.toBuffer()],
    program.programId
  )
  return forwarderAddress
}

export const getCarrierAddress = (program: Program<Protocol>, carrier: PublicKey) => {
  const [carrierAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(CARRIER_SEED)), carrier.toBuffer()],
    program.programId
  )
  return carrierAddress
}

export const getShipmentAddress = (
  program: Program<Protocol>,
  shipper: PublicKey,
  index: number
) => {
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(index)

  const [shipmentAddress, shipmentBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(SHIPMENT_SEED)), shipper.toBuffer(), indexBuffer],
    program.programId
  )

  return shipmentAddress
}

export const getShipmentAddresses = (
  program: Program<Protocol>,
  shipper: PublicKey,
  count: number
) => {
  return Array.from({ length: count }, (_, i) => getShipmentAddress(program, shipper, i))
}

export const getBoughtShipmentAddress = (
  program: Program<Protocol>,
  forwarder: PublicKey,
  index: number
) => {
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(index)

  const [shipmentAddress, shipmentBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode(BOUGHT_SHIPMENT_SEED)),
      forwarder.toBuffer(),
      indexBuffer
    ],
    program.programId
  )

  return shipmentAddress
}

export const getBoughtShipmentAddresses = (
  program: Program<Protocol>,
  shipper: PublicKey,
  count: number
) => {
  return Array.from({ length: count }, (_, i) => getBoughtShipmentAddress(program, shipper, i))
}

export const getOfferAddress = (program, carrier: PublicKey, index: number) => {
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(index)

  const [offerAddress, offerBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(OFFER_SEED)), carrier.toBuffer(), indexBuffer],
    program.programId
  )

  return offerAddress
}

export const getAcceptedOfferAddress = (program, carrier: PublicKey, index: number) => {
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(index)

  const [offerAddress, offerBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode(ACCEPTED_OFFER_SEED)),
      carrier.toBuffer(),
      indexBuffer
    ],
    program.programId
  )

  return offerAddress
}

export const encodeName = (utf8Name: string) => {
  const encoded = anchor.utils.bytes.utf8.encode(utf8Name)

  if (encoded.length > 64) {
    throw new Error('name too long')
  }

  const value: number[] = []
  for (let i = 0; i < encoded.length; i++) {
    switch (i % 4) {
      case 0:
        value.push(encoded[i])
        break
      case 1:
        value[value.length - 1] |= encoded[i] << 8
        break
      case 2:
        value[value.length - 1] |= encoded[i] << 16
        break
      case 3:
        value[value.length - 1] |= encoded[i] << 24
        break
    }
  }

  while (value.length < 64) {
    value.push(0)
  }

  return {
    value
  }
}

export const decodeName = (encoded: { value: number[] }): string => {
  let result: number[] = []

  for (let i of encoded.value) {
    result.push(i % 256)
    result.push((i >> 8) % 256)
    result.push((i >> 16) % 256)
    result.push((i >> 24) % 256)
  }

  while (result[result.length - 1] === 0) {
    result.pop()
  }

  return anchor.utils.bytes.utf8.decode(Buffer.from(result))
}

export const encodeKey = (key: BN) => {
  const single = new BN(2).pow(new BN(64))
  let value = [key.mod(single)]

  let remaining = key
  
  while(key.gte(single)) {
    remaining = remaining.div(single)
    value.push(remaining.mod(single))
  }

  if (value.length > 4) {
    throw new Error('key too long')
  }

  while (value.length < 4) {
    value.push(new BN(0))
  }

  return { value }
}

export const decodeKey = (encoded: { value: BN[] }) => {
  const single = new BN(2).pow(new BN(64))
  let result = new BN(0)

  let remaining = new BN(1)


  for (let i = 0; i < encoded.value.length; i++) {
    result = result.add(encoded.value[i].mul(remaining))
    remaining = remaining.mul(single)
  }

  return result
}

export const encrypt = (plain: string, key: BN) => {
  const encoded = encodeName(plain)
  let multiplier = new BN(1)

  const r = new BN(0)

  while (encoded.value.length > 0) {
    r.add(new BN(encoded.value.pop()!).mul(multiplier))
    multiplier = multiplier.muln(256)
  }

  if (r.gte(DF_MODULUS)) {
    throw new Error('message too large')
  }

  return encodeKey(r.add(DF_MODULUS).add(key).mod(DF_MODULUS))
}

export const decrypt = (encrypted: BN, key: BN) => {}

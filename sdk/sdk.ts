import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
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

export const getOfferAddresses = (program, carrier: PublicKey, count: number) => {
  return Array.from({ length: count }, (_, i) => getOfferAddress(program, carrier, i))
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

export const getAcceptedOfferAddresses = (program, carrier: PublicKey, count: number) => {
  return Array.from({ length: count }, (_, i) => getAcceptedOfferAddress(program, carrier, i))
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

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import type { Protocol } from '../target/types/protocol'

export const STATE_SEED = 'state'
export const SHIPPER_SEED = 'shipper'
export const FORWARDER_SEED = 'forwarder'
export const CARRIER_SEED = 'carrier'
export const SHIPMENT_SEED = 'shipment'

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

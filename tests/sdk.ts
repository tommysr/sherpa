import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Protocol } from '../target/types/protocol'

export const STATE_SEED = 'state'
export const SHIPPER_SEED = 'shipper'
export const TRANSPORT_SEED = 'shipment'

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

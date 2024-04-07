import * as anchor from '@coral-xyz/anchor'
import { Program, utils, BN } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Protocol } from '../target/types/protocol'

export const STATE_SEED = 'state'
export const SHIPPER_SEED = 'shipper'
export const FORWARDER_SEED = 'forwarder'
export const CARRIER_SEED = 'carrier'
export const SHIPMENT_SEED = 'shipment'
export const BOUGHT_SHIPMENT_SEED = 'forwarded'
export const OFFER_SEED = 'offer'
export const ACCEPTED_OFFER_SEED = 'task'
export const TEST_DF_BASE = new BN(5)
export const TEST_DF_MODULUS = new BN(23)
export const DF_MODULUS = Buffer.from(
  'aa8cc4e9c4ea50f440bcb3f5e2c9166c47f2646b7cd0c44e794b1ed7ec3a1013c7d5c87f2ea9560a0f408acc6d15ffa472e0f00bb1d400e3752faf18880d180ba5a879d9a39b546fa9b78e5da4ea49b57333d1acb97bba3aec3fc516218ac8351c539c041c47f80556ddebec287c350cbced0eb0a577dfb6c5d0eb48cc2802adb50a5c59ee6f0e53c3086489bd76c5ef4ae205aca2cced329f62bfa79a8d13fc483c399b6bcb86509376b85e9491a416ff916614d8c198ff3a3c7007d41af999d2a1e02ef4814218c4e87e44333a9c93fa2fcdd966b570e7617f9b8d0cf03c18a8fe1a5f4d08c00b5c0286988372ddc7631f305f04405f45824629f331ac9357',
  'hex'
)
export const DF_BASE = 2

export const getStateAddress = (program: Program<Protocol>) => {
  const [stateAddress, stateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode(STATE_SEED))],
    program.programId
  )
  return stateAddress
}

export const getShipperAddress = (program: Program<Protocol>, shipper: PublicKey) => {
  const [shipperAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode(SHIPPER_SEED)), shipper.toBuffer()],
    program.programId
  )
  return shipperAddress
}

export const getForwarderAddress = (program: Program<Protocol>, forwarder: PublicKey) => {
  const [forwarderAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode(FORWARDER_SEED)), forwarder.toBuffer()],
    program.programId
  )
  return forwarderAddress
}

export const getCarrierAddress = (program: Program<Protocol>, carrier: PublicKey) => {
  const [carrierAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode(CARRIER_SEED)), carrier.toBuffer()],
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
    [Buffer.from(utils.bytes.utf8.encode(SHIPMENT_SEED)), shipper.toBuffer(), indexBuffer],
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
    [Buffer.from(utils.bytes.utf8.encode(BOUGHT_SHIPMENT_SEED)), forwarder.toBuffer(), indexBuffer],
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
    [Buffer.from(utils.bytes.utf8.encode(OFFER_SEED)), carrier.toBuffer(), indexBuffer],
    program.programId
  )

  return offerAddress
}

export const getAcceptedOfferAddress = (program, carrier: PublicKey, index: number) => {
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(index)

  const [offerAddress, offerBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(utils.bytes.utf8.encode(ACCEPTED_OFFER_SEED)), carrier.toBuffer(), indexBuffer],
    program.programId
  )

  return offerAddress
}

export const encodeName = (utf8Name: string) => {
  const encoded = utils.bytes.utf8.encode(utf8Name)

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

  return utils.bytes.utf8.decode(Buffer.from(result))
}

type BNN = InstanceType<typeof BN>
export const encodeKey = (key: BNN) => {
  const single = new BN(2).pow(new BN(64))
  let value = [key.mod(single)]

  let remaining = key

  while (key.gte(single)) {
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

export const decodeKey = (encoded: { value: BNN[] }) => {
  const single = new BN(2).pow(new BN(64))
  let result = new BN(0)

  let remaining = new BN(1)

  for (let i = 0; i < encoded.value.length; i++) {
    result = result.add(encoded.value[i].mul(remaining))
    remaining = remaining.mul(single)
  }

  return result
}

export const encrypt = (plain: string, key: BNN) => {
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

export const decodeDecrypted = (words: number[]): string => {
  let result: number[] = []

  for (let i of words) {
    result.push((i >> 24) % 256)
    result.push((i >> 16) % 256)
    result.push((i >> 8) % 256)
    result.push(i % 256)
  }

  let decoded = utils.bytes.utf8.decode(Buffer.from(result))

  while (decoded[decoded.length - 1] === '\n') {
    decoded = decoded.slice(0, -1)
  }

  return decoded
}

import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import {
  encodeName,
  getCarrierAddress,
  getForwarderAddress,
  getShipmentAddress,
  getShipperAddress,
  getStateAddress
} from '../sdk/sdk'
import { ONE_SOL } from '../tests/utils'
import { crateFromSchoolToAirport } from './mocks/shipments'
import { ANDREW, JACOB, IGOR, ZDZICH } from './mocks/shippers'

const connection = new Connection(clusterApiUrl('devnet'), { commitment: 'confirmed' })
const wallet = Wallet.local()
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
anchor.setProvider(provider)
const program = anchor.workspace.Protocol as Program<Protocol>

const run = async () => {
  console.log('Running for', program.programId.toBase58())
  console.log('Running as ', provider.wallet.publicKey.toBase58())

  // State
  const stateAddress = await getStateAddress(program)
  let stateExists = (await program.account.state.fetchNullable(stateAddress)) !== null

  if (!stateExists) {
    console.log('Creating state account')
    await program.methods.initializeState().accounts({ state: stateAddress }).rpc()
  } else {
    console.log('State account already exists')
  }
  console.log('State', await program.account.state.fetch(stateAddress))

  // Shipper
  const shipper = ANDREW
  const shipperAddress = getShipperAddress(program, shipper.publicKey)

  const shipperExists = (await program.account.shipper.fetchNullable(shipperAddress)) !== null
  if (!shipperExists) {
    console.log('Creating shipper account')
    await program.methods
      .registerShipper(encodeName('Andrew'))
      .accounts({
        shipper: shipperAddress,
        signer: shipper.publicKey
      })
      .signers([shipper])
      .rpc()
  }

  const shipperAccount = await program.account.shipper.fetch(shipperAddress)
  console.log('Shipper', shipper.publicKey.toBase58(), shipperAccount)

  // Shipment
  const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
  const shipmentExists = (await program.account.shipment.fetchNullable(shipmentAddress)) !== null

  if (!shipmentExists) {
    const shipmentPrice = new BN(5).mul(ONE_SOL)
    await program.methods
      .createShipment(shipmentPrice, encodeName('Świerze Boróweczki'), crateFromSchoolToAirport)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey
      })
      .signers([shipper])
      .rpc()
  }

  const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
  console.log('Shipment', shipmentAddress.toBase58(), shipmentAccount)

  // Available Carrier
  const carrier = IGOR
  const carrierAddress = getCarrierAddress(program, carrier.publicKey)

  const carrierExists = (await program.account.carrier.fetchNullable(carrierAddress)) !== null

  if (!carrierExists) {
    console.log('Creating carrier account')
    const availability = {
      time: new BN(Date.now()),
      location: {
        latitude: 43,
        longitude: 44
      }
    }
    await program.methods
      .registerCarrier(encodeName('Igor'), availability)
      .accounts({
        carrier: carrierAddress,
        signer: carrier.publicKey
      })
      .signers([carrier])
      .rpc()
  }

  const carrierAccount = await program.account.carrier.fetch(carrierAddress)
  console.log('Carrier', carrier.publicKey.toBase58(), carrierAccount)

  // Unavailable Carrier
  const unavailableCarrier = ZDZICH
  const unavailableCarrierAddress = getCarrierAddress(program, unavailableCarrier.publicKey)

  const unavailableCarrierExists =
    (await program.account.carrier.fetchNullable(unavailableCarrierAddress)) !== null

  if (!unavailableCarrierExists) {
    console.log('Creating unavailable carrier account')
    await program.methods
      .registerCarrier(encodeName('Zdzich'), null)
      .accounts({
        carrier: unavailableCarrierAddress,
        signer: unavailableCarrier.publicKey
      })
      .signers([unavailableCarrier])
      .rpc()
  }

  const unavailableCarrierAccount = await program.account.carrier.fetch(unavailableCarrierAddress)
  console.log(
    'Unavailable carrier',
    unavailableCarrier.publicKey.toBase58(),
    unavailableCarrierAccount
  )

  // Forwarder
  const forwarder = JACOB
  const forwarderAddress = getForwarderAddress(program, forwarder.publicKey)

  const forwarderExists = (await program.account.forwarder.fetchNullable(forwarderAddress)) !== null

  if (!forwarderExists) {
    console.log('Creating forwarder account')
    await program.methods
      .registerForwarder(encodeName('Jacob'))
      .accounts({
        forwarder: forwarderAddress,
        signer: forwarder.publicKey
      })
      .signers([forwarder])
      .rpc()
  }

  const forwarderAccount = await program.account.forwarder.fetch(forwarderAddress)
  console.log('Forwarder', forwarder.publicKey.toBase58(), forwarderAccount)
}

run()

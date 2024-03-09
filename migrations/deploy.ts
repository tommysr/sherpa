import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import { getShipmentAddress, getShipperAddress, getStateAddress } from '../sdk/sdk'
import { ONE_SOL } from '../tests/utils'
import { crateFromSchoolToAirport } from './mocks/shipments'
import { ANDREW } from './mocks/shippers'

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
      .registerShipper()
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
      .createShipment(shipmentPrice, crateFromSchoolToAirport)
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
}

run()

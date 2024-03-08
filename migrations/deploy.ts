import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { SHIPPER_SEED, TRANSPORT_SEED, getStateAddress } from '../tests/sdk'
import { ONE_SOL, awaitedAirdrops } from '../tests/utils'
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
  const stateExists = (await program.account.state.fetch(stateAddress)) !== undefined
  if (!stateExists) {
    console.log('Creating state account')
    await program.methods.initializeState().accounts({ state: stateAddress }).rpc()
  } else {
    console.log('State account already exists')
  }
  console.log('State', await program.account.state.fetch(stateAddress))

  // Shipper
  const shipper = ANDREW

  await awaitedAirdrops(program.provider.connection, [shipper.publicKey], 1e9)
  const [shipperAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(SHIPPER_SEED)), shipper.publicKey.toBuffer()],
    program.programId
  )

  await program.methods
    .registerShipper()
    .accounts({
      shipper: shipperAddress,
      signer: shipper.publicKey
    })
    .signers([shipper])
    .rpc()

  const shipperAccount = await program.account.shipper.fetch(shipperAddress)
  console.log('Shipper', shipper.publicKey.toBase58(), shipperAccount)

  // Shipment
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeInt32LE(0)
  const [shipmentAddress, shipmentBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode(TRANSPORT_SEED)),
      shipper.publicKey.toBuffer(),
      indexBuffer
    ],
    program.programId
  )

  const shipmentPrice = new anchor.BN(5).mul(ONE_SOL)

  await program.methods
    .createShipment(shipmentPrice, crateFromSchoolToAirport)
    .accounts({
      shipment: shipmentAddress,
      shipper: shipperAddress,
      signer: shipper.publicKey
    })
    .signers([shipper])
    .rpc()

  const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
  console.log('Shipment', shipmentAddress.toBase58(), shipmentAccount)
}

run()

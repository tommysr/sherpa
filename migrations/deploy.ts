// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import { AnchorProvider, Program, Provider, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { SHIPPER_SEED, STATE_SEED, TRANSPORT_SEED } from '../tests/sdk'
import { ONE_SOL, awaitedAirdrops } from '../tests/utils'
import { BN } from 'bn.js'

const connection = new Connection('https://api.devnet.solana.com', { commitment: 'confirmed' })
const wallet = Wallet.local()
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
anchor.setProvider(provider)
const program = anchor.workspace.Protocol as Program<Protocol>

// account addresses
const [stateAddress, stateBump] = PublicKey.findProgramAddressSync(
  [Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
  program.programId
)

const run = async () => {
  console.log('Running for', program.programId.toBase58())
  console.log('Running as ', provider.wallet.publicKey.toBase58())

  // State

  const stateExists = (await program.account.state.fetch(stateAddress)) !== undefined
  if (!stateExists) {
    console.log('Creating state account')
    await program.methods.initializeState().accounts({ state: stateAddress }).rpc()
  } else {
    console.log('State account already exists')
  }
  console.log('State', await program.account.state.fetch(stateAddress))

  // Shipper
  const shipper = Keypair.generate()
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

  const shipmentData = {
    price: new BN(4200).mul(ONE_SOL),
    from: {
      latitude: 0,
      longitude: 0
    },
    to: {
      latitude: 0,
      longitude: 0
    },
    dimensions: {
      weight: 0,
      width: 0,
      depth: 0,
      height: 0
    },
    when: new BN(0),
    deadline: new BN(0),
    shipmentDetails: {
      priority: 0,
      fragility: 0,
      access: 0,
      reserved: [0, 0, 0, 0, 0]
    }
  }

  await program.methods
    .createShipment(shipmentData)
    .accounts({
      shipment: shipmentAddress,
      shipper: shipperAddress,
      signer: shipper.publicKey
    })
    .signers([shipper])
    .rpc()

  const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
}

run()

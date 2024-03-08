// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import { AnchorProvider, Program, Provider, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { SHIPPER_SEED, STATE_SEED, TRANSPORT_SEED, getStateAddress } from '../tests/sdk'
import { awaitedAirdrops } from '../tests/utils'
import { crateFromSchoolToAirport } from './mocks/shipments'
import { ANDREW } from './mocks/shippers'

const connection = new Connection('https://api.devnet.solana.com', { commitment: 'confirmed' })
const wallet = Wallet.local()
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
anchor.setProvider(provider)
const program = anchor.workspace.Protocol as Program<Protocol>

// account addresses
const stateAddress = getStateAddress(program)

const run = async () => {
  console.log('Running for', program.programId.toBase58())
  console.log('Running as ', provider.wallet.publicKey.toBase58())

  // State
  // const stateAccount = await program.account.state.fetch(stateAddress)
  // console.log('State', stateAddress.toBase58(), stateAccount)

  // Shipper
  console.log('andrew', ANDREW.publicKey.toBase58())
}

run()

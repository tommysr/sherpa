import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { awaitedAirdrop, waitFor } from './utils'
import { STATE_SEED } from './sdk'
import { expect } from 'chai'

describe('protocol', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())
  const program = anchor.workspace.Protocol as Program<Protocol>

  const admin = Keypair.generate()
  const connection = program.provider.connection

  const [state, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
    program.programId
  )

  before(async () => {
    await awaitedAirdrop(program.provider.connection, admin.publicKey, 1e9)
  })

  it('Is initialized!', async () => {
    await program.methods
      .initialize()
      .accounts({
        state,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([admin])
      .rpc()

    const stateAccount = await program.account.state.fetch(state)
    expect(stateAccount.admin.equals(admin.publicKey)).true
  })
})

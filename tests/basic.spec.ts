import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { awaitedAirdrop, awaitedAirdrops, prefunded } from './utils'
import { SHIPPER_SEED, STATE_SEED, TRANSPORT_SEED } from './sdk'
import { expect } from 'chai'

describe('protocol', () => {
  // access to blockchain
  anchor.setProvider(anchor.AnchorProvider.env())
  const program = anchor.workspace.Protocol as Program<Protocol>
  const connection = program.provider.connection

  // keypairs
  const admin = Keypair.generate()
  const shipper = Keypair.generate()

  // account addresses
  const [stateAddress, stateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(STATE_SEED))],
    program.programId
  )

  const [shipperAddress, shipperBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(SHIPPER_SEED)), shipper.publicKey.toBuffer()],
    program.programId
  )

  before(async () => {
    await awaitedAirdrops(program.provider.connection, [admin.publicKey, shipper.publicKey], 1e9)
  })

  it('init state', async () => {
    await program.methods
      .initializeState()
      .accounts({
        state: stateAddress,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([admin])
      .rpc()

    const stateAccount = await program.account.state.fetch(stateAddress)
    expect(stateAccount.admin.equals(admin.publicKey)).true
  })

  it('register shipper', async () => {
    await program.methods
      .registerShipper()
      .accounts({
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const stateAccount = await program.account.shipper.fetch(shipperAddress)
    expect(stateAccount).not.undefined
  })

  it('create transport', async () => {
    const indexBuffer = Buffer.alloc(4)
    indexBuffer.writeInt32LE(0)
    const [transportAddress, transportBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode(TRANSPORT_SEED)),
        shipper.publicKey.toBuffer(),
        indexBuffer
      ],
      program.programId
    )

    const transportData = {
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
        volume: 0
      },
      when: new BN(0),
      transportDetails: {
        priority: 0,
        fragility: 0,
        reserved: [0, 0, 0, 0, 0, 0]
      }
    }

    await program.methods
      .createTransport(transportData)
      .accounts({
        transport: transportAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const transportAccount = await program.account.transport.fetch(transportAddress)

    expect(transportAccount.from).to.deep.equal(transportData.from)
    expect(transportAccount.to).to.deep.equal(transportData.to)
    expect(transportAccount.dimensions).to.deep.equal(transportData.dimensions)
    expect(transportAccount.when.eq(transportData.when)).true
    expect(transportAccount.transportDetails).to.deep.equal(transportData.transportDetails)
  })

  it('create second transport', async () => {
    const indexBuffer = Buffer.alloc(4)
    indexBuffer.writeInt32LE(1)
    const [transportAddress, transportBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode(TRANSPORT_SEED)),
        shipper.publicKey.toBuffer(),
        indexBuffer
      ],
      program.programId
    )

    const transportData = {
      from: {
        latitude: 1,
        longitude: 1
      },
      to: {
        latitude: 1,
        longitude: 1
      },
      dimensions: {
        weight: 1,
        volume: 1
      },
      when: new BN(1),
      transportDetails: {
        priority: 1,
        fragility: 1,
        reserved: [1, 1, 1, 1, 1, 1]
      }
    }

    await program.methods
      .createTransport(transportData)
      .accounts({
        transport: transportAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const transportAccount = await program.account.transport.fetch(transportAddress)
    expect(transportAccount.from).to.deep.equal(transportData.from)
    expect(transportAccount.to).to.deep.equal(transportData.to)
    expect(transportAccount.dimensions).to.deep.equal(transportData.dimensions)
    expect(transportAccount.when.eq(transportData.when)).true
    expect(transportAccount.transportDetails).to.deep.equal(transportData.transportDetails)

    const firstTransportAccount = await program.account.transport.fetch(transportAddress)
    expect(firstTransportAccount.from).to.deep.equal(transportData.from)
    expect(firstTransportAccount.to).to.deep.equal(transportData.to)
    expect(firstTransportAccount.dimensions).to.deep.equal(transportData.dimensions)
    expect(firstTransportAccount.when.eq(transportData.when)).true
    expect(firstTransportAccount.transportDetails).to.deep.equal(transportData.transportDetails)
  })
})

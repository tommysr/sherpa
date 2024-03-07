import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { ONE_SOL, awaitedAirdrop, awaitedAirdrops, prefunded } from './utils'
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

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount).not.undefined
  })

  it('create shipment', async () => {
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
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)

    expect(shipmentAccount.price.eq(shipmentData.price)).true
    expect(shipmentAccount.from).to.deep.equal(shipmentData.from)
    expect(shipmentAccount.to).to.deep.equal(shipmentData.to)
    expect(shipmentAccount.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.when.eq(shipmentData.when)).true
    expect(shipmentAccount.deadline.eq(shipmentData.deadline)).true
    expect(shipmentAccount.shipmentDetails).to.deep.equal(shipmentData.shipmentDetails)
  })

  it('create second shipment', async () => {
    const indexBuffer = Buffer.alloc(4)
    indexBuffer.writeInt32LE(1)
    const [shipmentAddress, shipmentBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode(TRANSPORT_SEED)),
        shipper.publicKey.toBuffer(),
        indexBuffer
      ],
      program.programId
    )

    const shipmentData = {
      price: new BN(2100).mul(ONE_SOL),
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
        width: 1,
        depth: 1,
        height: 1
      },
      when: new BN(1),
      deadline: new BN(1),
      shipmentDetails: {
        priority: 1,
        fragility: 1,
        access: 1,
        reserved: [1, 1, 1, 1, 1]
      }
    }

    await program.methods
      .createShipment(shipmentData)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.price.eq(shipmentData.price)).true
    expect(shipmentAccount.from).to.deep.equal(shipmentData.from)
    expect(shipmentAccount.to).to.deep.equal(shipmentData.to)
    expect(shipmentAccount.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.when.eq(shipmentData.when)).true
    expect(shipmentAccount.deadline.eq(shipmentData.deadline)).true
    expect(shipmentAccount.shipmentDetails).to.deep.equal(shipmentData.shipmentDetails)

    const firstShipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(firstShipmentAccount.price.eq(shipmentData.price)).true
    expect(firstShipmentAccount.from).to.deep.equal(shipmentData.from)
    expect(firstShipmentAccount.to).to.deep.equal(shipmentData.to)
    expect(firstShipmentAccount.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(firstShipmentAccount.when.eq(shipmentData.when)).true
    expect(firstShipmentAccount.deadline.eq(firstShipmentAccount.deadline)).true
    expect(firstShipmentAccount.shipmentDetails).to.deep.equal(shipmentData.shipmentDetails)
  })
})

import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { ONE_SOL, awaitedAirdrops } from './utils'
import {
  SHIPMENT_SEED,
  getForwarderAddress,
  getShipmentAddress,
  getShipperAddress,
  getStateAddress
} from '../sdk/sdk'
import { expect } from 'chai'

describe('protocol', () => {
  // access to blockchain
  anchor.setProvider(anchor.AnchorProvider.env())
  const program = anchor.workspace.Protocol as Program<Protocol>
  const connection = program.provider.connection

  // keypairs
  const admin = Keypair.generate()
  const shipper = Keypair.generate()
  const forwarder = Keypair.generate()

  // account addresses
  const stateAddress = getStateAddress(program)
  const shipperAddress = getShipperAddress(program, shipper.publicKey)
  const forwarderAddress = getForwarderAddress(program, forwarder.publicKey)

  before(async () => {
    await awaitedAirdrops(
      program.provider.connection,
      [admin.publicKey, shipper.publicKey, forwarder.publicKey],
      1e9
    )
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
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(shipperAccount.count).eq(0)
  })

  it('create shipment', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    const shipmentPrice = new BN(4200).mul(ONE_SOL)
    const shipmentData = {
      geography: {
        from: {
          latitude: 0,
          longitude: 0
        },
        to: {
          latitude: 0,
          longitude: 0
        }
      },
      dimensions: {
        weight: 0,
        width: 0,
        depth: 0,
        height: 0
      },
      when: new BN(0),
      deadline: new BN(0),
      details: {
        count: 0,
        priority: 0,
        fragility: 0,
        access: 0,
        reserved: [0, 0, 0]
      }
    }

    await program.methods
      .createShipment(shipmentPrice, shipmentData)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)

    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.owner.equals(shipper.publicKey)).true
    expect(shipmentAccount.price.eq(shipmentPrice)).true
    expect(shipmentAccount.no).eq(0)
    expect(shipmentAccount.shipment.geography).to.deep.equal(shipmentData.geography)
    expect(shipmentAccount.shipment.details).to.deep.equal(shipmentData.details)
    expect(shipmentAccount.shipment.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.shipment.when.eq(shipmentData.when)).true
    expect(shipmentAccount.shipment.deadline.eq(shipmentData.deadline)).true

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(shipperAccount.count).eq(1)
  })

  it('create second shipment', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 1)
    const shipmentPrice = new BN(2100).mul(ONE_SOL)
    const shipmentData = {
      geography: {
        from: {
          latitude: 1,
          longitude: 1
        },
        to: {
          latitude: 1,
          longitude: 1
        }
      },
      dimensions: {
        weight: 1,
        width: 1,
        depth: 1,
        height: 1
      },
      details: {
        count: 1,
        priority: 1,
        fragility: 1,
        access: 1,
        reserved: [1, 1, 1]
      },
      when: new BN(1),
      deadline: new BN(1)
    }

    await program.methods
      .createShipment(shipmentPrice, shipmentData)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.owner.equals(shipper.publicKey)).true
    expect(shipmentAccount.price.eq(shipmentPrice)).true
    expect(shipmentAccount.no).eq(1)
    expect(shipmentAccount.shipment.geography).to.deep.equal(shipmentData.geography)
    expect(shipmentAccount.shipment.details).to.deep.equal(shipmentData.details)
    expect(shipmentAccount.shipment.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.shipment.when.eq(shipmentData.when)).true
    expect(shipmentAccount.shipment.deadline.eq(shipmentData.deadline)).true

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(shipperAccount.count).eq(2)
  })

  it('register forwarder', async () => {
    await program.methods
      .registerForwarder()
      .accounts({
        forwarder: forwarderAddress,
        signer: forwarder.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([forwarder])
      .rpc()

    const forwarderAccount = await program.account.forwarder.fetch(forwarderAddress)
    expect(forwarderAccount.authority.equals(forwarder.publicKey)).true
  })

  it('buy shipment', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    await program.methods
      .buyShipment()
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        forwarder: forwarderAddress,
        signer: forwarder.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([forwarder])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.owner.equals(forwarder.publicKey)).true
  })
})

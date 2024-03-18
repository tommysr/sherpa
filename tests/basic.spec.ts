import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { ONE_HOUR, ONE_SOL, U32_MAX, awaitedAirdrops } from './utils'
import {
  decodeName,
  encodeName,
  getAcceptedOfferAddress,
  getBoughtShipmentAddress,
  getCarrierAddress,
  getForwarderAddress,
  getOfferAddress,
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
  const carrier = Keypair.generate()

  // account addresses
  const stateAddress = getStateAddress(program)
  const shipperAddress = getShipperAddress(program, shipper.publicKey)
  const forwarderAddress = getForwarderAddress(program, forwarder.publicKey)
  const carrierAddress = getCarrierAddress(program, carrier.publicKey)

  before(async () => {
    await awaitedAirdrops(
      program.provider.connection,
      [admin.publicKey, shipper.publicKey, forwarder.publicKey, carrier.publicKey],
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
      .registerShipper(encodeName('Alice'))
      .accounts({
        shipper: shipperAddress,
        signer: shipper.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([shipper])
      .rpc()

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount.creator.equals(shipper.publicKey)).true
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(decodeName(shipperAccount.name)).eq('Alice')
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

    const subscriptionId = program.addEventListener('ShipmentCreated', event => {
      expect(event.shipper.equals(shipperAddress)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

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

    program.removeEventListener(subscriptionId)

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

    const subscriptionId = program.addEventListener('ShipmentCreated', event => {
      expect(event.shipper.equals(shipperAddress)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

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

    program.removeEventListener(subscriptionId)

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
      .registerForwarder(encodeName('Bob'))
      .accounts({
        forwarder: forwarderAddress,
        signer: forwarder.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([forwarder])
      .rpc()

    const forwarderAccount = await program.account.forwarder.fetch(forwarderAddress)
    expect(forwarderAccount.creator.equals(forwarder.publicKey)).true
    expect(forwarderAccount.authority.equals(forwarder.publicKey)).true
    expect(decodeName(forwarderAccount.name)).eq('Bob')
    expect(forwarderAccount.count).eq(0)
  })

  it('buy shipment', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    const boughtShipmentAddress = getBoughtShipmentAddress(program, forwarder.publicKey, 0)

    const subscriptionId = program.addEventListener('ShipmentTransferred', event => {
      expect(event.seller.equals(shipperAddress)).true
      expect(event.buyer.equals(forwarderAddress)).true
      expect(event.before.equals(shipmentAddress)).true
      expect(event.after.equals(boughtShipmentAddress)).true
    })

    await program.methods
      .buyShipment()
      .accounts({
        bought: boughtShipmentAddress,
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

    const forwarderAccount = await program.account.forwarder.fetch(forwarderAddress)
    expect(forwarderAccount.count).eq(1)

    const boughtShipment = await program.account.boughtShipment.fetch(boughtShipmentAddress)
    expect(boughtShipment.owner.equals(forwarder.publicKey)).true
    expect(boughtShipment.no).eq(0)
    expect(boughtShipment.shipment).to.deep.equal(shipmentAccount.shipment)

    program.removeEventListener(subscriptionId)
  })

  it('register carrier', async () => {
    const availability = {
      time: new BN(Date.now()),
      location: {
        latitude: 43,
        longitude: 44
      }
    }

    await program.methods
      .registerCarrier(encodeName('Carol'), availability)
      .accounts({
        carrier: carrierAddress,
        signer: carrier.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([carrier])
      .rpc()

    const carrierAccount = await program.account.carrier.fetch(carrierAddress)
    expect(carrierAccount.creator.equals(carrier.publicKey)).true
    expect(carrierAccount.authority.equals(carrier.publicKey)).true
    expect(decodeName(carrierAccount.name)).eq('Carol')
    expect(carrierAccount.availability.time.eq(availability.time)).true
    expect(carrierAccount.availability.location).to.deep.equal(availability.location)
    expect(carrierAccount.offersCount).eq(0)
    expect(carrierAccount.tasksCount).eq(0)
  })

  it('make offer', async () => {
    const offerAddress = getOfferAddress(program, carrier.publicKey, 0)
    const shipmentAddress = getBoughtShipmentAddress(program, forwarder.publicKey, 0)

    const subscriptionId = program.addEventListener('OfferMade', event => {
      expect(event.from.equals(forwarder.publicKey)).true
      expect(event.to.equals(carrier.publicKey)).true
      expect(event.offer.equals(offerAddress)).true
    })

    await program.methods
      .makeOffer(ONE_SOL, 3600)
      .accounts({
        offer: offerAddress,
        shipment: shipmentAddress,
        forwarder: forwarderAddress,
        carrier: carrierAddress,
        signer: forwarder.publicKey
      })
      .signers([forwarder])
      .rpc()

    const boughtShipment = await program.account.boughtShipment.fetch(shipmentAddress)
    expect(boughtShipment.buyer.equals(forwarder.publicKey)).true
    expect(boughtShipment.owner.equals(forwarder.publicKey)).true

    const offerAccount = await program.account.shipmentOffer.fetch(offerAddress)
    expect(offerAccount.owner.equals(carrier.publicKey)).true
    expect(offerAccount.details.payment.eq(ONE_SOL)).true
    expect(offerAccount.details.collateral.eqn(0)).true
    expect(offerAccount.details.deadline.eq(U32_MAX)).true
    expect(offerAccount.shipment).to.deep.equal(boughtShipment.shipment)

    const carrierAccount = await program.account.carrier.fetch(carrierAddress)
    expect(carrierAccount.offersCount).eq(1)
    expect(carrierAccount.tasksCount).eq(0)

    program.removeEventListener(subscriptionId)
  })

  it('accept offer', async () => {
    const offerAddress = getOfferAddress(program, carrier.publicKey, 0)
    const shipmentAddress = getBoughtShipmentAddress(program, forwarder.publicKey, 0)
    const taskAddress = getAcceptedOfferAddress(program, carrier.publicKey, 0)

    const subscriptionId = program.addEventListener('OfferAccepted', event => {
      expect(event.from.equals(forwarder.publicKey)).true
      expect(event.to.equals(carrier.publicKey)).true
      expect(event.offer.equals(offerAddress)).true
    })

    await program.methods
      .acceptOffer()
      .accounts({
        task: taskAddress,
        offer: offerAddress,
        shipment: shipmentAddress,
        forwarder: forwarderAddress,
        carrier: carrierAddress,
        signer: carrier.publicKey
      })
      .signers([carrier])
      .rpc()

    const shipmentAccount = await program.account.boughtShipment.fetch(shipmentAddress)
    expect(shipmentAccount.buyer.equals(forwarder.publicKey)).true
    expect(shipmentAccount.owner.equals(carrier.publicKey)).true

    const offerAccount = await program.account.shipmentOffer.fetch(offerAddress)
    expect(offerAccount.owner.equals(carrier.publicKey)).true

    const taskAccount = await program.account.acceptedOffer.fetch(taskAddress)
    expect(taskAccount.owner.equals(carrier.publicKey)).true
    expect(taskAccount.shipment).to.deep.equal(shipmentAccount.shipment)
    expect(taskAccount.details.payment.eq(offerAccount.details.payment)).true
    expect(taskAccount.details.collateral.eq(offerAccount.details.collateral)).true
    expect(taskAccount.details.deadline.eq(offerAccount.details.deadline)).true
    expect(taskAccount.no).eq(0)

    program.removeEventListener(subscriptionId)
  })
})

import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { ONE_HOUR, ONE_SOL, U64_MAX, awaitedAirdrops } from './utils'
import {
  DF_BASE,
  DF_MODULUS,
  TEST_DF_BASE,
  TEST_DF_MODULUS,
  decodeDecrypted,
  decodeKey,
  decodeName,
  encodeKey,
  encodeString,
  getAcceptedOfferAddress,
  getBoughtShipmentAddress,
  getCarrierAddress,
  getForwarderAddress,
  getOfferAddress,
  getShipmentAddress,
  getShipperAddress,
  getStateAddress
} from './sdk'
import { expect } from 'chai'
import { AES } from 'crypto-ts'
import { createDiffieHellman } from 'crypto'

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

  // Carrier DH key
  let carrierKey: Buffer

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
        admin: admin.publicKey
      })
      .signers([admin])
      .rpc()

    const stateAccount = await program.account.state.fetch(stateAddress)
    expect(stateAccount.admin.equals(admin.publicKey)).true
  })

  it('register shipper', async () => {
    await program.methods
      .registerShipper(encodeString('Alice'))
      .accounts({
        shipper: shipperAddress,
        signer: shipper.publicKey
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
    const shipmentPrice = ONE_SOL.divn(2)
    const shipmentData = {
      collateral: ONE_SOL.divn(5),
      penalty: ONE_SOL.divn(10),
      geography: {
        from: {
          latitude: 0,
          longitude: 0
        },
        fromName: encodeString('Kraków, main square'),
        to: {
          latitude: 0,
          longitude: 0
        },
        toName: encodeString('Warsaw, main square')
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
      expect(event.shipper.equals(shipper.publicKey)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

    const balanceBefore = await connection.getBalance(shipper.publicKey)

    await program.methods
      .createShipment(shipmentPrice, encodeString('Just a pair of socks'), shipmentData)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        payer: shipper.publicKey
      })
      .signers([shipper])
      .rpc()

    program.removeEventListener(subscriptionId)

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)

    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.forwarder.equals(new PublicKey(0))).true
    expect(shipmentAccount.carrier.equals(new PublicKey(0))).true
    expect(shipmentAccount.status).eq(1)
    expect(shipmentAccount.price.eq(shipmentPrice)).true
    expect(shipmentAccount.no).eq(0)
    expect(shipmentAccount.shipment.collateral.eq(shipmentData.collateral)).true
    expect(shipmentAccount.shipment.penalty.eq(shipmentData.penalty)).true
    expect(shipmentAccount.shipment.geography.from).to.deep.equal(shipmentData.geography.from)
    expect(shipmentAccount.shipment.geography.to).to.deep.equal(shipmentData.geography.to)
    expect(decodeName(shipmentAccount.shipment.geography.fromName)).eq('Kraków, main square')
    expect(decodeName(shipmentAccount.shipment.geography.toName)).eq('Warsaw, main square')

    expect(shipmentAccount.shipment.details).to.deep.equal(shipmentData.details)
    expect(shipmentAccount.shipment.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.shipment.when.eq(shipmentData.when)).true
    expect(shipmentAccount.shipment.deadline.eq(shipmentData.deadline)).true
    expect(decodeName(shipmentAccount.name)).eq('Just a pair of socks')

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(shipperAccount.count).eq(1)

    const balanceAfter = await connection.getBalance(shipper.publicKey)
    expect(balanceBefore - balanceAfter).gt(shipmentPrice.toNumber())
  })

  it('create second shipment', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 1)
    const shipmentPrice = ONE_SOL.divn(10)
    const shipmentData = {
      collateral: ONE_SOL.muln(20),
      penalty: ONE_SOL.divn(25),
      geography: {
        from: {
          latitude: 1,
          longitude: 1
        },
        fromName: encodeString('Kielce'),
        to: {
          latitude: 1,
          longitude: 1
        },
        toName: encodeString('Mielno')
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
      expect(event.shipper.equals(shipper.publicKey)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

    await program.methods
      .createShipment(shipmentPrice, encodeString('Some pretty rocks'), shipmentData)
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        signer: shipper.publicKey,
        payer: shipper.publicKey
      })
      .signers([shipper])
      .rpc()

    program.removeEventListener(subscriptionId)

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.forwarder.equals(new PublicKey(0))).true
    expect(shipmentAccount.carrier.equals(new PublicKey(0))).true
    expect(shipmentAccount.status).eq(1)
    expect(shipmentAccount.price.eq(shipmentPrice)).true
    expect(shipmentAccount.no).eq(1)
    expect(shipmentAccount.shipment.collateral.eq(shipmentData.collateral)).true
    expect(shipmentAccount.shipment.penalty.eq(shipmentData.penalty)).true
    expect(shipmentAccount.shipment.geography.from).to.deep.equal(shipmentData.geography.from)
    expect(shipmentAccount.shipment.geography.to).to.deep.equal(shipmentData.geography.to)
    expect(decodeName(shipmentAccount.shipment.geography.fromName)).eq('Kielce')
    expect(decodeName(shipmentAccount.shipment.geography.toName)).eq('Mielno')

    expect(shipmentAccount.shipment.details).to.deep.equal(shipmentData.details)
    expect(shipmentAccount.shipment.dimensions).to.deep.equal(shipmentData.dimensions)
    expect(shipmentAccount.shipment.when.eq(shipmentData.when)).true
    expect(shipmentAccount.shipment.deadline.eq(shipmentData.deadline)).true
    expect(decodeName(shipmentAccount.name)).eq('Some pretty rocks')

    const shipperAccount = await program.account.shipper.fetch(shipperAddress)
    expect(shipperAccount.authority.equals(shipper.publicKey)).true
    expect(shipperAccount.count).eq(2)
  })

  it('register forwarder', async () => {
    await program.methods
      .registerForwarder(encodeString('Bob'))
      .accounts({
        forwarder: forwarderAddress,
        signer: forwarder.publicKey,
        payer: forwarder.publicKey
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
    const forwardedShipmentAddress = getBoughtShipmentAddress(program, forwarder.publicKey, 0)

    const balanceBefore = await connection.getBalance(forwarder.publicKey)

    const subscriptionId = program.addEventListener('ShipmentTransferred', event => {
      expect(event.seller.equals(shipper.publicKey)).true
      expect(event.buyer.equals(forwarder.publicKey)).true
      expect(event.shipment.equals(shipmentAddress)).true
      expect(event.forwarded.equals(forwardedShipmentAddress)).true
    })

    await program.methods
      .buyShipment()
      .accounts({
        bought: forwardedShipmentAddress,
        shipment: shipmentAddress,
        shipper: shipperAddress,
        forwarder: forwarderAddress,
        signer: forwarder.publicKey,
        payer: forwarder.publicKey
      })
      .signers([forwarder])
      .rpc()

    const balanceAfter = await connection.getBalance(forwarder.publicKey)
    expect(balanceBefore - balanceAfter > ONE_SOL.divn(10).toNumber()).true

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.forwarder.equals(forwarder.publicKey)).true
    expect(shipmentAccount.carrier.equals(new PublicKey(0))).true
    expect(shipmentAccount.status).eq(2)

    const forwarderAccount = await program.account.forwarder.fetch(forwarderAddress)
    expect(forwarderAccount.count).eq(1)

    const forwardedShipment = await program.account.forwardedShipment.fetch(
      forwardedShipmentAddress
    )
    expect(forwardedShipment.forwarder.equals(forwarder.publicKey)).true
    expect(forwardedShipment.shipment.equals(shipmentAddress)).true
    expect(forwardedShipment.no).eq(0)
    expect(forwardedShipment.resellPrice.eq(U64_MAX)).true

    program.removeEventListener(subscriptionId)
  })

  it('register carrier', async () => {
    const availability = {
      time: new BN(Date.now()),
      location: {
        latitude: 43,
        longitude: 44
      },
      locationName: encodeString('Krakow')
    }

    await program.methods
      .registerCarrier(encodeString('Carol'), availability)
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
    expect(decodeName(carrierAccount.availability.locationName)).eq('Krakow')
    expect(carrierAccount.offersCount).eq(0)
    expect(carrierAccount.tasksCount).eq(0)
  })

  it('make offer', async () => {
    const offerAddress = getOfferAddress(program, carrier.publicKey, 0)
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)

    const subscriptionId = program.addEventListener('OfferMade', event => {
      expect(event.from.equals(forwarder.publicKey)).true
      expect(event.to.equals(carrier.publicKey)).true
      expect(event.offer.equals(offerAddress)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

    await program.methods
      .makeOffer(ONE_SOL.divn(4), 3600)
      .accounts({
        offer: offerAddress,
        shipment: shipmentAddress,
        forwarder: forwarderAddress,
        carrier: carrierAddress,
        signer: forwarder.publicKey,
        payer: forwarder.publicKey
      })
      .signers([forwarder])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.forwarder.equals(forwarder.publicKey)).true
    expect(shipmentAccount.carrier.equals(new PublicKey(0))).true
    expect(shipmentAccount.status).eq(3)

    const offerAccount = await program.account.shipmentOffer.fetch(offerAddress)
    expect(offerAccount.offeror.equals(forwarder.publicKey)).true
    expect(offerAccount.details.payment.eq(ONE_SOL.divn(4))).true
    expect(offerAccount.details.deadline.eq(U64_MAX)).true

    const carrierAccount = await program.account.carrier.fetch(carrierAddress)
    expect(carrierAccount.offersCount).eq(1)
    expect(carrierAccount.tasksCount).eq(0)

    program.removeEventListener(subscriptionId)
  })

  it('accept offer', async () => {
    const offerAddress = getOfferAddress(program, carrier.publicKey, 0)
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    const taskAddress = getAcceptedOfferAddress(program, carrier.publicKey, 0)

    const subscriptionId = program.addEventListener('OfferAccepted', event => {
      expect(event.from.equals(forwarder.publicKey)).true
      expect(event.to.equals(carrier.publicKey)).true
      expect(event.offer.equals(offerAddress)).true
      expect(event.shipment.equals(shipmentAddress)).true
    })

    const offerAccount = await program.account.shipmentOffer.fetch(offerAddress)
    const balanceBefore = await connection.getBalance(carrier.publicKey)

    await program.methods
      .acceptOffer()
      .accounts({
        task: taskAddress,
        offer: offerAddress,
        shipment: shipmentAddress,
        forwarder: forwarderAddress,
        carrier: carrierAddress,
        signer: carrier.publicKey,
        payer: carrier.publicKey
      })
      .signers([carrier])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.shipper.equals(shipper.publicKey)).true
    expect(shipmentAccount.forwarder.equals(forwarder.publicKey)).true
    expect(shipmentAccount.carrier.equals(carrier.publicKey)).true
    expect(shipmentAccount.status).eq(4)

    const offerAccountAfter = await program.account.shipmentOffer.fetchNullable(offerAddress)
    expect(offerAccountAfter).null

    const taskAccount = await program.account.acceptedOffer.fetch(taskAddress)
    expect(taskAccount.owner.equals(carrier.publicKey)).true
    expect(taskAccount.shipment.equals(shipmentAddress)).true
    expect(taskAccount.shipment.equals(offerAccount.shipment)).true
    expect(taskAccount.details.payment.eq(offerAccount.details.payment)).true
    expect(taskAccount.details.deadline.eq(offerAccount.details.deadline)).true
    expect(taskAccount.no).eq(0)

    const balanceAfter = await connection.getBalance(carrier.publicKey)
    expect(balanceBefore - balanceAfter).gt(shipmentAccount.shipment.collateral.toNumber())

    program.removeEventListener(subscriptionId)
  })

  it('open channel', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)

    const dh = createDiffieHellman(DF_MODULUS, DF_BASE)
    dh.generateKeys()

    carrierKey = dh.getPrivateKey()
    const shared = Uint8Array.from(dh.getPublicKey())

    const value = Array(256)
      .fill(0)
      .map((_, i) => shared[i] ?? 0)

    await program.methods
      .openChannel({ value })
      .accounts({
        shipment: shipmentAddress,
        signer: shipper.publicKey
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)

    expect(Uint8Array.from(shipmentAccount.channel.shipper.value).toString()).eq(shared.toString())
  })

  it('accept channel', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    const shipmentAccountBefore = await program.account.shipment.fetch(shipmentAddress)

    const otherPublic = Buffer.from(Uint8Array.from(shipmentAccountBefore.channel.shipper.value))
    const dh = createDiffieHellman(DF_MODULUS, DF_BASE)
    dh.generateKeys()

    const secret = dh.computeSecret(otherPublic)
    const shared = Uint8Array.from(dh.getPublicKey())

    let encrypted = AES.encrypt('Hello!', secret.toString('hex')).toString()
    const value = Array(256)
      .fill(0)
      .map((_, i) => shared[i] ?? 0)

    await program.methods
      .sendMessage({ value }, encodeString(encrypted, 256))
      .accounts({
        shipment: shipmentAddress,
        signer: carrier.publicKey
      })
      .signers([carrier])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)

    expect(Uint8Array.from(shipmentAccount.channel.carrier.value).toString()).eq(shared.toString())

    expect(decodeName(shipmentAccount.channel.data)).eq(encrypted.toString())

    const decrypted = AES.decrypt(decodeName(shipmentAccount.channel.data), secret.toString('hex'))
    expect(decodeDecrypted(decrypted.words)).eq('Hello!')
  })

  it('confirm delivery', async () => {
    const shipmentAddress = getShipmentAddress(program, shipper.publicKey, 0)
    const taskAddress = getAcceptedOfferAddress(program, carrier.publicKey, 0)
    const shipperAddress = getShipperAddress(program, shipper.publicKey)

    await program.methods
      .confirmDelivery()
      .accounts({
        shipment: shipmentAddress,
        shipper: shipperAddress,
        task: taskAddress,
        signer: shipper.publicKey,
        payer: shipper.publicKey,
        shipperOwner: shipper.publicKey,
        forwarderOwner: forwarder.publicKey,
        carrierOwner: carrier.publicKey,
        state: stateAddress
      })
      .signers([shipper])
      .rpc()

    const shipmentAccount = await program.account.shipment.fetch(shipmentAddress)
    expect(shipmentAccount.status).eq(5)
  })
})

// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, Keypair } from '@solana/web3.js'
import {
  decodeName,
  getCarrierAddress,
  getOfferAddresses,
  getShipmentAddresses,
  getShipperAddress,
  getStateAddress
} from '../tests/sdk'
import { ANDREW, JACOB, ZDZICH, IGOR } from './mocks/shippers'

const connection = new Connection('https://api.devnet.solana.com', { commitment: 'confirmed' })
const wallet = Wallet.local()
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
anchor.setProvider(provider)
const program = anchor.workspace.Protocol as Program<Protocol>

// account addresses
const stateAddress = getStateAddress(program)

const run = async () => {
  // console.log(Buffer.from(Keypair.generate().secretKey).toString('base64'))

  // console.log('Running for', program.programId.toBase58())
  // console.log('Running as ', provider.wallet.publicKey.toBase58())

  // // State
  // const stateAccount = await program.account.state.fetchNullable(stateAddress)
  // console.log('State', stateAddress.toBase58(), stateAccount)

  // // Shipper
  // console.log('andrew', ANDREW.publicKey.toBase58())
  // const shipperAddress = getShipperAddress(program, ANDREW.publicKey)
  // const shipperAccount = await program.account.shipper.fetch(shipperAddress)
  // console.log('Andrew shipper', shipperAddress.toBase58(), shipperAccount)

  // // Shipment
  // const shipmentAddresses = getShipmentAddresses(program, ANDREW.publicKey, shipperAccount.count)
  // const shipmentAccounts = await program.account.shipment.fetchMultiple(shipmentAddresses)
  // console.log(
  //   'Andrew shipments',
  //   shipmentAddresses.map((address, i) => [address.toBase58(), shipmentAccounts[i]])
  // )

  // // Available Carrier
  // const carrierAddress = getCarrierAddress(program, IGOR.publicKey)
  // const carrierAccount = await program.account.carrier.fetchNullable(carrierAddress)
  // console.log('Igor carrier', carrierAddress.toBase58(), carrierAccount)

  // // Unavailable Carrier
  // const unavailableCarrierAddress = getCarrierAddress(program, ZDZICH.publicKey)
  // const unavailableCarrierAccount = await program.account.carrier.fetchNullable(
  //   unavailableCarrierAddress
  // )
  // console.log('Zdzich carrier', unavailableCarrierAddress.toBase58(), unavailableCarrierAccount)

  // // Forwarder
  // const forwarderAddress = getCarrierAddress(program, JACOB.publicKey)
  // const forwarderAccount = await program.account.forwarder.fetchNullable(forwarderAddress)
  // console.log('Jacob forwarder', forwarderAddress.toBase58(), forwarderAccount)

  // Shipments
  // const offers = await program.account.shipmentOffer.all()
  // const shipments = await program.account.shipment.all()

  // const named = offers.map(o => {
  //   return { ...o, ship: shipments.find(s => s.publicKey.equals(o.account.shipment))! }
  // })

  // console.log(
  //   'Shipments',
  //   named.map(
  //     o =>
  //       decodeName(o.ship.account.name) +
  //       ' ' +
  //       o.ship.account.status +
  //       ' ' +
  //       o.ship.account.forwarder.toString() +

  //       ' ->  ' +

  //       o.account.
  //   )
  // )

  const carriers = await program.account.carrier.all()

  const a = await Promise.all(
    carriers
      .map(carriers =>
        getOfferAddresses(program, carriers.account.creator, carriers.account.offersCount)
      )
      .map(a => program.account.shipmentOffer.fetchMultiple(a))
  )
  console.log(a)

  const c = getOfferAddresses(program, carriers[0].publicKey, 0)

  console.log('Carriers', (await program.account.carrier.all()).length)
  console.log('Forwarders', (await program.account.forwarder.all()).length)
  console.log('Shippers', (await program.account.shipper.all()).length)
}

run()

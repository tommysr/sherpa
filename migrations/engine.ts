import probabilities from './mocks/probabilities.json'
import names from './mocks/names.json'
import keys from './mocks/keys.json'

import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import { Protocol } from '../target/types/protocol'
import * as anchor from '@coral-xyz/anchor'
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js'
import {
  encodeName,
  getCarrierAddress,
  getForwarderAddress,
  getShipmentAddress,
  getShipperAddress
} from '../sdk/sdk'
import { awaitedAirdrop } from '../tests/utils'

var fs = require('fs')

const connection = new Connection(clusterApiUrl('devnet'), { commitment: 'confirmed' })
const wallet = Wallet.local()
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
anchor.setProvider(provider)
const program = anchor.workspace.Protocol as Program<Protocol>

const run = async () => {
  const action = chooseAction()
  const keypair = Keypair.generate()
  const secret = Buffer.from(keypair.secretKey).toString('base64')

  switch (action) {
    case 'registerShipper':
      const shipperName = randomFrom(names.names) + ' ' + randomFrom(names.shipperPostfixes)
      const shipper = getShipperAddress(program, keypair.publicKey)

      await program.methods
        .registerShipper(encodeName(shipperName))
        .accounts({
          shipper,
          signer: keypair.publicKey
        })
        .signers([keypair])
        .rpc()

      keys.keys.push({ type: 'shipper', name: shipperName, secret })
      console.log('Registered shipper', shipperName)
      break

    case 'registerForwarder':
      const forwarderName = randomFrom(names.names) + ' ' + randomFrom(names.forwarderPostfixes)
      const forwarder = getForwarderAddress(program, keypair.publicKey)

      await program.methods
        .registerForwarder(encodeName(forwarderName))
        .accounts({
          forwarder,
          signer: keypair.publicKey
        })
        .signers([keypair])
        .rpc()

      keys.keys.push({ type: 'forwarder', name: forwarderName, secret })
      console.log('Registered forwarder', forwarderName)
      break

    case 'registerCarrier':
      const carrierName = randomFrom(names.names) + ' ' + randomFrom(names.carrierPostfixes)
      const carrier = getCarrierAddress(program, keypair.publicKey)
      let location: { lon: number; lat: number } | null = null

      if (Math.random() < probabilities.carrierIsAvailable) {
        const gotLocation = await chooseLocation()
      }

      await program.methods
        .registerCarrier(encodeName(carrierName), location)
        .accounts({
          carrier,
          signer: keypair.publicKey
        })
        .signers([keypair])
        .rpc()

      keys.keys.push({ type: 'carrier', name: carrierName, secret })
      console.log('Registered carrier', carrierName, 'at', location)
      break

    case 'createShipment':
      const shipperKey = randomFrom(keys.keys.filter(({ type }) => type === 'shipper'))
      const shipperSigner = keypairFromSecret(shipperKey.secret)
      const shipperAddress = getShipperAddress(program, shipperSigner.publicKey)
      const shipperAccount = await program.account.shipper.fetch(shipperAddress)
      const shipmentAddress = getShipmentAddress(
        program,
        shipperSigner.publicKey,
        shipperAccount.count
      )

      console.log('Creating shipment', shipperKey, shipperSigner.publicKey.toString())

      const shipmentPrice = new BN((0.2 + Math.random() * 0.4) * 1e9) // 0.2 - 0.6 SOL
      const from = await chooseLocation()
      const to = await chooseLocation()

      console.log('Ready to create shipment', from, to)

      const density = 0.2 + Math.random() * 3
      let dimensions = {
        weight: 1,
        width: 100 * Math.random() * 200 + 400,
        depth: 100 * Math.random() * 100 + 400,
        height: 100 * Math.random() * 100 + 700
      }
      dimensions.weight = dimensions.width * dimensions.depth * dimensions.height * density

      if (Math.random() < probabilities.nonSolid) {
        dimensions = {
          weight: dimensions.weight,
          width: dimensions.weight / density,
          depth: 0,
          height: 0
        }
      }

      const when = new BN(new Date().getTime().toString()).add(
        new BN(60)
          .muln(60)
          .muln(24)
          .mul(new BN(Math.floor(60 * 60 * 24 * (Math.random() * 12 - 2)).toString()))
      )

      const shipmentData = {
        geography: {
          from: {
            ...from
          },
          fromName: encodeName(from.parsedName),
          to: {
            ...to
          },
          toName: encodeName(to.parsedName)
        },
        dimensions,
        details: {
          count:
            Math.random() < probabilities.shipmentMoreThanOne
              ? Math.floor(Math.random() * 3 + 2)
              : 1,
          priority: Math.random() < probabilities.shipmentPriority ? 2 : 1,
          fragility: Math.random() < probabilities.shipmentFragile ? 2 : 1,
          access: Math.random() < probabilities.shipmentAccess ? 2 : 1,
          reserved: [1, 1, 1]
        },
        when,
        deadline: when.addn(60 * 60 * 24 * (Math.random() * 6 + 1))
      }

      await program.methods
        .createShipment(shipmentPrice, encodeName('Just a pair of socks'), shipmentData)
        .accounts({
          shipment: shipmentAddress,
          shipper: shipperAddress,
          signer: shipperSigner.publicKey
        })
        .signers([shipperSigner])
        .rpc()

      console.log('Creating shipment', shipmentData)
      break

    default:
      console.log('Unknown action', action)
      break
  }

  const newKeys = JSON.stringify(keys, null, 2)
  fs.writeFileSync('./migrations/mocks/keys.json', newKeys)
}

const chooseAction = (): string => {
  const totalWeight = probabilities.actions.reduce((acc, { weight }) => acc + weight, 0)
  const normalized = probabilities.actions.map(({ action, weight }) => ({
    action,
    weight: weight / totalWeight
  }))

  const random = Math.random()

  let sum = 0
  let result = 'none'
  for (const { action, weight } of normalized) {
    sum += weight
    if (random < sum) {
      result = action
      break
    }
  }

  return result
}

const chooseLocation = async (): Promise<any> => {
  let counter = 1000
  while (counter--) {
    try {
      const left = 2
      const right = 22
      const top = 47
      const bottom = 56

      const lat = left + Math.random() * (right - left)
      const lon = top + Math.random() * (bottom - top)

      // this will throw if location is in a weird place like a sea
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lon}&lon=${lat}&format=jsonv2`
      )
      const parsed = (await res.json()) as {
        lat: string
        lon: string
        category?: string
        address: {
          village?: string
          city?: string
          road?: string
          house_number?: string
          country?: string
        }
      }

      console.log('here')

      if (parsed.category === 'highway') {
        console.error('Not interested in roads')
        continue
      }

      if (!parsed || !parsed?.lon || !parsed?.lat) {
        console.error('Failed to get location')
        continue
      }

      if (!parsed.address.road) {
        console.error('Not an expected address format')
        continue
      }

      const parsedName = `${parsed.address.road} ${parsed.address.house_number ?? ''}, ${
        parsed.address.village ?? parsed.address.city ?? ''
      }, ${parsed.address.country}`

      return {
        ...parsed,
        parsedName,
        lon: Number(parsed?.lon),
        lat: Number(parsed?.lat),
        longitude: Number(parsed?.lon),
        latitude: Number(parsed?.lat)
      }
    } catch (error) {}
  }

  console.error('Failed to get location')
}

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const keypairFromSecret = (secret: string): Keypair => {
  return Keypair.fromSecretKey(Uint8Array.from(Buffer.from(secret, 'base64')))
}

setInterval(async () => {
  try {
    await run()
  } catch (error) {
    console.error('Failed to run', error)
  }
}, 3000)

// run()

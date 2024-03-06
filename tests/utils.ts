import { Connection, Keypair, PublicKey } from '@solana/web3.js'

export const awaitedAirdrop = async (
  connection: Connection,
  publicKey: PublicKey,
  amount: number
) => {
  const airdropSignature = await connection.requestAirdrop(publicKey, 1e9)
  let balance = await connection.getBalance(publicKey)

  const now = Date.now()

  while (balance < amount) {
    if (Date.now() - now > 3000) throw new Error('Airdrop failed')

    balance = await connection.getBalance(publicKey)
    await sleep(10)
  }
}

export const sleep = async (arg0: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, arg0)
  })
}

export const prefunded = async (connection: Connection) => {
  const keypair = Keypair.generate()
  await awaitedAirdrop(connection, keypair.publicKey, 1e9)
  return keypair
}

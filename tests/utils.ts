import { Connection, PublicKey } from '@solana/web3.js'

export async function waitFor(connection: Connection, sig: string) {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
  await connection.confirmTransaction(
    {
      signature: sig,
      blockhash,
      lastValidBlockHeight
    },
    'confirmed'
  )
}

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

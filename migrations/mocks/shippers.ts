import { Keypair } from '@solana/web3.js'

// A baker, sending bread to restaurants
export const ANDREW = Keypair.fromSecretKey(
  Uint8Array.from(
    Buffer.from(
      'RdCJqispZna8RhCb4LD2Vo8LthejTPhwu/M34+xO8qm1Afv8Mo1mhGYJj8d5sEyuqzA+WCn0PkvPrixQ9KB+1w==',
      'base64'
    )
  )
)

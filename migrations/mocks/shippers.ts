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

// An owner of Audi A5, working for courier for multiple companies
export const ROBERT = Keypair.fromSecretKey(
  Uint8Array.from(
    Buffer.from(
      'coT8N5ulqBThzrEoMRXnHnKLoT3EAGpe/LvPC74eZOY2bBBlImECtu07LsPaR2D5920YfVDQTB0yTuR9ti0n3A==',
      'base64'
    )
  )
)

// Owner of a delivery van with a tarpaulin, who rides to the market every morning
export const ZDZICH = Keypair.fromSecretKey(
  Uint8Array.from(
    Buffer.from(
      'jyxAQqdlpzv9volPCLCyqeaAIyZ+sLCKEdG7oNhFBxs2vhVKIiTqUFIZYW1peCdsxW7f5we4retmR6VZSdxe+w==',
      'base64'
    )
  )
)

// A bored student, who wants to earn some money without going out of the house
export const JACOB = Keypair.fromSecretKey(
  Uint8Array.from(
    Buffer.from(
      'uvPAJy7OCauhqZ6/hgXfDfOi+cpZm6rwzr6XIl69maAz4q5831r991FfQFSCg27+NgexcNF0odsa4rOTsFQOsw==',
      'base64'
    )
  )
)

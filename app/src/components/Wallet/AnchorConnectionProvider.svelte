<!-- <script lang="ts">
  import { Connection } from '@solana/web3.js'
  import type { Commitment, ConnectionConfig } from '@solana/web3.js'
  import { AnchorProvider, Program } from '@coral-xyz/anchor'
  import { walletStore, type WalletStore } from '$lib/stores/wallet'
  import { anchorStore } from '$lib/src/stores/anchor'
  //import { IDL } from '$src/utils/Idl/protocol'
  //import { PROGRAM_ID } from '$src/stores/protocolStateStore'

  export let network: string,
    config: Commitment | ConnectionConfig | undefined = 'processed'

  const connection = new Connection(network, config)

  function defineProgramAndProvider(walletStore: WalletStore) {
    let { signTransaction, signAllTransactions, publicKey } = walletStore

    const provider = new AnchorProvider(
      connection,
      {
        publicKey: publicKey!,
        signAllTransactions: signAllTransactions!,
        signTransaction: signTransaction!
      },
      {
        preflightCommitment: 'processed'
      }
    )

    const program = new Program(IDL, PROGRAM_ID, provider)

    anchorStore.set({
      connection,
      program,
      network
    })
  }

  $: $walletStore && $walletStore.publicKey && defineProgramAndProvider($walletStore)
</script> -->

<slot />

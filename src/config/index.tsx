import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { hashkeyTestnet } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = '1ea1abda1ecbffd1d28108656904c907'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [hashkeyTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
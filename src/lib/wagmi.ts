//src/wagmi.ts
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { baseAccount, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
  //đang hardcode mainnet + sepolia => muốn chạy trên Creditcoin testnet → cần add chain custom (dùng defineChain)
    chains: [mainnet, sepolia],
    
    //Đây là nơi bạn có thể add thêm connector (SUI, Aptos extension khi support).
    connectors: [
      injected(), //MetaMask, Brave, Rabby
      baseAccount(), //connector riêng cho Base ecosystem (nếu bạn không cần có thể bỏ).
      walletConnect({ projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID! }), //cần WalletConnect ProjectId từ cloud.walletconnect.com.
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true, //Quan trọng khi dùng App Router + Server Components.
    transports: { //với Creditcoin → bạn phải truyền RPC URL custom (VD: "https://rpc.testnet.creditcoin.network").
      [mainnet.id]: http(),
      [sepolia.id]: http(), 
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
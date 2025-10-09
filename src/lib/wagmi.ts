import { defineChain } from "viem";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

export const creditcoinTestnet = defineChain({
  id: 102031,
  name: "Creditcoin Testnet",
  nativeCurrency: { name: "Creditcoin", symbol: "tCTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.cc3-testnet.creditcoin.network/"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://creditcoin-testnet.blockscout.com",
    },
  },
  testnet: true,
});

export function getConfig() {
  return createConfig({
    chains: [creditcoinTestnet],
    connectors: [
      injected(),
      ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
        ? [walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! })]
        : []),
    ],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    transports: {
      [creditcoinTestnet.id]: http(
        "https://rpc.cc3-testnet.creditcoin.network/"
      ),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

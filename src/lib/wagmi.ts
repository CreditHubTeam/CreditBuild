import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { creditcoinTestnet } from "./chains";

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

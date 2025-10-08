"use client";
import { creditcoinTestnet } from "@/lib/wagmi";
import { useAccount, useBalance, useChainId, useConnections } from "wagmi";

export default function ConnectionPanel() {
  const chainId = useChainId();
  const account = useAccount();
  const connections = useConnections();

  const currentConnection = connections[0]; // Connection đầu tiên (active)
  let walletName = currentConnection?.connector?.name ?? "Not Connected";
  if (walletName.toLowerCase() === "injected") {
    walletName = "MetaMask"; //== mặc định injected là Metamask
  }

  const networkText =
    creditcoinTestnet.id === chainId ? creditcoinTestnet.name : "Wrong Network";

  const balanceOfUser  = useBalance({
    address: account.address,
  })

  return (
    <div className="pixel-card p-4 bg-mc-blue mb-5">
      <div className="grid gap-2 text-[12px]">
        <div className="flex justify-between">
          <span>Wallet:</span>
          <span>{walletName}</span>
        </div>
        <div className="flex justify-between">
          <span>Network:</span>
          <span>{networkText}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance:</span>
          <span>{balanceOfUser.data?.formatted ?? "0.00"} {balanceOfUser.data?.symbol}</span>
        </div>
      </div>
    </div>
  );
}

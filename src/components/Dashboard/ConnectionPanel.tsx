"use client";
import { useApp } from "@/context/AppContext";

export default function ConnectionPanel() {
  const { currentWalletType, currentChainId, network } = useApp();
  const networkText =
    currentChainId === network.chainId ? network.chainName : "Wrong Network";
  return (
    <div className="pixel-card p-4 bg-mc-blue mb-5">
      <div className="grid gap-2 text-[12px]">
        <div className="flex justify-between">
          <span>Wallet:</span>
          <span>{currentWalletType ?? "Not Connected"}</span>
        </div>
        <div className="flex justify-between">
          <span>Network:</span>
          <span>{networkText}</span>
        </div>
        <div className="flex justify-between">
          <span>Balance:</span>
          <span>--</span>
        </div>
      </div>
    </div>
  );
}

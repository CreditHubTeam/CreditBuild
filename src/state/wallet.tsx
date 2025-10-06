"use client";
import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { creditcoinTestnet } from "@/lib/wagmi";
import { useUI } from "./ui";

type WalletCtx = {
  address?: `0x${string}`;
  isConnected: boolean;
  chainId: number | null;
  networkOk: boolean;
  connectors: ReturnType<typeof useConnect>["connectors"];
  connect: ReturnType<typeof useConnect>["connectAsync"];
  disconnect: ReturnType<typeof useDisconnect>["disconnect"];
  ensureCreditcoin: () => Promise<void>;
};

const WalletContext = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { showLoading, hideLoading, notify, close } = useUI();

  const networkOk = chainId === creditcoinTestnet.id;

  const ensureCreditcoin = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window === "undefined" || !(window as any).ethereum) {
      notify("No injected wallet found", "warning");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (window as any).ethereum;
    const hexId = "0x" + creditcoinTestnet.id.toString(16);

    showLoading("Switching network...");
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId }],
      });
      hideLoading();
      notify("Switched to Creditcoin Testnet ⛓️", "success");
      close();
    } catch {
      // add chain then switch
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexId,
              chainName: creditcoinTestnet.name,
              nativeCurrency: creditcoinTestnet.nativeCurrency,
              rpcUrls: creditcoinTestnet.rpcUrls.default.http,
              blockExplorerUrls: [
                creditcoinTestnet.blockExplorers!.default!.url,
              ],
            },
          ],
        });
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexId }],
        });
        hideLoading();
        notify("Creditcoin Testnet added & switched ✅", "success");
        close();
      } catch {
        hideLoading();
        notify("Network switch rejected", "error");
      }
    }
  }, [showLoading, hideLoading, notify, close]);

  const value = useMemo<WalletCtx>(
    () => ({
      address: address as `0x${string}` | undefined,
      isConnected,
      chainId: chainId || null,
      networkOk,
      connectors,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connect: connectAsync as any,
      disconnect,
      ensureCreditcoin,
    }),
    [
      address,
      isConnected,
      chainId,
      networkOk,
      connectors,
      connectAsync,
      disconnect,
      ensureCreditcoin,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider>");
  return ctx;
};

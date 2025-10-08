"use client";
import { creditcoinTestnet } from "@/lib/wagmi";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
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

/** Format address: 0x1234...abcd */
export function formatAddress(address?: string) {
  if (!address) return "";
  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

const WalletContext = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { showLoading, hideLoading, notify, close } = useUI();
  
  const router = useRouter();
  const pathname = usePathname();

  const networkOk = chainId === creditcoinTestnet.id;

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/education', '/progress', '/achievements'];
    const isProtectedRoute = protectedRoutes.includes(pathname);
    
    if (!isConnected && isProtectedRoute) {
      console.log("🔄 Wallet disconnected - redirecting to home");
      notify("Wallet disconnected. Redirecting to home...", "info");
      router.push("/");
    }
  }, [isConnected, pathname, router, notify]);

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

  const handleDisconnect = useCallback(() => {
    console.log("🔌 Disconnecting wallet...");
    disconnect();
    
    close(); // Close any open modals
    
    setTimeout(() => {
      router.push("/");
    }, 100);
  }, [disconnect, close, router]);

  const value = useMemo<WalletCtx>(
    () => ({
      address: address as `0x${string}` | undefined,
      isConnected,
      chainId: chainId || null,
      networkOk,
      connectors,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connect: connectAsync as any,
      disconnect: handleDisconnect,
      ensureCreditcoin,
    }),
    [
      address,
      isConnected,
      chainId,
      networkOk,
      connectors,
      connectAsync,
      handleDisconnect,
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

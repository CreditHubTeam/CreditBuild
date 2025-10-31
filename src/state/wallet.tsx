"use client";
import { creditcoinTestnet } from "@/lib/chains";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
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
  const [realChainId, setRealChainId] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { notify, close, open } = useUI();

  // ✅ More robust chain detection
  useEffect(() => {
    let isMounted = true;

    const validateChainId = async () => {
      if (!isConnected || !window.ethereum) {
        if (isMounted) setRealChainId(null);
        return;
      }

      setIsValidating(true);

      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chainIdDecimal = parseInt(chainId, 16);

        console.log("=== CHAIN VALIDATION ===");
        console.log("Retrieved chainId:", chainIdDecimal);
        console.log("Is Base Sepolia (84532):", chainIdDecimal === 84532);
        console.log("Is Creditcoin (102031):", chainIdDecimal === 102031);

        if (isMounted) {
          setRealChainId(chainIdDecimal);
        }
      } catch (error) {
        console.error("Chain validation failed:", error);
        if (isMounted) setRealChainId(null);
      } finally {
        if (isMounted) setIsValidating(false);
      }
    };

    validateChainId();

    // Chain change listener
    const handleChainChanged = (newChainId: string) => {
      if (isMounted) {
        const chainIdDecimal = parseInt(newChainId, 16);
        console.log("🔄 Chain changed to:", chainIdDecimal);
        setRealChainId(chainIdDecimal);
      }
    };

    if (window.ethereum && isConnected) {
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        isMounted = false;
        window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [isConnected]);

  const chainId = realChainId;
  const networkOk = chainId === creditcoinTestnet.id && !isValidating;

  // console.log("=== FINAL STATE ===");
  // console.log("chainId:", chainId);
  // console.log("networkOk:", networkOk);
  // console.log("isValidating:", isValidating);

  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const router = useRouter();
  const pathname = usePathname();

  // Enhanced effect để handle network mismatch
  useEffect(() => {
    // ✅ Debounce để đợi state sync
    const checkNetworkStatus = setTimeout(() => {
      const protectedRoutes = [
        "/dashboard",
        "/education",
        "/progress",
        "/achievements",
      ];
      const isProtectedRoute = protectedRoutes.includes(pathname);

      if (!isConnected && isProtectedRoute) {
        console.log("🔄 Wallet disconnected - redirecting to home");
        notify("Wallet disconnected. Redirecting to home...", "info");
        router.push("/");
        return;
      }

      // ✅ Chỉ log nếu thực sự wrong network
      if (isConnected && isProtectedRoute && chainId !== null && !networkOk) {
        // console.log("=== NETWORK CHECK DEBUG ===");
        // console.log("chainId:", chainId);
        // console.log("creditcoinTestnet.id:", creditcoinTestnet.id);
        // console.log("networkOk:", networkOk);
        // console.log("isProtectedRoute:", isProtectedRoute);
        // console.log("pathname:", pathname);

        console.log("⚠️ Wrong network detected on protected route");
        notify("Please switch to Creditcoin Testnet to continue!", "warning");
      }
    }, 100); // ✅ Delay 100ms để đợi chainChanged complete

    return () => clearTimeout(checkNetworkStatus);
  }, [isConnected, networkOk, chainId, pathname, router, notify]);

  // Thêm vào useEffect kiểm tra network sau connect
  useEffect(() => {
    // ✅ Check network ngay sau khi connect
    if (isConnected && chainId !== null) {
      const protectedRoutes = [
        "/dashboard",
        "/education",
        "/progress",
        "/achievements",
      ];
      const isProtectedRoute = protectedRoutes.includes(pathname);

      // console.log("=== POST-CONNECTION CHECK ===");
      // console.log("isConnected:", isConnected);
      // console.log("chainId:", chainId);
      // console.log("networkOk:", networkOk);
      // console.log("pathname:", pathname);

      // ✅ Nếu đăng nhập thành công nhưng sai network
      if (isConnected && !networkOk && pathname === "/") {
        console.log("🚨 Connected but wrong network - showing switch modal");
        notify(
          "Wrong network detected! Please switch to Creditcoin Testnet.",
          "warning"
        );

        // ✅ Auto show network switch modal
        setTimeout(() => {
          open("networkSwitch");
        }, 500);
      }

      // ✅ Nếu đang ở protected route mà sai network
      if (isConnected && isProtectedRoute && !networkOk) {
        console.log("⚠️ Wrong network on protected route");
        notify("Please switch to Creditcoin Testnet to continue!", "warning");
      }
    }
  }, [isConnected, chainId, networkOk, pathname, notify, open]);

  const ensureCreditcoin = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window === "undefined" || !(window as any).ethereum) {
      notify("No injected wallet found", "warning");
      return;
    }

    // Show network switch modal
    open("networkSwitch");
  }, [open, notify]);

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

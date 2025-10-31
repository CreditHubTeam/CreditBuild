"use client";
import { useUI } from "@/state/ui";
import { WalletProvider } from "@/lib/types";
import { creditcoinTestnet } from "@/lib/chains";
import { useEffect } from "react";
import { useAccount, useChainId, useConnect } from "wagmi";
import PixelModal from "./PixelModal";

export default function WalletSelectionModal() {
  const { modal, close, open: openModal, notify } = useUI();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Check available wallets
  const hasMetaMask =
    typeof window !== "undefined" &&
    window.ethereum &&
    (window.ethereum.isMetaMask || false);
  const hasSubWallet =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).SubWallet || (window.ethereum as any)?.isSubWallet);
  const hasCoinbase =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.ethereum as any)?.isCoinbaseWallet;

  // Hardcoded available wallets
  const walletProviders: WalletProvider[] = [
    {
      name: "MetaMask",
      id: "io.metamask",
      icon: "🦊",
      description: "Most popular Ethereum wallet",
      downloadUrl: "https://metamask.io",
      available: hasMetaMask,
    },
    {
      name: "Coinbase Wallet",
      id: "coinbaseWalletSDK",
      icon: "🔵",
      description: "User-friendly wallet by Coinbase",
      downloadUrl: "https://wallet.coinbase.com",
      available:
        hasCoinbase || connectors.some((c) => c.id === "coinbaseWalletSDK"),
    },
    {
      name: "WalletConnect",
      id: "walletConnect",
      icon: "🔗",
      description: "Connect with mobile wallets",
      downloadUrl: "https://walletconnect.com",
      available: connectors.some((c) => c.id === "walletConnect"),
    },
    {
      name: "Sub Wallet",
      id: "injected", // Sub Wallet uses injected connector
      icon: "🦀",
      description: "Multi-chain wallet for Polkadot",
      downloadUrl: "https://subwallet.app",
      available: hasSubWallet,
    },
  ];

  const availableWallets = walletProviders;

  // Auto close modal and check network when wallet connects
  useEffect(() => {
    if (isConnected && modal === "walletSelection") {
      close();

      // Kiểm tra network sau khi connect
      if (chainId !== creditcoinTestnet.id) {
        setTimeout(() => {
          notify("Please switch to Creditcoin Testnet to continue!", "warning");
          openModal("networkSwitch");
        }, 500);
      } else {
        notify("Connected to Creditcoin Testnet! 🎉", "success");
      }
    }
  }, [isConnected, modal, close, chainId, openModal, notify]);

  const handleWalletClick = async (wallet: WalletProvider) => {
    if (wallet.available) {
      try {
        console.log("🔗 Connecting to:", wallet.name);

        // Find the appropriate connector
        let connector;

        if (
          wallet.name === "Sub Wallet" ||
          wallet.name === "MetaMask" ||
          wallet.name === "Coinbase Wallet"
        ) {
          // For injected wallets, use the injected connector
          connector = connectors.find((c) => c.id === "injected");
        } else {
          // For other wallets (WalletConnect), use exact ID match
          connector = connectors.find((c) => c.id === wallet.id);
        }

        if (connector) {
          await connect({ connector });
          // useEffect sẽ handle network check
        } else {
          notify(
            `${wallet.name} connector not found. Please install the wallet first.`,
            "warning"
          );
        }
      } catch (error) {
        console.error("Connection error:", error);
        notify("Failed to connect wallet. Please try again.", "error");
      }
    } else {
      window.open(wallet.downloadUrl, "_blank");
    }
  };

  return (
    <PixelModal
      open={modal === "walletSelection"}
      title="Connect Your Wallet"
      onClose={close}
    >
      <div className="grid gap-3">
        {availableWallets.map((w) => (
          <button
            key={w.id}
            onClick={() => handleWalletClick(w)}
            className={`pixel-card p-2 sm:p-3 flex items-center gap-2 sm:gap-3 min-w-0 ${
              w.available ? "" : "opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="text-lg sm:text-2xl bg-mc-gold px-2 sm:px-3 py-1 sm:py-2 border-2 border-mc-darkbrown rounded-pixel flex-shrink-0">
              {w.icon}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold truncate">
                {w.name}
              </div>
              <div className="text-[8px] sm:text-[10px] opacity-80 line-clamp-2 sm:line-clamp-none">
                {w.description}
              </div>
            </div>
            <div
              className={`text-[8px] sm:text-[10px] px-1 sm:px-2 py-1 rounded flex-shrink-0 ${
                w.available ? "bg-mc-green text-white" : "bg-mc-red text-white"
              }`}
            >
              <span className="hidden sm:inline">
                {w.available ? "Available" : "Install"}
              </span>
              <span className="sm:hidden">{w.available ? "✓" : "↓"}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] opacity-80 mt-3">
        Don&apos;t have a wallet?{" "}
        <a className="underline" href="https://metamask.io" target="_blank">
          Download MetaMask
        </a>
      </p>
    </PixelModal>
  );
}

"use client";
import { useApp } from "@/context/AppContext";
import { WalletProvider } from "@/lib/types";
import { creditcoinTestnet } from "@/lib/wagmi";
import { useEffect } from "react";
import { useAccount, useChainId, useConnect } from "wagmi";
import PixelModal from "./PixelModal";

export default function WalletSelectionModal() {
  const { openModal, closeModals, availableWallets, detectWallets, showModal, showNotification } = useApp();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Auto close modal and check network when wallet connects
  useEffect(() => {
    if (isConnected && openModal === "walletSelectionModal") {
      console.log("✅ Wallet connected - checking network...");
      console.log("Current chainId:", chainId);
      console.log("Expected chainId:", creditcoinTestnet.id);
      closeModals();
      
      // Kiểm tra network sau khi connect
      if (chainId !== creditcoinTestnet.id) {
        setTimeout(() => {
          showNotification(
            "Please switch to Creditcoin Testnet to continue!",
            "warning"
          );
          showModal("networkSwitchModal");
        }, 500);
      } else {
        showNotification("Connected to Creditcoin Testnet! 🎉", "success");
      }
    }
  }, [isConnected, openModal, closeModals, chainId, showModal, showNotification]);

  useEffect(() => {
    if (openModal === "walletSelectionModal") {
      detectWallets();
    }
  }, [openModal, detectWallets]);

  const handleWalletClick = async (wallet: WalletProvider) => {
    if (wallet.available) {
      try {
        console.log("🔗 Connecting to:", wallet.name);
        const connector = connectors.find((c) => c.id === wallet.id);
        if (connector) {
          await connect({ connector });
          // useEffect sẽ handle network check
        }
      } catch (error) {
        console.error("Connection error:", error);
        showNotification("Failed to connect wallet. Please try again.", "error");
      }
    } else {
      window.open(wallet.downloadUrl, "_blank");
    }
  };

  return (
    <PixelModal
      open={openModal === "walletSelectionModal"}
      title="Connect Your Wallet"
      onClose={closeModals}
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

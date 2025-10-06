"use client";
import { useApp } from "@/context/AppContext";
import { WalletProvider } from "@/lib/types";
import { useEffect } from "react";
import { useConnect } from "wagmi";
import PixelModal from "./PixelModal";

export default function WalletSelectionModal() {
  const { openModal, closeModals, availableWallets, detectWallets } = useApp();
  const { connectors, connect, status, error } = useConnect();

  // console.log("Connectors:", connectors);

  //============================DUYET QUA CAC WALLET==================
  //duyet qua tat ca cac walletProviders trong appData de tao danh sach wallet hien thi
  // const conntectorWallets = appData.walletProviders.map((wallet) => {
  //   if (connectors.find((connector) => connector.id === wallet.id)) {
  //     //neu trong connectors co cac wallet do => doi thanh available = true
  //     wallet.available = true;
  //   }
  //   return wallet;
  // });
  // availableWallets = conntectorWallets;

    useEffect(() => {
      if (openModal === "walletSelectionModal") {
        detectWallets();
      }
    }, [openModal, detectWallets]);

  //=========================KET NOI VOI WALLET======================
  const handleWalletClick = async (wallet: WalletProvider) => {
    if (wallet.available) {
      await connect({ connector: connectors.find((c) => c.id === wallet.id)! });
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
            onClick={() =>
              w.available
                ? handleWalletClick(w)
                : window.open(w.downloadUrl, "_blank")
            }
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

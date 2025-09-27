"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function WalletSelectionModal() {
  const { openModal, closeModals, availableWallets, connectToWallet } =
    useApp();
  return (
    <PixelModal
      open={openModal === "walletSelectionModal"}
      title="Connect Your Wallet"
      onClose={closeModals}
    >
      <div className="grid gap-3">
        {availableWallets.map((w) => (
          <button
            key={w.type}
            onClick={() =>
              w.available
                ? connectToWallet(w)
                : window.open(w.downloadUrl, "_blank")
            }
            className={`pixel-card p-3 flex items-center gap-3 ${
              w.available ? "" : "opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="text-2xl bg-mc-gold px-3 py-2 border-2 border-mc-darkbrown rounded-pixel">
              {w.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold">{w.name}</div>
              <div className="text-[10px] opacity-80">{w.description}</div>
            </div>
            <div
              className={`text-[10px] px-2 py-1 rounded ${
                w.available ? "bg-mc-green text-white" : "bg-mc-red text-white"
              }`}
            >
              {w.available ? "Available" : "Install"}
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

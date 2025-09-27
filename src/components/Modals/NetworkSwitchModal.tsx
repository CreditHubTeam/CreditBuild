"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function NetworkSwitchModal() {
  const { openModal, closeModals, network, switchToCorrectNetwork } = useApp();
  return (
    <PixelModal
      open={openModal === "networkSwitchModal"}
      title="Switch Network"
      onClose={closeModals}
    >
      <div className="text-center">
        <h3 className="text-sm text-mc-darkbrown mb-4">
          Connect to {network.chainName}
        </h3>
        <p className="text-[10px] opacity-80 mb-4">
          This app requires connection to the Creditcoin Testnet. Click below to
          switch networks.
        </p>
        <div className="bg-mc-stone border-2 border-mc-darkstone p-4 text-left text-[10px]">
          <div className="flex justify-between mb-2">
            <span className="opacity-80">Network:</span>
            <span className="font-bold text-white">{network.chainName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="opacity-80">Chain ID:</span>
            <span className="font-bold text-white">
              {network.chainIdDecimal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">RPC URL:</span>
            <span className="font-bold text-white">{network.rpcUrl}</span>
          </div>
        </div>
        <button
          onClick={switchToCorrectNetwork}
          className="pixel-btn pixel-btn--primary w-full mt-4"
        >
          Switch to Creditcoin Testnet
        </button>
      </div>
    </PixelModal>
  );
}

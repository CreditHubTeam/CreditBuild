"use client";
import { creditcoinTestnet } from "@/lib/chains";
import { useUI } from "@/state/ui";
import { useSwitchChain } from "wagmi";
import PixelModal from "@/components/Modals/PixelModal";

export default function NetworkSwitchModal() {
  const { modal, close, notify } = useUI();

  const {
    switchChain,
    isPending: isSwitching,
    error: switchError,
  } = useSwitchChain();

  const handleSwitchNetwork = async () => {
    try {
      console.log("🔄 Attempting to switch to Creditcoin Testnet");
      await switchChain({ chainId: creditcoinTestnet.id });

      notify("Switched to Creditcoin Testnet ⛓️", "success");
      close();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("❌ Switch failed:", error);

      // Khi ví chưa có chain, Wagmi sẽ tự động gọi wallet_addEthereumChain,
      // nên nếu user từ chối hoặc có lỗi RPC -> chỉ cần xử lý notify
      if (error?.message?.includes("rejected")) {
        notify("Network switch cancelled by user", "warning");
      } else {
        notify("Failed to switch network", "error");
      }
    }
  };

  return (
    <PixelModal
      open={modal === "networkSwitch"}
      title="Switch Network"
      onClose={close}
    >
      <div className="text-center">
        <h3 className="text-lg mb-4">⚠️ Wrong Network</h3>
        <p className="text-sm mb-4">
          You&apos;re connected but on the wrong network.
          <br />
          Please switch to <strong>Creditcoin Testnet</strong> to continue.
        </p>

        <div className="bg-mc-stone border-2 border-mc-darkstone p-4 text-left text-[10px] mb-4">
          <div className="flex justify-between mb-2">
            <span className="opacity-80">Network:</span>
            <span className="font-bold text-white">
              {creditcoinTestnet.name}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="opacity-80">Chain ID:</span>
            <span className="font-bold text-white">{creditcoinTestnet.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">RPC URL:</span>
            <span className="font-bold text-white text-xs">
              {creditcoinTestnet.rpcUrls.default.http[0]}
            </span>
          </div>
        </div>

        {switchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{switchError.message}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="pixel-btn pixel-btn--primary"
          >
            {isSwitching ? "Switching..." : "Switch to Creditcoin Testnet"}
          </button>

          <button
            onClick={close}
            disabled={isSwitching}
            className="pixel-btn pixel-btn--secondary"
          >
            Cancel
          </button>
        </div>

        {isSwitching && (
          <div className="mt-4 text-xs opacity-60">🔄 Switching network...</div>
        )}
      </div>
    </PixelModal>
  );
}

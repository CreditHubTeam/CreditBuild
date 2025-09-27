"use client";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const {
    isWalletConnected,
    currentUser,
    currentChainId,
    network,
    connectToWallet,
    disconnectWallet,
    showModal,
    availableWallets,
  } = useApp();

  const networkOk = currentChainId === network.chainId;

  return (
    <header className="w-full bg-mc-brown border-b-4 border-mc-darkbrown shadow-pixel sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-mc-gold text-mc-darkbrown px-4 py-2 border-3 border-mc-darkbrown pixel-inset font-bold text-[10px]">
            ⛏️ CREDITCOIN
          </div>
          <h1 className="text-white text-base drop-shadow">CreditBuild</h1>
        </div>

        <div className="flex items-center gap-3">
          {!isWalletConnected ? (
            <button
              onClick={() => {
                if (availableWallets.filter((w) => w.available).length <= 1) {
                  const first =
                    availableWallets.find((w) => w.available) ??
                    availableWallets[0];
                  if (first) connectToWallet(first);
                } else {
                  // nhiều ví => mở modal chọn ví
                  showModal("walletSelectionModal");
                }
              }}
              className="pixel-btn pixel-btn--primary"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="bg-mc-darkstone text-white px-2 py-1 border-2 border-black text-[10px]">
                  {currentUser.address}
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span
                    className={`animate-pulse2 ${
                      networkOk ? "text-mc-green" : "text-mc-red"
                    }`}
                  >
                    {networkOk ? "🟢" : "🔴"}
                  </span>
                  <span>{networkOk ? network.chainName : "Wrong Network"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!networkOk && (
                  <button
                    onClick={() => showModal("networkSwitchModal")}
                    className="pixel-btn pixel-btn--secondary text-[10px]"
                  >
                    Switch Network
                  </button>
                )}
                <button
                  onClick={disconnectWallet}
                  className="pixel-btn pixel-btn--secondary text-[10px]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

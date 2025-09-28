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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="bg-mc-gold text-mc-darkbrown px-2 sm:px-4 py-1 sm:py-2 border-3 border-mc-darkbrown pixel-inset font-bold text-[8px] sm:text-[10px] whitespace-nowrap">
            <span className="hidden sm:inline">⛏️ CREDITCOIN</span>
            <span className="sm:hidden">⛏️ CC</span>
          </div>
          <h1 className="text-white text-sm sm:text-base drop-shadow truncate">
            CreditBuild
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
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
              className="pixel-btn pixel-btn--primary text-[8px] sm:text-[12px] px-2 sm:px-4 py-1 sm:py-2"
            >
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1 sm:gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="bg-mc-darkstone text-white px-1 sm:px-2 py-1 border-2 border-black text-[8px] sm:text-[10px] max-w-[100px] sm:max-w-none truncate">
                  <span className="hidden sm:inline">
                    {currentUser.address}
                  </span>
                  <span className="sm:hidden">{`${currentUser.address.slice(
                    0,
                    6
                  )}...${currentUser.address.slice(-4)}`}</span>
                </span>
                <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                  <span
                    className={`animate-pulse2 text-xs ${
                      networkOk ? "text-mc-green" : "text-mc-red"
                    }`}
                  >
                    {networkOk ? "🟢" : "🔴"}
                  </span>
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {networkOk ? network.chainName : "Wrong Network"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2">
                {!networkOk && (
                  <button
                    onClick={() => showModal("networkSwitchModal")}
                    className="pixel-btn pixel-btn--secondary text-[7px] sm:text-[10px] px-1 sm:px-2 py-1"
                  >
                    <span className="hidden sm:inline">Switch Network</span>
                    <span className="sm:hidden">Switch</span>
                  </button>
                )}
                <button
                  onClick={disconnectWallet}
                  className="pixel-btn pixel-btn--secondary text-[7px] sm:text-[10px] px-1 sm:px-2 py-1"
                >
                  <span className="hidden sm:inline">Disconnect</span>
                  <span className="sm:hidden">❌</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

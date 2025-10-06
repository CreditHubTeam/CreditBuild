"use client";
import { useWallet } from "@/state/wallet";
import { useUI } from "@/state/ui";

export default function Header() {
  const {
    address,
    isConnected,
    networkOk,
    connectors,
    connect,
    disconnect,
    ensureCreditcoin,
  } = useWallet();
  const { notify } = useUI();

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
          {!isConnected ? (
            <button
              onClick={async () => {
                const injected =
                  connectors.find((c) => c.id === "injected") ?? connectors[0];
                if (!injected)
                  return notify("No wallet connector found", "warning");
                try {
                  await connect({ connector: injected });
                } catch (error) {
                  notify("Connection failed", "error");
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
                  <span className="hidden sm:inline">{address}</span>
                  <span className="sm:hidden">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span
                    className={`text-xs ${
                      networkOk ? "text-mc-green" : "text-mc-red"
                    }`}
                  >
                    {networkOk ? "🟢" : "🔴"}
                  </span>
                  <span>
                    {networkOk ? "Creditcoin Testnet" : "Wrong Network"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!networkOk && (
                  <button
                    onClick={ensureCreditcoin}
                    className="pixel-btn pixel-btn--secondary text-[10px] px-2 py-1"
                  >
                    Switch Network
                  </button>
                )}
                <button
                  onClick={() => disconnect()}
                  className="pixel-btn pixel-btn--secondary text-[10px] px-2 py-1"
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

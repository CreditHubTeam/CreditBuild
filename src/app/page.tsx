"use client";
import { useUI } from "@/state/ui";
import { useWallet } from "@/state/wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

//==appContext chưa tách
import { useApp } from "@/context/AppContext";

export default function LandingPage() {
  const { isConnected, networkOk, connectors, connect, ensureCreditcoin } =
    useWallet();
  const { notify } = useUI();
  const {showModal, closeModals} = useApp();
  
  const router = useRouter();

  // Auto redirect to dashboard if wallet is connected and network is correct
  useEffect(() => {
    if (isConnected && networkOk) {
      router.push("/dashboard");
    }
  }, [isConnected, networkOk, router]);

  const handleGetStarted = async () => {
    if (!isConnected) {
      showModal("walletSelectionModal");
    } else if (!networkOk) {
      // Switch network
      await ensureCreditcoin();
    } else {
      // Go to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="pixel-card p-8">
        <h1 className="text-2xl mb-3">
          Build Your Credit Score Like in Minecraft!
        </h1>
        <p className="opacity-90 mb-4">
          Complete daily challenges, earn achievements, and level up your
          financial life!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
            🎯<div className="text-[10px]">Daily Challenges</div>
          </div>
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
            🏆<div className="text-[10px]">Achievements</div>
          </div>
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
            📈<div className="text-[10px]">Track Progress</div>
          </div>
        </div>
        <button
          className="pixel-btn pixel-btn--primary w-full md:w-auto"
          onClick={handleGetStarted}
        >
          {isConnected
            ? networkOk
              ? "Continue"
              : "Switch Network"
            : "Get Started"}
        </button>
      </div>
    </section>
  );
}

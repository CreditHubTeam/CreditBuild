"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isWalletConnected, handleGetStarted } = useApp();
  const router = useRouter();

  // Auto redirect to dashboard if wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      router.push("/dashboard");
    }
  }, [isWalletConnected, router]);

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
          {isWalletConnected ? "Continue" : "Get Started"}
        </button>
      </div>
    </section>
  );
}

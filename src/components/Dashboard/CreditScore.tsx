"use client";
import { useApp } from "@/context/AppContext";
import { useData } from "@/state/data";

export default function CreditScore() {
  // const { creditPercentage } = useApp();

  const { currentUser, creditPercentage } = useData();

  return (
    <div className="pixel-card p-5 mb-5">
      <h2 className="text-xl mb-4">Your Credit Score</h2>
      <div className="grid gap-3">
        <div className="w-full h-6 bg-mc-lightstone border-3 border-black rounded-pixel overflow-hidden">
          <div
            className="h-full bg-mc-green"
            style={{ width: `${creditPercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentUser?.creditScore || 0}</span>
          <span className="opacity-80">/850</span>
        </div>
        <div>
          <span className="mr-2">🔥 Streak:</span>
          <span>{currentUser?.streakDays} days</span>
        </div>
      </div>
    </div>
  );
}

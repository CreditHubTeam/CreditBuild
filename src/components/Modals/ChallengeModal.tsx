"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";
import { useState } from "react";

export default function ChallengeModal() {
  const { openModal, closeModals, currentChallenge, completeChallenge } =
    useApp();
  const [amount, setAmount] = useState<number>(0);
  if (!currentChallenge) return null;

  return (
    <PixelModal
      open={openModal === "challengeModal"}
      title={currentChallenge.name}
      onClose={closeModals}
    >
      <p className="mb-3 text-[12px]">{currentChallenge.description}</p>
      <div className="flex gap-3 text-[11px] mb-3">
        <span className="pixel-badge bg-mc-green text-white">
          💰 {currentChallenge.points} Points
        </span>
        <span className="pixel-badge bg-mc-blue text-white">
          📈 +{currentChallenge.creditImpact} Credit
        </span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          completeChallenge(Number(amount));
        }}
      >
        <label className="text-[10px]">Amount ($):</label>
        <input
          type="number"
          className="w-full text-black p-2 border-2 border-black rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
        <button className="pixel-btn pixel-btn--primary w-full">
          Complete Challenge
        </button>
      </form>
    </PixelModal>
  );
}

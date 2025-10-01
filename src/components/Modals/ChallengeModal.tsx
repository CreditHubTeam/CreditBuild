"use client";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import PixelModal from "./PixelModal";

export default function ChallengeModal() {
  const { openModal, closeModals, currentChallenge, completeChallenge, showNotification } =
    useApp();
  const [amount, setAmount] = useState<string>(""); // Đổi thành string và empty
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

          // kiem tra amount la so duong
          const value = Number(amount);
          if(value <= 0 || isNaN(value) || amount === ""){
            // console.log("Showing notification"); // Debug
            showNotification('Please enter a valid amount', 'warning');
            return;
          }
          
          completeChallenge(value);
        }}
      >
        <label className="text-[10px]">Amount ($):</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full text-black p-2 border-2 border-black rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button className="pixel-btn pixel-btn--primary w-full">
          Complete Challenge
        </button>
      </form>
    </PixelModal>
  );
}

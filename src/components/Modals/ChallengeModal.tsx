"use client";
import { useState } from "react";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";
import Modal from "@/ui/Modal";

export default function ChallengeModal() {
  const { modal, close } = useUI();
  const { submitChallenge } = useData();
  const [amount, setAmount] = useState<string>("");

  if (modal !== "challenge") return null;

  return (
    <Modal title="Complete Challenge" onClose={close}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const value = Number(amount);
          if (value <= 0 || isNaN(value) || amount === "") {
            return;
          }
          try {
            await submitChallenge(1, {
              amount: value
            });
            close();
          } catch (error) {
            // Error already handled in data context
          }
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
    </Modal>
  );
}

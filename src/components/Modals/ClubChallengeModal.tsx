"use client";
import { useState } from "react";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";
import Modal from "@/ui/Modal";
import { Challenge } from "@/lib/types";

export default function ChallengeModal() {
  const { modal, close, modalData } = useUI();
  const { submitClubChallenge } = useData();
  const [amount, setAmount] = useState<string>("");

  const challenge = modalData as Challenge | null;

  if (modal !== "clubChallenge") return null;

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
            console.log(challenge, value);
            //             {
            //     "id": "e4c634d9-8c9a-4f57-99a5-160bda74677f",
            //     "type": "club",
            //     "category": "Technical",
            //     "name": "demo chall",
            //     "description": "chall desc",
            //     "points": 12,
            //     "creditImpact": 2,
            //     "isCompleted": false,
            //     "estimatedTimeMinutes": 10
            // }
            // await submitClubChallenge(
            //   challenge?.clubId as string,
            //   challenge?.id as string,
            //   {
            //     amount: value,
            //     // proof?: proofCompleteChallenge;
            //   }
            // );
            close();
          } catch {
            // Error already handled in data context
          }
        }}
      >
        <label className="text-[10px]">Amount ($):</label>
        <input
          type="number"
          placeholder="Enter amount in club challenge"
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

"use client";
import { useState } from "react";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";
import Modal from "@/ui/Modal";

export default function FanClubsModal() {
  const { modal, close } = useUI();
  const { submitChallenge } = useData();
  const [amount, setAmount] = useState<string>("");

  if (modal !== "fanClubs") return null;

  async function handleJoin() {
    const value = Number(amount) || 100; // ví dụ giá 100 MOCA
    await submitChallenge(1, {
      amount: value,
      proof: { type: "number", value },
    });
    close();
  }

  return (
    <Modal title="Join Fan Club" onClose={close}>
      <div className="bg-[#f6dca3] border-[3px] border-black rounded-[6px] p-3 sm:p-4 md:p-6 pixel-font text-black">
        {/* HEADER */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#61dafb] border-[3px] border-black rounded-[4px] font-bold text-sm sm:text-base">
            CT
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-1">
              Crypto Titan <span className="text-blue-600">✓</span>
            </h2>
            <p className="text-sm sm:text-base">DeFi Trading</p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              Learn advanced DeFi strategies from a seasoned crypto investor
              with 5+ years experience.
            </p>
          </div>
        </div>

        {/* TIERS */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3">
            Membership Tiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              { tier: "Bronze", req: "0+ pts", desc: "Basic access" },
              { tier: "Silver", req: "1000+ pts", desc: "Weekly calls" },
              { tier: "Gold", req: "5000+ pts", desc: "Private signals" },
              { tier: "Platinum", req: "15000+ pts", desc: "1-on-1 sessions" },
            ].map((t) => (
              <div
                key={t.tier}
                className="bg-[#ffeeb0] border-[3px] border-black rounded-[4px] p-2 sm:p-3 shadow-[3px_3px_0_#000]"
              >
                <h4 className="font-bold text-sm sm:text-base">{t.tier}</h4>
                <p className="text-xs sm:text-sm">{t.req}</p>
                <p className="text-xs sm:text-sm text-gray-800">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3">
            Club Statistics
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center bg-[#ffeeb0] border-[3px] border-black rounded-[4px] p-2 sm:p-3">
            <div>
              <div className="text-sm sm:text-base md:text-lg font-bold">
                2,847/5,000
              </div>
              <div className="text-xs sm:text-sm uppercase">Members</div>
            </div>
            <div className="border-x-[3px] border-black">
              <div className="text-sm sm:text-base md:text-lg font-bold">
                12
              </div>
              <div className="text-xs sm:text-sm uppercase">Challenges</div>
            </div>
            <div>
              <div className="text-sm sm:text-base md:text-lg font-bold">
                850 pts
              </div>
              <div className="text-xs sm:text-sm uppercase">Avg Earn</div>
            </div>
          </div>
        </div>

        {/* JOIN SECTION */}
        <div className="border-t-[3px] border-black pt-3 sm:pt-4">
          <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
            Join Titan&apos;s DeFi Mastery Club
          </h3>
          <p className="text-xs sm:text-sm mb-2">
            Entry Fee: <strong>100 MOCA tokens</strong>
          </p>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-gray-800">
            Get access to exclusive challenges, direct communication with Crypto
            Titan, and premium educational content.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleJoin}
              className="pixel-btn pixel-btn--primary w-full sm:flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              Join Club (100 MOCA)
            </button>
            <button
              type="button"
              onClick={close}
              className="pixel-btn pixel-btn--secondary w-full sm:flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              Learn More Later
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

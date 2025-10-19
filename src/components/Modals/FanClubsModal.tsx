"use client";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";
import Modal from "@/ui/Modal";
import { ViewFanClubCard } from "@/lib/types/view";

interface FanClubsModalProps {
  club?: ViewFanClubCard;
}

export default function FanClubsModal({ club }: FanClubsModalProps) {
  const { modal, modalData, close } = useUI();
  // const { submitChallenge } = useData();
  const { joinFanClub } = useData();

  // Use selectedClub from UI state or club prop
  const activeClub = modalData as ViewFanClubCard | null;


  if (modal !== "fanClubs" || !activeClub) return null;

  async function handleJoin() {
    if (!activeClub) return;

    // await submitChallenge(activeClub.id, {
    //   amount: 100, // Default amount, can be extracted from activeClub.priceLabel
    //   proof: { type: "club_join", value: activeClub.id },
    // });
    await joinFanClub(activeClub.id.toString());

    close();
  }

  // Extract initials from KOL name for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal title={`Join ${activeClub.kolName}'s Club`} onClose={close}>
      <div className="bg-[#f6dca3] border-[3px] border-black rounded-[6px] p-3 sm:p-4 md:p-6 pixel-font text-black">
        {/* HEADER */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#61dafb] border-[3px] border-black rounded-[4px] font-bold text-sm sm:text-base">
            {getInitials(activeClub.kolName)}
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-1">
              {activeClub.kolName}{" "}
              {activeClub.kolVerified && (
                <span className="text-blue-600">✓</span>
              )}
            </h2>
            <p className="text-sm sm:text-base">{activeClub.kolSubtitle}</p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              {activeClub.description}
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
                {activeClub.members.toLocaleString()}/5,000
              </div>
              <div className="text-xs sm:text-sm uppercase">Members</div>
            </div>
            <div className="border-x-[3px] border-black">
              <div className="text-sm sm:text-base md:text-lg font-bold">
                {activeClub.challenges}
              </div>
              <div className="text-xs sm:text-sm uppercase">Challenges</div>
            </div>
            <div>
              <div className="text-sm sm:text-base md:text-lg font-bold">
                {activeClub.avgEarnings} pts
              </div>
              <div className="text-xs sm:text-sm uppercase">Avg Earn</div>
            </div>
          </div>
        </div>

        {/* JOIN SECTION */}
        <div className="border-t-[3px] border-black pt-3 sm:pt-4">
          <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
            {activeClub.title}
          </h3>
          <p className="text-xs sm:text-sm mb-2">
            Entry Fee: <strong>{activeClub.priceLabel}</strong>
          </p>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-gray-800">
            Get access to exclusive challenges, direct communication with{" "}
            {activeClub.kolName}, and premium educational content.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleJoin}
              className="pixel-btn pixel-btn--primary w-full sm:flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              Join Club ({activeClub.priceLabel})
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

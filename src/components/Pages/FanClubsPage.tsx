"use client";
import { useApp } from "@/context/AppContext";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";

export default function FanClubsPage() {
  const { handleNavigation } = useApp();
  const { fanClubs } = useData();

  const joinedClubs = fanClubs.filter((c) => !c.isJoined);
  console.log("joinedClubs", joinedClubs);
  const { open } = useUI();

  // === Handlers ===

  const handleJoinClub = (
    club: (typeof fanClubs)[number],
    isVerified: boolean
  ) => {
    if (!isVerified) return;
    // joinFanClub(club.id.toString());
    open("fanClubs", club);
  };

  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold pixel-font">🎮 Fan Clubs</h1>
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="pixel-btn pixel-btn--secondary"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 sm:grid-cols-2 gap-4">
        {joinedClubs.map((club) => {
          const initials = club.kolName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={club.id}
              className={`relative bg-[#f6dca3] text-black border-[3px] border-black rounded-[6px] p-4 shadow-[4px_4px_0_0_#000] pixel-card transition-transform hover:scale-[1.02] ${
                club.kolVerified ? "" : "opacity-60"
              }`}
            >
              {/* Kol header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#61dafb] border-[3px] border-black rounded-[4px] font-bold text-black pixel-font">
                  {initials}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-1 pixel-font">
                    {club.kolName}
                    {club.kolVerified && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </h3>
                  {club.kolSubtitle && (
                    <p className="text-sm text-gray-800 pixel-font">
                      {club.kolSubtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Club title + desc */}
              <h2 className="text-xl font-bold mb-1 pixel-font">
                {club.title}
              </h2>
              <p className="text-sm text-gray-800 mb-3 leading-tight pixel-font">
                {club.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-center bg-[#ffeeb0] border-[3px] border-black rounded-[4px] py-2 mb-2 pixel-font">
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    {club.members.toLocaleString()}
                  </div>
                  <div className="text-xs uppercase">Members</div>
                </div>
                <div className="flex-1 border-x-[3px] border-black">
                  <div className="text-lg font-bold">
                    {club.challenges.toLocaleString()}
                  </div>
                  <div className="text-xs uppercase">Challenges</div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    {club.avgEarnings.toLocaleString()}
                  </div>
                  <div className="text-xs uppercase">Avg Earn</div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex flex-wrap gap-2 text-xs mb-3 pixel-font">
                {Object.entries(club.socials).map(([platform, count]) => (
                  <span
                    key={platform}
                    className="bg-[#000] text-[#fff] px-2 py-[1px] rounded-[3px]"
                  >
                    {platform}: {count?.toLocaleString()}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t-[3px] border-black">
                <span className="font-bold pixel-font">{club.priceLabel}</span>
                <button
                  className="pixel-btn pixel-btn--primary text-sm"
                  onClick={() => handleJoinClub(club, club.kolVerified)}
                >
                  Join Club
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

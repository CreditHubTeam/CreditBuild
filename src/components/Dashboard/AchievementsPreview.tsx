"use client";
import { useApp } from "@/context/AppContext";
import { useData } from "@/state/data";

export default function AchievementsPreview() {
  const { achievements, handleNavigation } = useApp();
  // const { achievements } = useData();
  return (
    <div className="pixel-card p-5 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Recent Achievements</h2>
        <button
          className="pixel-btn pixel-btn--secondary"
          onClick={() => handleNavigation("/achievements")}
        >
          View All
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {achievements.slice(0, 3).map((a) => (
          <div
            key={a.id}
            className="bg-mc-oak text-black border-3 border-black rounded-pixel p-4"
          >
            <div className="text-2xl">{a.icon}</div>
            <div className="mt-2 font-bold">{a.name}</div>
            <div className="text-[11px] opacity-90">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

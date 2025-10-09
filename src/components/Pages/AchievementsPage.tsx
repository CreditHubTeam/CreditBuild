"use client";
import { useApp } from "@/context/AppContext";

export default function AchievementsPage() {
  const { achievements, handleNavigation } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Achievements</h1>
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="pixel-btn pixel-btn--secondary"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`bg-mc-oak text-black border-3 border-black rounded-pixel p-4 ${
              a.unlocked ? "" : "opacity-60"
            }`}
          >
            <div className="text-2xl">{a.icon}</div>
            <div className="mt-2 font-bold">{a.name}</div>
            <div className="text-[11px] opacity-90">{a.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

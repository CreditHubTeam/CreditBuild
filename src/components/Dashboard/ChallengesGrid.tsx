"use client";
import { useData } from "@/state/data";
import { useUI } from "@/state/ui";

export default function ChallengesGrid() {
  const { challenges } = useData(); // This is call by react query
  const { open } = useUI();

  return (
    <div className="pixel-card p-5 mb-5">
      <h2 className="text-xl mb-4">Daily Challenges</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {challenges.map((c) => (
          <button
            key={c.id}
            onClick={() => open("challenge", c.id)}
            className="text-left bg-mc-dirt border-3 border-mc-darkbrown rounded-pixel p-4 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-mc-gold px-3 py-2 border-2 border-mc-darkbrown rounded-pixel">
                {c.icon ?? "🎯"}
              </div>
              <div className="font-bold">{c.name}</div>
            </div>
            <div className="text-[11px] opacity-90 mb-2">{c.description}</div>
            <div className="text-[11px] flex gap-3">
              <span className="pixel-badge bg-mc-green text-white">
                💰 {c.points} Points
              </span>
              <span className="pixel-badge bg-mc-blue text-white">
                📈 +{c.creditImpact} Credit
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

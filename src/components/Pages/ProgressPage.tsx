"use client";
import { useApp } from "@/context/AppContext";

export default function ProgressPage() {
  const { handleNavigation, currentUser } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Progress Tracking</h1>
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="pixel-btn pixel-btn--secondary"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="pixel-card p-4">
          <h3>Total Challenges</h3>
          <div className="text-2xl">{currentUser.totalChallenges}</div>
        </div>
        <div className="pixel-card p-4">
          <h3>Points Earned</h3>
          <div className="text-2xl">{currentUser.totalPoints}</div>
        </div>
        <div className="pixel-card p-4">
          <h3>Best Streak</h3>
          <div className="text-2xl">
            {Math.max(currentUser.streakDays, currentUser.bestStreak)} days
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import ConnectionPanel from "@/components/Dashboard/ConnectionPanel";
import CreditScore from "@/components/Dashboard/CreditScore";
import ChallengesGrid from "@/components/dashboard/ChallengesGrid";
import AchievementsPreview from "@/components/Dashboard/AchievementsPreview";

export default function DashboardPage() {
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <ConnectionPanel />
      <CreditScore />
      <ChallengesGrid />
      <AchievementsPreview />
    </section>
  );
}

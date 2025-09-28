"use client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConnectionPanel from "@/components/Dashboard/ConnectionPanel";
import CreditScore from "@/components/Dashboard/CreditScore";
import ChallengesGrid from "@/components/Dashboard/ChallengesGrid";
import AchievementsPreview from "@/components/Dashboard/AchievementsPreview";
import AchievementsPage from "@/components/Pages/AchievementsPage";
import ProgressPage from "@/components/Pages/ProgressPage";
import EducationPage from "@/components/Pages/EducationPage";
import WalletSelectionModal from "@/components/Modals/WalletSelectionModal";
import NetworkSwitchModal from "@/components/Modals/NetworkSwitchModal";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import ChallengeModal from "@/components/Modals/ChallengeModal";
import LoadingIndicator from "@/components/LoadingIndicator";
import Notification from "@/components/UI/Notification";
import { useApp } from "@/context/AppContext";

export default function Page() {
  const { currentPage, isWalletConnected, handleGetStarted } = useApp();

  return (
    <>
      <Header />

      {/* Landing */}
      {currentPage === "landingPage" && (
        <section className="container mx-auto px-4 py-12">
          <div className="pixel-card p-8">
            <h1 className="text-2xl mb-3">
              Build Your Credit Score Like in Minecraft!
            </h1>
            <p className="opacity-90 mb-4">
              Complete daily challenges, earn achievements, and level up your
              financial life!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
                🎯<div className="text-[10px]">Daily Challenges</div>
              </div>
              <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
                🏆<div className="text-[10px]">Achievements</div>
              </div>
              <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">
                📈<div className="text-[10px]">Track Progress</div>
              </div>
            </div>
            <button
              className="pixel-btn pixel-btn--primary w-full md:w-auto"
              onClick={handleGetStarted}
            >
              {isWalletConnected ? "Continue" : "Get Started"}
            </button>
          </div>
        </section>
      )}

      {/* Dashboard */}
      {currentPage === "dashboard" && (
        <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
          <ConnectionPanel />
          <CreditScore />
          <ChallengesGrid />
          <AchievementsPreview />
        </section>
      )}

      {currentPage === "achievementsPage" && <AchievementsPage />}
      {currentPage === "progressPage" && <ProgressPage />}
      {currentPage === "educationPage" && <EducationPage />}

      {/* Nav + Modals + Overlays */}
      {currentPage !== "landingPage" && <BottomNav />}
      <WalletSelectionModal />
      <NetworkSwitchModal />
      <RegistrationModal />
      <ChallengeModal />
      <LoadingIndicator />
      <Notification />
    </>
  );
}

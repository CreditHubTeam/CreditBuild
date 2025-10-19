"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import WalletSelectionModal from "@/components/Modals/WalletSelectionModal";
import NetworkSwitchModal from "@/components/Modals/NetworkSwitchModal";
import ChallengeModal from "@/components/Modals/ChallengeModal";
import LoadingGlobal from "@/ui/Loading";
import Notification from "@/ui/Notification";
import FanClubsModal from "./Modals/FanClubsModal";
import FormFanClubModal from "./Modals/FormFanClubModal";
import FormClubChallengeModal from "./Modals/FormClubChallengeModal";
import ClubChallengeModal from "./Modals/ClubChallengeModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      <Header />

      {/* Page Transition Wrapper */}
      <main className="transition-all duration-300 ease-in-out">
        {children}
      </main>

      {/* Navigation - Hide on landing page */}
      {!isLandingPage && <BottomNav />}

      {/* Global Modals */}
      <WalletSelectionModal />
      <NetworkSwitchModal />
      {/* <RegistrationModal /> */}
      <ChallengeModal />
      <ClubChallengeModal />
      <FormClubChallengeModal />
      <FanClubsModal />
      <FormFanClubModal />
      <LoadingGlobal />
      <Notification />
    </>
  );
}

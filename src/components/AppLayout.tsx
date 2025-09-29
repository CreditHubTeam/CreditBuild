"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import WalletSelectionModal from "@/components/Modals/WalletSelectionModal";
import NetworkSwitchModal from "@/components/Modals/NetworkSwitchModal";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import ChallengeModal from "@/components/Modals/ChallengeModal";
import LoadingIndicator from "@/components/LoadingIndicator";
import Notification from "@/components/UI/Notification";

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
      <RegistrationModal />
      <ChallengeModal />
      <LoadingIndicator />
      <Notification />
    </>
  );
}

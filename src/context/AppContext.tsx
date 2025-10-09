"use client";

import { appData } from "@/lib/appData";
import type {
  Achievement,
  AppData,
  Challenge,
  User,
  WalletProvider,
} from "@/lib/types";
import { ViewFanClubCard } from "@/lib/types/view";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount, useConnect } from "wagmi";

type PageId =
  | "landingPage"
  | "dashboard"
  | "achievementsPage"
  | "progressPage"
  | "educationPage";
type ModalId =
  | "walletSelectionModal"
  | "networkSwitchModal"
  | "registrationModal"
  | "challengeModal";
 

type Ctx = {
  // state
  currentUser: User;
  isWalletConnected: boolean;
  currentWalletType: string | null;
  currentChainId: string | null;
  availableWallets: WalletProvider[];
  currentPage: PageId;
  openModal: ModalId | null;
  currentChallenge: Challenge | null;
  loading: { visible: boolean; message: string };
  notification: {
    visible: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  };
  creditPercentage: number;

  // data
  challenges: Challenge[];
  achievements: Achievement[];
  fanClubs: ViewFanClubCard[];
  educationalContent: AppData["educationalContent"];
  network: AppData["creditcoinNetwork"];

  // actions
  detectWallets: () => void;
  connectToWallet: (wallet: WalletProvider) => Promise<void>;
  switchToCorrectNetwork: () => Promise<void>;
  disconnectWallet: () => void;
  showPage: (p: PageId) => void;
  handleNavigation: (path: string) => void;
  handleGetStarted: () => void;
  showModal: (m: ModalId) => void;
  closeModals: () => void;
  handleRegistration: (e?: React.FormEvent) => Promise<void>;
  openChallenge: (c: Challenge) => void;
  completeChallenge: (amount: number) => Promise<void>;
  showNotification: (
    msg: string,
    type?: "success" | "error" | "warning" | "info"
  ) => void;
  hideNotification: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ---------- STATE ----------
  const [currentUser, setCurrentUser] = useState<User>({
    ...appData.sampleUser,
    isRegistered: false,
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWalletType, setCurrentWalletType] = useState<string | null>(
    null
  );
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<PageId>("landingPage");
  const [openModal, setOpenModal] = useState<ModalId | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [loading, setLoading] = useState<{ visible: boolean; message: string }>(
    { visible: false, message: "Processing..." }
  );
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  // <-- Listen to wagmi state
  const { isConnected, address, chainId: wagmiChainId } = useAccount();
  const { connectors } = useConnect();

  const pathname = usePathname();
  const router = useRouter();

  // Sync wagmi state with AppContext state
  useEffect(() => {
    console.log("Wagmi state changed:", {
      isConnected,
      address,
      chainId: wagmiChainId,
    });

    setIsWalletConnected(isConnected);

    if (isConnected && address) {
      const hexChainId = `0x${wagmiChainId?.toString(16)}`;
      setCurrentChainId(hexChainId);
      setCurrentUser((u) => ({
        ...u,
        address: `${address.slice(0, 6)}...${address.slice(-4)}`,
      }));
    } else {
      // Disconnected
      setCurrentChainId(null);
      setCurrentUser({ ...appData.sampleUser, isRegistered: false });
    }
  }, [isConnected, address, wagmiChainId]);

  // ---------- HELPERS ----------
  const isCorrectNetwork = useCallback(
    (cid: string | null) => cid === appData.creditcoinNetwork.chainId,
    []
  );
  const showNotification = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      setNotification({ visible: true, message, type });
    },
    []
  );
  const hideNotification = useCallback(
    () => setNotification((s) => ({ ...s, visible: false })),
    []
  );
  const showLoading = useCallback(
    (msg?: string) =>
      setLoading({ visible: true, message: msg ?? "Processing..." }),
    []
  );
  const hideLoading = useCallback(
    () => setLoading({ visible: false, message: "Processing..." }),
    []
  );
  const showPage = useCallback((p: PageId) => setCurrentPage(p), []);

  // ---------- INIT ----------
  // <-- replace detectWallets with mapping that uses connectors and doesn't mutate appData
  const detectWallets = useCallback(() => {
    const base: WalletProvider[] = [];
    console.log("Connectors:", connectors);

    appData.walletProviders.forEach((w) => {
      const isAvailable = connectors.find((connector) => connector.id === w.id);

      base.push({
        ...w,
        available: !!isAvailable, // ← Set available cho object copy
      });
    });

    console.log("Detected wallets:", base); // ← Debug
    setAvailableWallets(base);
  }, [connectors]);

  useEffect(() => {
    setCurrentPage("landingPage");
    detectWallets();
  }, [detectWallets]);

  // ---------- NAV ----------
  // const navigateToPage = useCallback(
  //   (page: PageId) => {
  //     console.log(page);
  //     if (!isWalletConnected && page !== "landingPage") {
  //       showNotification("Please connect your wallet first!", "warning");
  //       return;
  //     }
  //     if (isWalletConnected && !isCorrectNetwork(currentChainId)) {
  //       showNotification(
  //         "Please switch to Creditcoin Testnet first!",
  //         "warning"
  //       );
  //       return;
  //     }
  //     showPage(page);
  //   },
  //   [
  //     isWalletConnected,
  //     currentChainId,
  //     isCorrectNetwork,
  //     showNotification,
  //     showPage,
  //   ]
  // );
  const handleNavigation = (path: string) => {
    // console.log("Navigating to:", path);
    // console.log(isWalletConnected);
    if (!isWalletConnected && path !== "/") {
      showNotification("Please connect your wallet first!", "warning");
      return;
    }
    router.push(path);
  };

  const handleGetStarted = useCallback(() => {
    if (!isWalletConnected) {
      showModal("walletSelectionModal");
    } else if (!isCorrectNetwork(currentChainId)) {
      showModal("networkSwitchModal");
    } else if (!currentUser.isRegistered) {
      showModal("registrationModal");
    } else {
      showPage("dashboard");
    }
  }, [
    isWalletConnected,
    currentChainId,
    currentUser.isRegistered,
    isCorrectNetwork,
    showPage,
  ]);

  // ---------- MODALS ----------
  const showModal = useCallback((id: ModalId) => setOpenModal(id), []);
  const closeModals = useCallback(() => setOpenModal(null), []);

  // ---------- WALLET / NETWORK ----------
  const connectToWallet = useCallback(
    async (wallet: WalletProvider) => {
      closeModals();
      showLoading("Connecting to wallet...");
      try {
        await new Promise((r) => setTimeout(r, 500));
        const mock = "0x" + Math.random().toString(16).slice(2, 42);
        const short = `${mock.slice(0, 6)}...${mock.slice(-4)}`;
        setIsWalletConnected(true);
        setCurrentWalletType(wallet.id);
        setCurrentUser((u) => ({ ...u, address: short }));
        setCurrentChainId("0x1"); // mock sai network trước
        hideLoading();
        showNotification(
          `${wallet.name} connected successfully! 🎉`,
          "success"
        );
        setTimeout(() => showModal("networkSwitchModal"), 300);
      } catch {
        hideLoading();
        showNotification(
          "Connection rejected - Please approve in your wallet",
          "error"
        );
      }
    },
    [closeModals, hideLoading, showLoading, showNotification, showModal]
  );

  const switchToCorrectNetwork = useCallback(async () => {
    showLoading("Switching network...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setCurrentChainId(appData.creditcoinNetwork.chainId);
      hideLoading();
      showNotification(
        "Successfully switched to Creditcoin Testnet! ⛓️",
        "success"
      );
      closeModals();
      if (!currentUser.isRegistered) {
        setTimeout(() => showModal("registrationModal"), 200);
      } else {
        showPage("dashboard");
      }
    } catch {
      hideLoading();
      showNotification(
        "Network switch rejected - Please approve in your wallet",
        "error"
      );
    }
  }, [
    closeModals,
    currentUser.isRegistered,
    hideLoading,
    showLoading,
    showNotification,
    showModal,
    showPage,
  ]);

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setCurrentWalletType(null);
    setCurrentChainId(null);
    setCurrentUser({ ...appData.sampleUser, isRegistered: false });
    showPage("landingPage");
    showNotification("Wallet disconnected", "info");
  }, [showNotification, showPage]);

  // ---------- REGISTRATION ----------
  const handleRegistration = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (!isCorrectNetwork(currentChainId)) {
        showNotification(
          "Please switch to Creditcoin Testnet first!",
          "warning"
        );
        showModal("networkSwitchModal");
        return;
      }
      showLoading("Registering on blockchain...");
      await new Promise((r) => setTimeout(r, 600));
      setCurrentUser((u) => ({
        ...u,
        isRegistered: true,
        creditScore: 300,
        streakDays: 0,
        totalChallenges: 0,
        totalPointsEarned: 0,
      }));
      hideLoading();
      closeModals();
      showPage("dashboard");
      showNotification(
        "Welcome to CreditBuild! Your journey begins now. 🎉",
        "success"
      );
    },
    [
      closeModals,
      currentChainId,
      hideLoading,
      isCorrectNetwork,
      showLoading,
      showModal,
      showNotification,
      showPage,
    ]
  );

  // ---------- CHALLENGES ----------
  const openChallenge = useCallback(
    (c: Challenge) => {
      if (!isCorrectNetwork(currentChainId)) {
        showNotification(
          "Please switch to Creditcoin Testnet first!",
          "warning"
        );
        showModal("networkSwitchModal");
        return;
      }
      setCurrentChallenge(c);
      showModal("challengeModal");
    },
    [currentChainId, isCorrectNetwork, showModal, showNotification]
  );

  const completeChallenge = useCallback(
    async (_amount: number) => {
      showLoading("Submitting challenge...");
      await new Promise((r) => setTimeout(r, 500));
      setCurrentUser((u) => ({
        ...u,
        creditScore: Math.min(
          850,
          u.creditScore + (currentChallenge?.creditImpact ?? 0)
        ),
        totalPointsEarned:
          u.totalPointsEarned + (currentChallenge?.points ?? 0),
        totalChallenges: u.totalChallenges + 1,
        streakDays: Math.max(u.streakDays, 1),
      }));
      hideLoading();
      showNotification("Challenge Completed! 🎉", "success");
      closeModals();
    },
    [currentChallenge, closeModals, hideLoading, showLoading, showNotification]
  );

  // ---------- DERIVED ----------
  const creditPercentage = useMemo(
    () => Math.max(5, ((currentUser.creditScore - 300) / 550) * 100),
    [currentUser.creditScore]
  );

  const value: Ctx = {
    currentUser,
    isWalletConnected,
    currentWalletType,
    currentChainId,
    availableWallets,
    currentPage,
    openModal,

    currentChallenge,
    loading,
    notification,
    creditPercentage,
    challenges: appData.challenges,
    achievements: appData.achievements,
    fanClubs: appData.fanClubs,
    educationalContent: appData.educationalContent,
    network: appData.creditcoinNetwork,
    detectWallets,
    connectToWallet,
    switchToCorrectNetwork,
    disconnectWallet,
    showPage,
    handleNavigation,
    handleGetStarted,
    showModal,
    closeModals,
    handleRegistration,
    openChallenge,
    completeChallenge,
    showNotification,
    hideNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

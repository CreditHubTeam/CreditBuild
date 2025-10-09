// "use client";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { appData } from "@/lib/appData";
// import type { Challenge, User, WalletProvider } from "@/lib/types";

// type PageId =
//   | "landingPage"
//   | "dashboard"
//   | "achievementsPage"
//   | "progressPage"
//   | "educationPage";
// type ModalId =
//   | "walletSelectionModal"
//   | "networkSwitchModal"
//   | "registrationModal"
//   | "challengeModal";

// export function useApp() {
//   // State (chuyển từ app.js)
//   const [currentUser, setCurrentUser] = useState<User>({
//     ...appData.sampleUser,
//     isRegistered: false,
//   });
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [currentWalletType, setCurrentWalletType] = useState<string | null>(
//     null
//   );
//   const [currentChainId, setCurrentChainId] = useState<string | null>(null);
//   const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>(
//     []
//   );
//   const [currentPage, setCurrentPage] = useState<PageId>("landingPage");
//   const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
//     null
//   );

//   const [loading, setLoading] = useState<{ visible: boolean; message: string }>(
//     { visible: false, message: "Processing..." }
//   );
//   const [notification, setNotification] = useState<{
//     visible: boolean;
//     message: string;
//     type: "success" | "error" | "warning" | "info";
//   }>({ visible: false, message: "", type: "info" });

//   // Helpers
//   const isCorrectNetwork = useCallback(
//     (cid: string | null) => cid === appData.creditcoinNetwork.chainId,
//     []
//   );
//   const showNotification = useCallback(
//     (
//       message: string,
//       type: "success" | "error" | "warning" | "info" = "info"
//     ) => setNotification({ visible: true, message, type }),
//     []
//   );
//   const hideNotification = useCallback(
//     () => setNotification((s) => ({ ...s, visible: false })),
//     []
//   );

//   const showLoading = useCallback(
//     (msg?: string) =>
//       setLoading({ visible: true, message: msg ?? "Processing..." }),
//     []
//   );
//   const hideLoading = useCallback(
//     () => setLoading({ visible: false, message: "Processing..." }),
//     []
//   );

//   // Wallet detection (giản lược: dựa trên window.ethereum nếu có)
//   const detectWallets = useCallback(() => {
//     const base: WalletProvider[] = [];
//     // luồng tương tự file gốc
//     if (typeof window !== "undefined") {
//       const win = window as unknown as { ethereum?: unknown };
//       if (win.ethereum) {
//         base.push({
//           id: "io.metamask",
//           name: "MetaMask",
//           icon: "🦊",
//           description: "Most popular Ethereum wallet",
//           available: true,
//         });
//       }
//     }
//     // Thêm các lựa chọn còn lại (download link)
//     appData.walletProviders.forEach((w) => {
//       const exists = base.find((b) => b.id === w.id);
//       if (!exists) base.push({ ...w, available: false });
//     });
//     setAvailableWallets(base);
//   }, []);

//   // Auto init (DOMContentLoaded)
//   useEffect(() => {
//     // simulate DOMContentLoaded init
//     setTimeout(() => {
//       setCurrentPage("landingPage");
//       detectWallets();
//     }, 100);
//   }, [detectWallets]);

//   // Navigation
//   const showPage = useCallback((page: PageId) => setCurrentPage(page), []);
//   const navigateToPage = useCallback(
//     (page: PageId) => {
//       if (!isWalletConnected && page !== "landingPage") {
//         showNotification("Please connect your wallet first!", "warning");
//         return;
//       }
//       if (isWalletConnected && !isCorrectNetwork(currentChainId)) {
//         showNotification(
//           "Please switch to Creditcoin Testnet first!",
//           "warning"
//         );
//         return;
//       }
//       showPage(page);
//     },
//     [
//       isWalletConnected,
//       currentChainId,
//       isCorrectNetwork,
//       showPage,
//       showNotification,
//     ]
//   );

//   const handleGetStarted = useCallback(() => {
//     if (!isWalletConnected) {
//       // mở modal chọn ví
//       showModal("walletSelectionModal");
//     } else if (!isCorrectNetwork(currentChainId)) {
//       showModal("networkSwitchModal");
//     } else if (!currentUser.isRegistered) {
//       showModal("registrationModal");
//     } else {
//       showPage("dashboard");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     isWalletConnected,
//     currentChainId,
//     currentUser.isRegistered,
//     isCorrectNetwork,
//     showPage,
//   ]);

//   // Modals
//   const [openModal, setOpenModal] = useState<ModalId | null>(null);
//   const showModal = useCallback((id: ModalId) => setOpenModal(id), []);
//   const closeModals = useCallback(() => setOpenModal(null), []);

//   // Wallet connect (mô phỏng theo app.js)
//   const connectToWallet = useCallback(
//     async (wallet: WalletProvider) => {
//       closeModals();
//       showLoading("Connecting to wallet...");
//       try {
//         await new Promise((r) => setTimeout(r, 1200));
//         // mock address + chainId sai trước
//         const mockAddress = "0x" + Math.random().toString(16).slice(2, 42);
//         const short = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`;
//         setIsWalletConnected(true);
//         setCurrentWalletType(wallet.id);
//         setCurrentUser((u) => ({ ...u, address: short }));
//         setCurrentChainId("0x1"); // mainnet giả lập (sai)
//         hideLoading();
//         showNotification(
//           `${wallet.name} connected successfully! 🎉`,
//           "success"
//         );
//         setTimeout(() => showModal("networkSwitchModal"), 600);
//       } catch {
//         hideLoading();
//         showNotification(
//           "Connection rejected - Please approve the connection in your wallet",
//           "error"
//         );
//       }
//     },
//     [closeModals, hideLoading, showLoading, showNotification, showModal]
//   );

//   const switchToCorrectNetwork = useCallback(async () => {
//     showLoading("Switching network...");
//     try {
//       await new Promise((r) => setTimeout(r, 900));
//       setCurrentChainId(appData.creditcoinNetwork.chainId);
//       hideLoading();
//       showNotification(
//         "Successfully switched to Creditcoin Testnet! ⛓️",
//         "success"
//       );
//       closeModals();
//       if (!currentUser.isRegistered) {
//         setTimeout(() => showModal("registrationModal"), 300);
//       } else {
//         showPage("dashboard");
//       }
//     } catch {
//       hideLoading();
//       showNotification(
//         "Network switch rejected - Please approve in your wallet",
//         "error"
//       );
//     }
//   }, [
//     closeModals,
//     currentUser.isRegistered,
//     hideLoading,
//     showLoading,
//     showNotification,
//     showModal,
//     showPage,
//   ]);

//   const disconnectWallet = useCallback(() => {
//     setIsWalletConnected(false);
//     setCurrentWalletType(null);
//     setCurrentChainId(null);
//     setCurrentUser({ ...appData.sampleUser, isRegistered: false });
//     showPage("landingPage");
//     showNotification("Wallet disconnected", "info");
//   }, [showNotification, showPage]);

//   // Registration
//   const handleRegistration = useCallback(
//     async (e?: React.FormEvent) => {
//       e?.preventDefault?.();
//       if (!isCorrectNetwork(currentChainId)) {
//         showNotification(
//           "Please switch to Creditcoin Testnet first!",
//           "warning"
//         );
//         showModal("networkSwitchModal");
//         return;
//       }
//       showLoading("Registering on blockchain...");
//       await new Promise((r) => setTimeout(r, 1200));
//       setCurrentUser((u) => ({
//         ...u,
//         isRegistered: true,
//         creditScore: 300,
//         streakDays: 0,
//         totalChallenges: 0,
//         totalPointsEarned: 0,
//       }));
//       hideLoading();
//       closeModals();
//       showPage("dashboard");
//       showNotification(
//         "Welcome to CreditBuild! Your journey begins now. 🎉",
//         "success"
//       );
//     },
//     [
//       closeModals,
//       currentChainId,
//       hideLoading,
//       isCorrectNetwork,
//       showLoading,
//       showModal,
//       showNotification,
//       showPage,
//     ]
//   );

//   // Dashboard data binding (credit bar)
//   const creditPercentage = useMemo(
//     () => Math.max(5, ((currentUser.creditScore - 300) / 550) * 100),
//     [currentUser.creditScore]
//   );

//   // Challenges / Achievements
//   const openChallenge = useCallback(
//     (c: Challenge) => {
//       if (!isCorrectNetwork(currentChainId)) {
//         showNotification(
//           "Please switch to Creditcoin Testnet first!",
//           "warning"
//         );
//         showModal("networkSwitchModal");
//         return;
//       }
//       setCurrentChallenge(c);
//       showModal("challengeModal");
//     },
//     [currentChainId, isCorrectNetwork, showModal, showNotification]
//   );

//   const completeChallenge = useCallback(
//     async (_amount: number) => {
//       showLoading("Submitting challenge...");
//       await new Promise((r) => setTimeout(r, 800));
//       setCurrentUser((u) => ({
//         ...u,
//         creditScore: Math.min(
//           850,
//           u.creditScore + (currentChallenge?.creditImpact ?? 0)
//         ),
//         totalPointsEarned:
//           u.totalPointsEarned + (currentChallenge?.points ?? 0),
//         totalChallenges: u.totalChallenges + 1,
//         streakDays: Math.max(u.streakDays, 1),
//       }));
//       hideLoading();
//       showNotification("Challenge Completed! 🎉", "success");
//       closeModals();
//     },
//     [currentChallenge, closeModals, hideLoading, showLoading, showNotification]
//   );

//   return {
//     // state
//     currentUser,
//     isWalletConnected,
//     currentWalletType,
//     currentChainId,
//     availableWallets,
//     currentPage,
//     openModal,
//     currentChallenge,
//     loading,
//     notification,
//     creditPercentage,
//     // data
//     challenges: appData.challenges,
//     achievements: appData.achievements,
//     educationalContent: appData.educationalContent,
//     network: appData.creditcoinNetwork,
//     // actions
//     detectWallets,
//     connectToWallet,
//     switchToCorrectNetwork,
//     disconnectWallet,
//     showPage,
//     navigateToPage,
//     handleGetStarted,
//     showModal,
//     closeModals,
//     handleRegistration,
//     openChallenge,
//     completeChallenge,
//     showNotification,
//     hideNotification,
//   };
// }

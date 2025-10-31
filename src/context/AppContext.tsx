"use client";

/**
 * LEGACY AppContext - Being phased out!
 *
 * ⚠️ DEPRECATION NOTICE:
 * This context is kept for backward compatibility with components that haven't been migrated yet.
 * New components should use the modern state hooks instead:
 *
 * - useUI() for modals, loading, notifications (src/state/ui.tsx)
 * - useWallet() for wallet connection & network (src/state/wallet.tsx)
 * - useData() for API data & mutations (src/state/data.tsx)
 *
 * This file only provides minimal compatibility shims.
 */

import { useUI } from "@/state/ui";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext } from "react";

// Minimal legacy modal IDs for compatibility
type LegacyModalId = "walletSelectionModal" | "networkSwitchModal" | null;

type LegacyCtx = {
  // Modal management (legacy)
  showModal: (m: LegacyModalId) => void;
  closeModals: () => void;
  openModal: (m: LegacyModalId) => void; // Alias for showModal

  // Navigation (legacy)
  handleNavigation: (path: string) => void;

  // Wallet detection (legacy - no-op)
  availableWallets: string[];
  detectWallets: () => void;

  // Notifications (legacy)
  showNotification: (
    msg: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
};

const AppContext = createContext<LegacyCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { open, close, notify } = useUI();
  const router = useRouter();

  // Legacy modal management - maps to new UIProvider
  const showModal = useCallback(
    (id: LegacyModalId) => {
      console.warn(
        `[AppContext] Legacy showModal("${id}") called. Consider migrating to useUI().open()`
      );

      if (id === "walletSelectionModal") {
        open("walletSelection");
      } else if (id === "networkSwitchModal") {
        open("networkSwitch");
      }
    },
    [open]
  );

  const closeModals = useCallback(() => {
    console.warn(
      "[AppContext] Legacy closeModals() called. Consider migrating to useUI().close()"
    );
    close();
  }, [close]);

  const handleNavigation = useCallback(
    (path: string) => {
      console.warn(
        `[AppContext] Legacy handleNavigation("${path}") called. Consider using Next.js useRouter() directly`
      );
      router.push(path);
    },
    [router]
  );

  const showNotification = useCallback(
    (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
      console.warn(
        `[AppContext] Legacy showNotification() called. Consider migrating to useUI().notify()`
      );
      notify(msg, type);
    },
    [notify]
  );

  const value: LegacyCtx = {
    showModal,
    closeModals,
    openModal: showModal, // Alias
    handleNavigation,
    availableWallets: ["MetaMask"], // Static legacy value
    detectWallets: () => {
      console.warn(
        "[AppContext] Legacy detectWallets() called. No-op - wallet detection handled by wagmi"
      );
    },
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

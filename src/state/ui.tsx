"use client";
import { Challenge } from "@/lib/types";
import { ViewFanClubCard } from "@/lib/types/view";
import React, { createContext, useContext, useCallback, useState } from "react";

type ModalId =
  | "walletSelection"
  | "networkSwitch"
  | "registration"
  | "challenge"
  | "clubChallenge"
  | "formClubChallenge"
  | "formChallenge"
  | "fanClubs"
  | "formFanClub"
  | null;
type NoticeType = "success" | "error" | "warning" | "info";

type UIState = {
  modal: ModalId;
  modalData: ViewFanClubCard | Challenge | null; // Club data for FanClubsModal
  id: string | number | null; // Generic ID for other modals if needed
  loading: { visible: boolean; message: string };
  notice: { visible: boolean; message: string; type: NoticeType };
};

type UIContextType = UIState & {
  open: (
    m: Exclude<ModalId, null>,
    data?: ViewFanClubCard | Challenge | string | number
  ) => void;
  close: () => void;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
  notify: (message: string, type?: NoticeType) => void;
  clearNotice: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalId>(null);
  const [modalData, setModalData] = useState<
    ViewFanClubCard | Challenge | null
  >(null);
  const [id, setId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState({
    visible: false,
    message: "Processing...",
  });
  const [notice, setNotice] = useState({
    visible: false,
    message: "",
    type: "info" as NoticeType,
  });

  const open = useCallback(
    (m: Exclude<ModalId, null>, data?: ViewFanClubCard | Challenge | string | number) => {
      setModal(m);
      setId(data as string | number | null);
      setModalData(data as ViewFanClubCard | Challenge | null);
    },
    []
  );
  const close = useCallback(() => {
    setModal(null);
    setModalData(null);
    setId(null);
  }, []);
  const showLoading = useCallback(
    (msg?: string) =>
      setLoading({ visible: true, message: msg ?? "Processing..." }),
    []
  );
  const hideLoading = useCallback(
    () => setLoading({ visible: false, message: "Processing..." }),
    []
  );
  const notify = useCallback(
    (message: string, type: NoticeType = "info") =>
      setNotice({ visible: true, message, type }),
    []
  );
  const clearNotice = useCallback(
    () => setNotice((n) => ({ ...n, visible: false })),
    []
  );

  return (
    <UIContext.Provider
      value={{
        modal,
        modalData,
        id,
        loading,
        notice,
        open,
        close,
        showLoading,
        hideLoading,
        notify,
        clearNotice,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
};

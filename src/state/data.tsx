"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/http";
import { useWallet } from "./wallet";
import { useUI } from "./ui";
import { Challenge } from "@/lib/types";



type EducationItem = {
  id: number;
  slug: string;
  title: string;
  bodyMd: string;
  category: string;
  tags: string[];
};

type DataCtx = {
  challenges: Challenge[];
  education: EducationItem[];
  refreshChallenges: () => void;
  submitChallenge: (
    challengeId: number,
    payload: { amount?: number; proof?: unknown }
  ) => Promise<void>;
};

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { address } = useWallet();
  const { showLoading, hideLoading, notify } = useUI();

  const qChallenges = useQuery({
    queryKey: ["challenges"],
    queryFn: () => api.get<Challenge[]>("/api/challenges"),
  });

  const qEducation = useQuery({
    queryKey: ["education"],
    queryFn: () => api.get<EducationItem[]>("/api/education"),
  });

  const mSubmit = useMutation({
    mutationKey: ["submitChallenge"],
    mutationFn: async ({
      challengeId,
      amount,
      proof,
    }: {
      challengeId: number;
      amount?: number;
      proof?: unknown;
    }) => {
      if (!address) throw new Error("Wallet not connected");
      return api.post(`/api/challenges/${challengeId}/submit`, {
        walletAddress: address,
        amount,
        proof,
      });
    },
    onMutate: () => showLoading("Submitting challenge..."),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify("Challenge Completed! 🎉", "success");
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => notify(e.message ?? "Submit failed", "error"),
  });

  const value = useMemo<DataCtx>(
    () => ({
      challenges: qChallenges.data ?? [],
      education: qEducation.data ?? [],
      refreshChallenges: () =>
        qc.invalidateQueries({ queryKey: ["challenges"] }),
      submitChallenge: async (challengeId, payload) => {
        await mSubmit.mutateAsync({ challengeId, ...payload });
      },
    }),
    [qChallenges.data, qEducation.data, qc, mSubmit]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
};

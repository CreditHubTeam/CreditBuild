"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "./wallet";
import { useUI } from "./ui";
import { Achievement, Challenge, Education } from "@/lib/types";
import { ViewFanClubCard } from "@/lib/types/view";
import { getChallenges, postNewChallenge } from "@/lib/api/challenges";
import { getEducation } from "@/lib/api/education";
import { getFanClubs } from "@/lib/api/fanClubs";
import { getAchievements } from "@/lib/api/achievements";

type DataCtx = {
  challenges: Challenge[];
  education: Education[];
  achievements: Achievement[];
  fanClubs: ViewFanClubCard[];
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

  // Challenges
  const qChallenges = useQuery({
    queryKey: ["challenges", address],
    queryFn: ({ queryKey }) => {
      const walletAddress = (queryKey as [string, string | undefined])[1];
      if (!walletAddress) return Promise.resolve([] as Challenge[]);
      return getChallenges(walletAddress);
    },
    enabled: !!address,
  });

  // Education
  const qEducation = useQuery({
    queryKey: ["education"],
    queryFn: getEducation,
  });

  // Fan Clubs
  const qFanClubs = useQuery({ queryKey: ["fanClubs"], queryFn: getFanClubs });

  // Achievements
  const qAchievements = useQuery<Achievement[]>({
    queryKey: ["achievements", address],
    queryFn: () =>
      getAchievements(address as string).then(
        (res) => res.data as Achievement[]
      ),
    enabled: !!address,
  });

  const mSubmitChallenge = useMutation({
    mutationKey: ["submitChallenge"],
    mutationFn: async ({
      challengeId,
      amount,
      proof,
    }: {
      challengeId: number;
      amount?: number;
      proof?: unknown;
    }) =>
      postNewChallenge(String(challengeId), {
        walletAddress: address as string,
        amount,
        proof,
      }),
    onMutate: () => showLoading("Submitting challenge..."),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify("Challenge Completed! 🎉", "success");
      qc.invalidateQueries({ queryKey: ["challenges"] });
    },
    onError: (e: Error) => notify(e.message ?? "Submit failed", "error"),
  });

  // return (
  //   <DataContext.Provider
  //     value={{
  //       challenges: qChallenges.data ?? [],
  //       education: qEducation.data ?? [],
  //       fanClubs: qFanClubs.data ?? [],
  //       submitChallenge: (id: number, payload: any) =>
  //         mSubmitChallenge.mutateAsync({ id, ...payload }),
  //     }}
  //   >
  //     {children}
  //   </DataContext.Provider>
  // )

  const value = useMemo<DataCtx>(
    () => ({
      challenges: qChallenges.data ?? [],
      education: qEducation.data ?? [],
      fanClubs: qFanClubs.data ?? [],
      achievements: qAchievements.data ?? [],
      refreshChallenges: () =>
        qc.invalidateQueries({ queryKey: ["challenges"] }),
      submitChallenge: async (challengeId, payload) => {
        await mSubmitChallenge.mutateAsync({ challengeId, ...payload });
      },
    }),
    [
      qChallenges.data,
      qEducation.data,
      qFanClubs.data,
      qAchievements.data,
      qc,
      mSubmitChallenge,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
};

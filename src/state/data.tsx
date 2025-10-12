"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "./wallet";
import { useUI } from "./ui";
import { Achievement, Challenge, Education, User } from "@/lib/types";
import { ViewFanClubCard } from "@/lib/types/view";
import { getChallenges, completeChallenge } from "@/lib/api/challenges";
import {
  getEducation,
  getUserEducations,
  completeEducation,
} from "@/lib/api/education";
import { getFanClubs, joinFanClub } from "@/lib/api/fanClubs";
import { getAchievements } from "@/lib/api/achievements";
import { getUser, postRegister } from "@/lib/api/user";

type DataCtx = {
  currentUser: User | null;
  creditPercentage: number;
  challenges: Challenge[];
  educations: Education[];
  userEducations: Education[];
  achievements: Achievement[];
  fanClubs: ViewFanClubCard[];
  refreshChallenges: () => void;
  submitChallenge: (
    challengeId: number,
    payload: { amount?: number; proof?: unknown }
  ) => Promise<void>;
  completeEducation: (
    eduId: string,
    payload: { progress: number; proof?: unknown }
  ) => Promise<void>;
  joinFanClub: (clubId: string) => Promise<void>;
};

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { address } = useWallet();
  const { showLoading, hideLoading, notify } = useUI();
  const [hasWelcomed, setHasWelcomed] = React.useState<string | null>(null);
  const [registrationAttempted, setRegistrationAttempted] = React.useState<
    Set<string>
  >(new Set());

  // User
  const qCurrentUser = useQuery({
    queryKey: ["currentUser", address],
    queryFn: ({ queryKey }) => {
      const walletAddress = (queryKey as [string, string | undefined])[1];
      if (!walletAddress) return Promise.resolve(null);
      return getUser(walletAddress);
    },
    enabled: !!address,
  });

  // calculate percentage for progress bar user
  const creditPercentage = useMemo(() => {
    const score = qCurrentUser.data?.creditScore ?? 300;
    const percent = ((score - 300) / 550) * 100;
    return Math.max(5, Math.min(100, percent));
  }, [qCurrentUser.data?.creditScore]);

  // console.log("creditPercentage", creditPercentage);

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

  // Education - General
  const qEducation = useQuery({
    queryKey: ["education"],
    queryFn: getEducation,
  });

  // User specific educations
  const qUserEducations = useQuery({
    queryKey: ["userEducations", address],
    queryFn: ({ queryKey }) => {
      const walletAddress = (queryKey as [string, string | undefined])[1];
      if (!walletAddress) return Promise.resolve([] as Education[]);
      return getUserEducations(walletAddress);
    },
    enabled: !!address,
  });

  // Fan Clubs
  const qFanClubs = useQuery({
    queryKey: ["fanClubs"],
    queryFn: () => getFanClubs(address as string),
  });

  // Achievements
  const qAchievements = useQuery<Achievement[]>({
    queryKey: ["achievements", address],
    queryFn: () => getAchievements(address as string),
    enabled: !!address,
  });

  // Auto Register Mutation
  const mAutoRegister = useMutation({
    mutationKey: ["autoRegister"],
    mutationFn: async (walletAddress: string) => {
      // Mark that we've attempted registration for this address
      setRegistrationAttempted((prev) => new Set(prev).add(walletAddress));
      return postRegister({ walletAddress });
    },
    onSuccess: (data, walletAddress) => {
      notify("Welcome! Account created successfully! 🎉", "success");
      console.log("User registered:", data);
      setHasWelcomed(walletAddress);
      // Refresh user data
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error, walletAddress) => {
      // If user already exists, it's not really an error for UX
      if (
        error.message.includes("USER_ALREADY_EXISTS") ||
        error.message.includes("already exists")
      ) {
        notify("Welcome back! 👋", "info");
        console.log("User already exists, continuing...");
        setHasWelcomed(walletAddress);
        // Still refresh user data
        qc.invalidateQueries({ queryKey: ["currentUser"] });
      } else {
        console.error("Registration failed:", error);
        notify("Registration failed. Please try again.", "error");
        // Don't retry automatically on real errors
      }
    },
  });

  // Reset states when address changes or disconnects
  React.useEffect(() => {
    if (!address) {
      setHasWelcomed(null);
      setRegistrationAttempted(new Set());
      return;
    }
  }, [address]);

  // Auto-register effect - only when user query error and haven't tried yet
  React.useEffect(() => {
    if (
      address &&
      qCurrentUser.isError &&
      !mAutoRegister.isPending &&
      !registrationAttempted.has(address)
    ) {
      console.log("User not found, auto-registering for address:", address);
      mAutoRegister.mutate(address);
    }
  }, [address, qCurrentUser.isError, mAutoRegister, registrationAttempted]);

  // Welcome back message effect - only when user data loads successfully
  React.useEffect(() => {
    if (
      address &&
      qCurrentUser.data &&
      !qCurrentUser.isLoading &&
      hasWelcomed !== address
    ) {
      console.log("Welcome back user:", qCurrentUser.data);
      notify("Welcome back! 👋", "info");
      setHasWelcomed(address);
    }
  }, [address, qCurrentUser.data, qCurrentUser.isLoading, hasWelcomed, notify]);

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
      completeChallenge(String(challengeId), {
        walletAddress: address as string,
        amount,
        proof,
      }),
    onMutate: () => showLoading("Submitting challenge..."),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify("Challenge Completed! 🎉", "success");
      qc.invalidateQueries({ queryKey: ["challenges"] });
      qc.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: (e: Error) => notify(e.message ?? "Submit failed", "error"),
  });

  // Complete Education Mutation
  const mCompleteEducation = useMutation({
    mutationKey: ["completeEducation"],
    mutationFn: async ({
      eduId,
      progress,
      proof,
    }: {
      eduId: string;
      progress: number;
      proof?: unknown;
    }) =>
      completeEducation(eduId, {
        walletAddress: address as string,
        progress,
        proof,
      }),
    onMutate: () => showLoading("Completing education..."),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify("Education Completed! 📚", "success");
      qc.invalidateQueries({ queryKey: ["education"] });
      qc.invalidateQueries({ queryKey: ["userEducations"] });
      qc.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: (e: Error) => notify(e.message ?? "Complete failed", "error"),
  });

  // Join Fan Club Mutation
  const mJoinFanClub = useMutation({
    mutationKey: ["joinFanClub"],
    mutationFn: async ({ clubId }: { clubId: string }) =>
      joinFanClub(clubId, {
        walletAddress: address as string,
        fanClubId: Number(clubId),
      }),
    onMutate: () => showLoading("Joining fan club..."),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify("Joined Fan Club! 🎊", "success");
      qc.invalidateQueries({ queryKey: ["fanClubs"] });
    },
    onError: (e: Error) => notify(e.message ?? "Join failed", "error"),
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
      creditPercentage,
      currentUser: qCurrentUser.data || null,
      challenges: qChallenges.data ?? [],
      educations: qEducation.data ?? [],
      userEducations: qUserEducations.data ?? [],
      fanClubs: qFanClubs.data ?? [],
      achievements: qAchievements.data ?? [],
      refreshChallenges: () =>
        qc.invalidateQueries({ queryKey: ["challenges"] }),
      submitChallenge: async (challengeId, payload) => {
        await mSubmitChallenge.mutateAsync({ challengeId, ...payload });
      },
      completeEducation: async (eduId, payload) => {
        await mCompleteEducation.mutateAsync({ eduId, ...payload });
      },
      joinFanClub: async (clubId) => {
        await mJoinFanClub.mutateAsync({ clubId });
      },
    }),
    [
      creditPercentage,
      qCurrentUser.data,
      qChallenges.data,
      qEducation.data,
      qUserEducations.data,
      qFanClubs.data,
      qAchievements.data,
      qc,
      mSubmitChallenge,
      mCompleteEducation,
      mJoinFanClub,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
};

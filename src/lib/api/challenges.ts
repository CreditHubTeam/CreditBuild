import { apiClient } from "./client";
import { Challenge } from "@/lib/types";

type apiChallengeType = {
  walletAddress: string;
  amount?: number;
  proof?: unknown;
};

export const getChallenges = async (
  walletAddress: string
): Promise<Challenge[]> => apiClient.get(`/user/${walletAddress}/challenges`);

export const postNewChallenge = async (
  challId: string,
  data: apiChallengeType
) => apiClient.post(`/challenges/${challId}/complete`, data);

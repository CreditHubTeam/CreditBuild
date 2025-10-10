import { apiClient } from "./client";
import { Challenge } from "@/lib/types";

type apiChallengeType = {
  walletAddress: string;
  amount?: number;
  proof?: unknown;
};

export const getChallenges = async (): Promise<Challenge[]> =>
  apiClient.get("/challenges");

export const postNewChallenge = async (
  challId: string,
  data: apiChallengeType
) => apiClient.post(`/challenges/${challId}/complete`, data);

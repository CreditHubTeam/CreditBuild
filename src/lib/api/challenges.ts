import { apiClient } from "./client";

type apiChallengeType = {
  walletAddress: string;
  amount?: number;
  proof?: unknown;
};

export const getChallenges = async () => apiClient.get("/challenges");

export const postNewChallenge = async (
  challId: string,
  data: apiChallengeType
) => apiClient.post(`/challenges/${challId}/complete`, data);

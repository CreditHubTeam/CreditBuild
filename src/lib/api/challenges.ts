import { apiClient, handleApiResponse } from "./client";
import { Challenge, ApiResponse } from "@/lib/types";

type CompleteChallengeRequest = {
  walletAddress: string;
  amount?: number;
  proof?: unknown;
};

type CompleteChallengeResponse = {
  id: number;
  walletAddress: string;
  creditScore: number;
  totalPoints: number;
};

export const getChallenges = async (
  walletAddress: string
): Promise<Challenge[]> => {
  const response: ApiResponse<{ userChallenges: Challenge[] }> =
    await apiClient.get(`/users/${walletAddress}/challenges`);
  const data = handleApiResponse(response);
  return data.userChallenges;
};

export const completeChallenge = async (
  challId: string,
  data: CompleteChallengeRequest
): Promise<CompleteChallengeResponse> => {
  const response: ApiResponse<CompleteChallengeResponse> = await apiClient.post(
    `/challenges/${challId}/submit`,
    data
  );
  return handleApiResponse(response);
};

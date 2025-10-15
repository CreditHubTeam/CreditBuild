import { apiClient, handleApiResponse } from "./client";
import { Challenge, ApiResponse } from "@/lib/types";

type CompleteChallengeRequest = {
  walletAddress: string;
  amount: number;
  // proof?: unknown;
};

type CompleteChallengeResponse = {
  challengeId: string;
  isCompleted: boolean;
  pointsAwarded: number;
  creditChange: number;
  newCreditScore: number;
  totalPoints: number;
  achievementUnlocked: string;
};

// Get user's challenges
export const getChallenges = async (
  walletAddress: string
): Promise<Challenge[]> => {
  const response: ApiResponse<Challenge[]> = await apiClient.get(
    `/users/${walletAddress}/challenges`
  );
  return handleApiResponse(response);
};

// Submit challenge
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

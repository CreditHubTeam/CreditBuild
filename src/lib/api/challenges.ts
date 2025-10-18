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

// --- Club challenge ---
export type CreateClubChallengeRequest = {
  walletAddress: string;
  icon?: string;
  title: string;
  description: string;
  category: string;
  points: number;
  creditImpact: number;
  estimatedTimeMinutes?: number;
  typeProof?: string;
  // acceptanceCriteria: string[]; // for off-chain
  // verificationLogic: object; // for on-chain
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

// Get club challenges
// fan-clubs/:id/challenges
export const getClubChallenges = async (
  clubId: string
): Promise<Challenge[]> => {
  const response: ApiResponse<Challenge[]> = await apiClient.get(
    `/fan-clubs/${clubId}/challenges`
  );
  return handleApiResponse(response);
};

// ======= FOR Submit club create challenge =======
export const createClubChallenge = async (
  clubId: string,
  data: CreateClubChallengeRequest
): Promise<Challenge> => {
  const response: ApiResponse<Challenge> = await apiClient.post(
    `/fan-clubs/${clubId}/challenges`,
    data
  );
  return handleApiResponse(response);
};

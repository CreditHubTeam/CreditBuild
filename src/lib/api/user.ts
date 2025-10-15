import { ApiResponse, User } from "../types";
import { apiClient, handleApiResponse } from "./client";

type RegisterRequest = {
  walletAddress: string;
  signature?: string;
};

type RegisterResponse = {
  walletAddress: string;
  creditScore: number;
  streakDays: number;
  totalPoints: string;
  socialPoints: string;
  financialPoints: string;
  educationPoints: string;
  bestStreak: number;
  isRegistered: boolean;
};

// Register user
export const postRegister = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response: ApiResponse<RegisterResponse> = await apiClient.post(
    "/auth/register",
    data
  );
  return handleApiResponse(response);
};
// Get profile user
export const getUser = async (walletAddress: string): Promise<User> => {
  const response: ApiResponse<User> = await apiClient.get(
    `/users/${walletAddress}`
  );
  return handleApiResponse(response);
};

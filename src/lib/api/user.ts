import { ApiResponse, User } from "../types";
import { apiClient, handleApiResponse } from "./client";

type RegisterRequest = {
  walletAddress: string;
  signature?: string;
  referralCode?: string;
};

type RegisterResponse = {
  id: number;
  walletAddress: string;
  creditScore: number;
  totalPoints: number;
};

export const postRegister = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response: ApiResponse<RegisterResponse> = await apiClient.post(
    "/auth/register",
    data
  );
  return handleApiResponse(response);
};

export const getUser = async (walletAddress: string): Promise<User> => {
  const response: ApiResponse<User> = await apiClient.get(
    `/users/${walletAddress}`
  );
  return handleApiResponse(response);
};

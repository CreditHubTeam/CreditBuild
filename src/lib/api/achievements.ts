import { Achievement, ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";

export const getAchievements = async (
  walletAddress: string
): Promise<Achievement[]> => {
  const response: ApiResponse<Achievement[]> = await apiClient.get(
    `/users/${walletAddress}/achievements`
  );
  return handleApiResponse(response);
};

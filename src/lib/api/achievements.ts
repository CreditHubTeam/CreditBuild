import { Achievement, ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";

export const getAchievements = async (
  walletAddress: string
): Promise<Achievement[]> => {
  const response: ApiResponse<{ achievements: Achievement[] }> =
    await apiClient.get(`/users/${walletAddress}/achievements`);
  const data = handleApiResponse(response);
  return data.achievements;
};

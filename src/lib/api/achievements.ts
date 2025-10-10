import { apiClient } from "./client";

export const getAchievements = async (walletAddress: string) =>
  apiClient.get(`/achievements/${walletAddress}`);

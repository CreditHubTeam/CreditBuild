import { apiClient } from "./client";

export const getAchievements = async (walletAddress: string) =>
  apiClient.get(`/user/${walletAddress}/achievements?top=3`);

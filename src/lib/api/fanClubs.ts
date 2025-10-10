import { apiClient } from "./client";
import { ViewFanClubCard } from "../types/view";

type apiFanClub = {
  walletAddress: string;
};

export const getFanClubs = async (): Promise<ViewFanClubCard[]> =>
  apiClient.get("/fan-clubs");

export const postJoinFanClub = (clubId: string, body: apiFanClub) =>
  apiClient.post(`/fan-clubs/${clubId}/join`, body);

import { ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";
import { ViewFanClubCard } from "../types/view";

type JoinFanClubRequest = {
  walletAddress: string;
  fanClubId: number;
};

type JoinFanClubResponse = {
  id: number;
  walletAddress: string;
  creditScore: number;
  totalPoints: number;
};

export const getFanClubs = async (walletAddress: string): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<{ allFanClubs: ViewFanClubCard[] }> =
    // await apiClient.get(`users/${walletAddress}/fan-clubs`);
    await apiClient.get(`/fan-clubs`);
  const data = handleApiResponse(response);
  return data.allFanClubs;
};

export const joinFanClub = async (
  clubId: string,
  body: JoinFanClubRequest
): Promise<JoinFanClubResponse> => {
  const response: ApiResponse<JoinFanClubResponse> = await apiClient.post(
    `/fan-clubs/join`,
    body
  );
  return handleApiResponse(response);
};

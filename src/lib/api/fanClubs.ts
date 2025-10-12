import { ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";
import { ViewFanClubCard } from "../types/view";

type JoinFanClubRequest = {
  walletAddress: string;
};

type JoinFanClubResponse = {
  id: number;
  walletAddress: string;
  creditScore: number;
  totalPoints: number;
};

export const getFanClubs = async (): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<ViewFanClubCard[]> = await apiClient.get(
    "/fan-clubs"
  );
  return handleApiResponse(response);
};

export const joinFanClub = async (
  clubId: string,
  body: JoinFanClubRequest
): Promise<JoinFanClubResponse> => {
  const response: ApiResponse<JoinFanClubResponse> = await apiClient.post(
    `/fan-clubs/${clubId}/join`,
    body
  );
  return handleApiResponse(response);
};

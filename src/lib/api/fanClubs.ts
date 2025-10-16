import { ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";
import { ViewFanClubCard } from "../types/view";

type JoinFanClubRequest = {
  walletAddress: string;
  fanClubId: string;
};

type JoinFanClubResponse = {
  fanClubId: string;
  joinedAt: string;
  kolName: string;
  members: number;
  isJoined: boolean;
};

// Get fan clubs: ADMIN only call
export const getFanClubs = async (): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<ViewFanClubCard[]> =
    // await apiClient.get(`users/${walletAddress}/fan-clubs`);
    await apiClient.get(`/fan-clubs`);
  return handleApiResponse(response);
};

export const getUserFanClubs = async (
  walletAddress: string
): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<ViewFanClubCard[]> = await apiClient.get(
    `/users/${walletAddress}/fan-clubs`
  );
  return handleApiResponse(response);
};

// Join fan club
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

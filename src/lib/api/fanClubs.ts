import { ApiResponse, User } from "../types";
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

export type CreateFanClubRequest = {
  walletAddress: string;
  name: string;
  description: string;
  membershipType: "open" | "invite_only";
  tags: string[];
  logoFile?: File | null;
};

// Get fan clubs: ADMIN only call
export const getFanClubs = async (): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<ViewFanClubCard[]> =
    // await apiClient.get(`users/${walletAddress}/fan-clubs`);
    await apiClient.get(`/fan-clubs`);
  return handleApiResponse(response);
};

// Get user's fan clubs
export const getUserFanClubs = async (
  walletAddress: string
): Promise<ViewFanClubCard[]> => {
  const response: ApiResponse<ViewFanClubCard[]> = await apiClient.get(
    `/users/${walletAddress}/fan-clubs`
  );
  return handleApiResponse(response);
};

// Get fan clubs member
// /fan-clubs/{fanClubId}/members
export const getFanClubMembers = async (fanClubId: string): Promise<User[]> => {
  const response: ApiResponse<User[]> = await apiClient.get(
    `/fan-clubs/${fanClubId}/members`
  );
  return handleApiResponse(response);
};

// Get user's clubs by ID and user wallet address
export const getUserFanClubById = async (
  walletAddress: string,
  clubId: string
): Promise<ViewFanClubCard> => {
  const response: ApiResponse<ViewFanClubCard> = await apiClient.get(
    `/users/${walletAddress}/fan-clubs/${clubId}`
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

// CreateFanClubRequest
export const createFanClub = async (
  data: CreateFanClubRequest
): Promise<ViewFanClubCard> => {
  const response: ApiResponse<ViewFanClubCard> = await apiClient.post(
    `/fan-clubs`,
    data
  );
  return handleApiResponse(response);
};

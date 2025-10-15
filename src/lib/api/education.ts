import { Education, ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";

type CompleteEducationRequest = {
  walletAddress: string;
  // progress: number;
  // proof: unknown;
};

type CompleteEducationResponse = {
  educationId: number;
  isCompleted: boolean;
  pointsAwarded: number;
  totalPoints: number;
  educationPoints: number;
  achievementUnlocked: string;
};

// User get education
export const getUserEducations = async (
  walletAddress: string
): Promise<Education[]> => {
  const response: ApiResponse<Education[]> = await apiClient.get(
    `/users/${walletAddress}/educations?status=no_enrollment`
  );
  return handleApiResponse(response);
};

// Complete education
export const completeEducation = async (
  eduId: string,
  data: CompleteEducationRequest
): Promise<CompleteEducationResponse> => {
  const response: ApiResponse<CompleteEducationResponse> = await apiClient.post(
    `/education/${eduId}/complete`,
    data
  );
  return handleApiResponse(response);
};

// Get all education: ADMIN only call
export const getEducation = async (): Promise<Education[]> => {
  const response: ApiResponse<Education[]> = await apiClient.get("/education");
  return handleApiResponse(response);
};

import { Education, ApiResponse } from "../types";
import { apiClient, handleApiResponse } from "./client";

type CompleteEducationRequest = {
  walletAddress: string;
  progress: number;
  proof: unknown;
};

type CompleteEducationResponse = {
  id: number;
  walletAddress: string;
  creditScore: number;
  totalPoints: number;
};

export const getEducation = async (): Promise<Education[]> => {
  const response: ApiResponse<Education[]> = await apiClient.get("/education");
  return handleApiResponse(response);
};

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

export const getUserEducations = async (
  walletAddress: string
): Promise<Education[]> => {
  const response: ApiResponse<Education[]> = await apiClient.get(
    `/users/${walletAddress}/educations`
  );
  return handleApiResponse(response);
};

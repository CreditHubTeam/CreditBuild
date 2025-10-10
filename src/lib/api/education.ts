import { Education } from "../types";
import { apiClient } from "./client";

type apiEducationType = {
  walletAddress: string;
  progress: number;
  proof: unknown;
};

export const getEducation = async (): Promise<Education[]> =>
  apiClient.get("/education");

export const postNewEducation = async (eduId: string, data: apiEducationType) =>
  apiClient.post(`/education/${eduId}/complete`, data);

export const getEducationBySlug = async (slug: string) =>
  apiClient.get(`/education/${slug}`);

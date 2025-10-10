import { apiClient } from "./client";

type apiRegisterType = {
  walletAddress: string;
  signature?: string;
  referralCode?: string;
};

export const postRegister = (data: apiRegisterType) =>
  apiClient.post("/api/register", data);

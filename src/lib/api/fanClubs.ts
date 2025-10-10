import { api } from "../http";

type apiFanClub = {
  walletAddress: string;
};

export const getFanClubs = async () => api.get("/api/fan-clubs");

export const postJoinFanClub = (clubId: string, body: apiFanClub) =>
  api.post(`/api/fan-clubs/${clubId}/join`, body);

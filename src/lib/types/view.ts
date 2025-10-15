import { Difficulty, TierLevel } from "./common";

export interface ViewFanClubCard {
  id: string;
  kolName: string;
  kolVerified: boolean;
  kolSubtitle?: string; // specialization
  title: string;
  description?: string;
  members: number;
  challenges: number;
  avgEarnings: number; // number hiển thị
  socials: {
    twitter?: number;
    youtube?: number;
    telegram?: number;
  };
  priceLabel: string; // "100 MOCA"
  image?: string; // cover/thumb nếu có
  isJoined: boolean;
}

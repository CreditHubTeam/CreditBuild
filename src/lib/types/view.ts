import { Difficulty, TierLevel } from "./common";

export interface ViewFanClubCard {
  id: number;
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
}

// export interface ViewUserBadge {
//   label: string;            // "Gold"
//   color: 'stone' | 'amber' | 'indigo' | 'rose';
// }

// export interface ViewDashboardUser {
//   displayName: string;      // username rút gọn hoặc rút gọn địa chỉ ví
//   creditScore: number;
//   tier: TierLevel;
//   streakDays: number;
//   totalPoints: number;
//   badge: ViewUserBadge;
// }

// export interface ViewChallengeCard {
//   id: number;
//   title: string;
//   subtitle?: string;
//   points: number;
//   difficulty: Difficulty;
//   icon?: string;
//   completed: boolean;
//   progress?: number;        // 0..1
// }

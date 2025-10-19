// src/lib/types/api.ts
import { ISODate } from "./common";

export interface ApiFanClubCard {
  id: number; // fan_clubs.id
  title: string; // club_name (hoặc format sẵn)
  description?: string; // fan_clubs.description
  image?: string; // fan_clubs.club_image
  price: { amount: number; currency: "MOCA" }; // membership_fee
  stats: {
    members: number; // current_members
    challenges: number; // COUNT(challenges.id)
    avgEarnings: number; // computed (MOCA or points)
  };
  kol: {
    id: number; // kols.id
    name: string; // kol_name
    verified: boolean; // verification_status === 'verified'
    specialization?: string; // specialization
    socials?: {
      // kols.social_followers JSONB
      twitter?: number;
      youtube?: number;
      telegram?: number;
    };
  };
  contractAddress?: `0x${string}`; // fan_clubs.contract_address (nếu cần)
  createdAt?: ISODate; // fan_clubs.created_at (optional)\
  isJoin: boolean; // user đã join chưa (từ API)
}

// export const apiFanClubs = [
//   {
//     id: 1,
//     kol: {
//       id: 101,
//       kol_name: "Crypto Titan",
//       verification_status: "verified",
//       specialization: "DeFi Trading",
//       social_followers: {
//         twitter: 125000,
//         youtube: 89000,
//         telegram: 45000,
//       },
//       commission_rate: 10.0,
//       total_earnings: 500000,
//       created_at: "2025-10-01T09:00:00Z",
//     },
//     club_name: "Titan's DeFi Mastery Club",
//     description:
//       "Learn advanced DeFi strategies from a seasoned crypto investor with 5+ years experience.",
//     entry_requirements: {},
//     membership_fee: 100,
//     max_members: 5000,
//     current_members: 2847,
//     club_image: "/images/fanclubs/titan-defi.png",
//     contract_address: "0xAAA111BBB222CCC333DDD444EEE555FFF666000",
//     created_at: "2025-10-02T09:00:00Z",
//     stats: {
//       challenges: 12,
//       avgEarnings: 850,
//     },
//   },
// ];

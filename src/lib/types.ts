import { ViewFanClubCard } from "./types/view";

// API Response Types
export type ApiResponse<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: {
        message: string;
        code: string;
      };
    };

export type Challenge = {
  id: string;
  type: string;
  category: string;
  name: string;
  description?: string;
  points: number;
  creditImpact: number;
  isCompleted: boolean;
  // icon?: string;
  // estimatedTimeMinutes?: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type Education = {
  id: number;
  title: string;
  description: string;
  duration: string;
  points: number;
  isCompleted: boolean;
};

export type WalletProvider = {
  id:
    | "baseAccount"
    | "walletConnect"
    | "io.metamask"
    | "app.subwallet"
    | string;
  name: string;
  // type: "metamask" | "coinbase" | "walletconnect" | "generic";
  icon: string;
  description: string;
  downloadUrl?: string;
  available?: boolean;
};

export type User = {
  //  "walletAddress": "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
  //       "creditScore": 480,
  //       "streakDays": 5,
  //       "totalPoints": 210,
  //       "isRegistered": true,
  //       "bestStreak": 5


  walletAddress: string;
  creditScore: number;
  totalChallenges: number;
  streakDays: number;
  totalPoints: number;
  isRegistered: boolean;
  bestStreak: number;
};

export type Network = {
  chainId: string;
  chainIdDecimal: number;
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
};

export type AppData = {
  sampleUser: User;
  challenges: Challenge[];
  achievements: Achievement[];
  fanClubs: ViewFanClubCard[];
  walletProviders: WalletProvider[];
  creditcoinNetwork: Network;
  contractAddress: string;
  educationalContent: Education[];
};

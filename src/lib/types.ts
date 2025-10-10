import { ViewFanClubCard } from "./types/view";

export type Challenge = {
  id: number;
  type: string;
  category: string;
  name: string;
  description?: string;
  points: number;
  creditImpact: number;
  icon?: string;
  estimatedTimeMinutes?: number;
  isCompleted: boolean;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type Education = {
  id: string;
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

export type Challenge = {
  type: string;
  name: string;
  description: string;
  points: number;
  creditImpact: number;
  category: "daily" | "weekly";
  icon: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type WalletProvider = {
  id: "injected" | "baseAccount"| "walletConnect" | "io.metamask" | "app.subwallet" | string;
  name: string;
  // type: "metamask" | "coinbase" | "walletconnect" | "generic";
  icon: string;
  description: string;
  downloadUrl?: string;
  available?: boolean;
};

export type User = {
  address: string;
  creditScore: number;
  totalChallenges: number;
  streakDays: number;
  totalPointsEarned: number;
  isRegistered: boolean;
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
  walletProviders: WalletProvider[];
  creditcoinNetwork: Network;
  contractAddress: string;
  educationalContent: {
    id: string;
    title: string;
    description: string;
    duration: string;
    points: number;
  }[];
};

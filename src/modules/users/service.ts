import { UsersRepo } from "./repo";
export const UsersService = {
  register: async (walletAddress: string, username?: string) => {
    const user = await UsersRepo.upsertByWallet(walletAddress, username);
    // Convert BigInt to string for JSON serialization
    return {
      ...user,
      totalPoints: user.totalPoints.toString(),
    };
  },
  profileByAddr: async (walletAddress: string) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) return null;
    const stats = await UsersRepo.stats(user.id);
    return {
      user: {
        ...user,
        totalPoints: user.totalPoints.toString(),
      },
      stats,
    };
  },
};

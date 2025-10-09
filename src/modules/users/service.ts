/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepo } from "./repo";
export const UsersService = {
  register: async (walletAddress: string, username?: string) => {
    const user = await UsersRepo.upsertByWallet(walletAddress, username);
    // Convert BigInt to string for JSON serialization
    return {
      ...user,
      total_points: (user.total_points ?? BigInt(0)).toString(),
      social_points: (user.social_points ?? BigInt(0)).toString(),
      financial_points: (user.financial_points ?? BigInt(0)).toString(),
      education_points: (user.education_points ?? BigInt(0)).toString(),
    };
  },
  profileByAddr: async (walletAddress: string) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) return null;
    const stats = await UsersRepo.stats(user.id);
    
    // Convert BigInt fields to strings for JSON serialization
    const convertedUser = {
      ...user,
      total_points: (user.total_points ?? BigInt(0)).toString(),
      social_points: (user.social_points ?? BigInt(0)).toString(),
      financial_points: (user.financial_points ?? BigInt(0)).toString(),
      education_points: (user.education_points ?? BigInt(0)).toString(),
      // Convert pointLedgers delta fields
      pointLedgers: user.pointLedgers?.map((ledger: any) => ({
        ...ledger,
        delta: ledger.delta.toString()
      })) || []
    };

    return {
      user: convertedUser,
      stats: {
        ...stats,
        totalPoints: stats.totalPoints.toString(),
      },
    };
  },
};

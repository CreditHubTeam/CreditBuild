import { challengeRepository } from "@/repositories/challengeRepository";
import { userAchievementRepository } from "@/repositories/userAchievementRepository";
import { userChallengeRepository } from "@/repositories/userChallengeRepository";
import { userRepository } from "@/repositories/userRepository";

const userRepo = new userRepository();
const userChallengeRepo = new userChallengeRepository();
const challengeRepo = new challengeRepository();
const userAchievementRepo = new userAchievementRepository();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeUser = (u: any) => {
  if (!u) return null;
  return {
    walletAddress: u.wallet_address ?? null,
    creditScore: u.credit_score ?? null,
    totalChallenges: u.total_challenges ?? 0,
    streakDays: u.streak_days ?? 0,
    // Convert BigInt -> string to avoid JSON serialization error
    totalPoints: u.total_points !== undefined ? u.total_points.toString() : "0",
    socialPoints: u.social_points !== undefined ? u.social_points.toString() : "0",
    financialPoints: u.financial_points !== undefined ? u.financial_points.toString() : "0",
    educationPoints: u.education_points !== undefined ? u.education_points.toString() : "0",
    bestStreak: u.streak_days ?? 0,
    isRegistered: true,
    // include other fields you need, converting BigInt as above
  };
};

interface Challenge {
  id: number;
  type: string;
  category: string;
  name: string;
  description?: string;
  points: number;
  creditImpact: number;
  icon?: string;
  estimatedTimeMinutes?: number;
  isCompleted: boolean; // false nếu chưa hoàn thành
}

export const UsersService = {
// [x] registerUser(initialSettings): Đăng ký người dùng mới với cài đặt ban đầu (mục tiêu, hồ sơ).
    register: async (walletAddress: string, signature?: string, referralCode?: string) => {
        const isExist = await userRepo.isExistByWalletAddress(walletAddress);
        if (isExist) {
            const existingUser = await userRepo.getByWalletAddress(walletAddress);
            // use serializer to ensure no BigInt remains
            return serializeUser(existingUser) ?? {
                walletAddress,
                creditScore: 300,
                totalChallenges: 0,
                streakDays: 0,
                totalPoints: "0",
                bestStreak: 0,
                isRegistered: true,
            };
        }

        const newUser = await userRepo.create({
            wallet_address: walletAddress,
            moca_id: "",
            username: "",
            credit_score: 300,
            streak_days: 0,
            total_challenges: 0,
            total_points: BigInt(0),
            social_points: BigInt(0),
            financial_points: BigInt(0),
            education_points: BigInt(0),
            tier_level: "bronze",
            reputation_score: 0,
            referral_code: referralCode ?? undefined,
            kyc_status: "pending",
            registered_at: new Date(),
            last_activity: new Date(),
        });

        return serializeUser(newUser);
    },
// [x] get UserChallenges(walletAddress): Lấy danh sách thử thách của người dùng.
    getUserChallenges: async (walletAddress: string): Promise<Challenge[]> => {
        
        const result: Challenge[] = [];
        // Lấy user theo walletAddress
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");
        const userId = user.id;
        // Lấy userChallenges từ repository
        const userChallenges = await userChallengeRepo.getByUserId(userId);
        //duyệt qua các userChallenges
        for (const userChallenge of userChallenges) {
            //== duyệt thông tin của challenge
            const challenge = await challengeRepo.findById(userChallenge.challengeId);
            // console.log(challenge);
            result.push({
                id: userChallenge.id,
                type: challenge!.type,
                category: challenge!.category!,
                name: challenge!.name,
                description: challenge!.description!,
                points: challenge!.points,
                creditImpact: challenge!.creditImpact,
                icon: challenge!.icon!,
                estimatedTimeMinutes: challenge!.estimatedTimeMinutes!,
                isCompleted: userChallenge.status !== "PENDING",
            })
        }
        console.log("result", result)
        return result;
    },

// [] getUserAchievements(walletAdress, top=null): lấy danh sách thành tựu của người dùng
    getUserAchievements: async (walletAddress: string, top?: number) => {
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");

        const achievements = await userAchievementRepo.getAllByUserId(user.id);
        //== sắp xếp theo thời gian giảm dần
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        achievements.sort((a: any, b: any) => {
          const ta = a?.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
          const tb = b?.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
          return tb - ta;
        });
        if (top) {
            // Giới hạn số lượng thành tựu trả về
            return achievements.slice(0, top);
        }
        return achievements;
    }

// updateProfileMetrics(): Cập nhật các chỉ số trên hồ sơ.

// [] getUserProfile(userId): Lấy hồ sơ người dùng.
// [] updateUserSettings(userId, settings): Cập nhật cài đặt người dùng (mục tiêu, sở thích).
// [] getUserAchievements(userId): Lấy thành tích của người dùng.
}
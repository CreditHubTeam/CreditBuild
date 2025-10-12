import { achievementRepository } from "@/repositories/achievementRepository";
import { challengeRepository } from "@/repositories/challengeRepository";
import { educationRepository } from "@/repositories/educationRepository";
import { userAchievementRepository } from "@/repositories/userAchievementRepository";
import { userChallengeRepository } from "@/repositories/userChallengeRepository";
import { userEducationRepository } from "@/repositories/userEducationRepository";
import { userRepository } from "@/repositories/userRepository";
import { randomUUID } from "crypto";

const userRepo = new userRepository();
const userChallengeRepo = new userChallengeRepository();
const challengeRepo = new challengeRepository();
const userAchievementRepo = new userAchievementRepository();
const userEducationRepo = new userEducationRepository();
const educationRepo = new educationRepository();
const achievementRepo = new achievementRepository();

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeUserProfile = (u: any) => {
    if (!u) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toNumber = (v: any) => {
        if (v === undefined || v === null) return 0;
        if (typeof v === "bigint") return Number(v);
        const n = Number(v);
        return Number.isNaN(n) ? 0 : n;
    };

    return {
        walletAddress: u.wallet_address ?? null,
        creditScore: u.credit_score ?? null,
        totalChallenges: u.total_challenges ?? 0,
        streakDays: u.streak_days ?? 0,
        // Convert BigInt/string/other -> number
        totalPoints: toNumber(u.total_points),
        isRegistered: true,
        bestStreak: u.streak_days ?? 0
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
            moca_id: randomUUID(), //==randomUUID()
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

// [x] getUserAchievements(walletAdress, top=null): lấy danh sách thành tựu của người dùng
    getUserAchievements: async (walletAddress: string, top?: number) => {
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");

        let userAchievements = await userAchievementRepo.getAllByUserId(user.id);
        //== sắp xếp theo thời gian giảm dần
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userAchievements.sort((a: any, b: any) => {
          const ta = a?.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
          const tb = b?.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
          return tb - ta;
        });
        if (top) {
            // Giới hạn số lượng thành tựu trả về
            userAchievements = userAchievements.slice(0, top);
        }
        // eslint-disable-next-line prefer-const
        let result = [];
        for (const ach of userAchievements) {
            // tìm thông tin của achievement theo ach.achievementId
            const achievement = await achievementRepo.findById(ach.achievementId);
            result.push({
                id: ach.id,
                name: achievement!.name,
                description: achievement!.description,
                icon: achievement!.icon,
                unlocked: true, //== luôn true vì chỉ lấy những thành tựu đã mở
            });
        }
        //== chèn thêm các achievement mà user chưa có, với unlocked là false
        const allAchievements = await achievementRepo.findAll();
        for (const achievement of allAchievements) {
            const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
            if (!userAchievement) {
                result.push({
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    unlocked: false,
                });
            }
        }
        //=====================================
        return result;
    },
// [x] getUserEducation(walletAddress, status): Lấy danh sách các khóa học của người dùng theo trạng thái (chưa đăng ký, đang học, đã hoàn thành).
    getUserEducation: async (walletAddress: string, status?: "no_enrollment" | "in_progress" | "completed") => {
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");
        const allEducations = await educationRepo.findAll();
        // lấy tất cả userEducations của user
        const userEducations = await userEducationRepo.getByUserId(user.id);
        if(status == "no_enrollment"){
            //lấy allEducations - userEducations
            const enrolledEducationIds = userEducations.map(ue => ue.educationId);
            const noEnrollmentEducations = allEducations.filter(e => !enrolledEducationIds.includes(e.id));
            // eslint-disable-next-line prefer-const
            let result = [];
            for(const edu of noEnrollmentEducations){
                result.push({
                    id: edu.id,
                    title: edu.title,
                    description: edu.description,
                    duration: edu.duration!.toString() + " min",
                    points: edu.points,
                    isCompleted: false
                });
            }
            return result;
        }
        else if(status == "completed"){
            // eslint-disable-next-line prefer-const
            let result = [];
            for(const userEdu of userEducations){
                //tìm education theo userEdu.educationId
                const education = await educationRepo.findById(userEdu.educationId);
                if(education){
                    result.push({
                        id: education.id,
                        title: education.title,
                        description: education.description,
                        duration: education.duration!.toString() + " min",
                        points: education.points,
                        isCompleted: true
                    });
                }
            }
            return result;
        }
        return allEducations;
    },

// updateProfileMetrics(): Cập nhật các chỉ số trên hồ sơ.

// [] getUserProfile(userId): Lấy hồ sơ người dùng.
    getUserProfile: async (walletAddress: string) => {
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");
        return serializeUserProfile(user);
    }
// [] updateUserSettings(userId, settings): Cập nhật cài đặt người dùng (mục tiêu, sở thích).
// [] getUserAchievements(userId): Lấy thành tích của người dùng.
}
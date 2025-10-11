import { educationRepository } from "@/repositories/educationRepository";
import { userEducationRepository } from "@/repositories/userEducationRepository";
import { userRepository } from "@/repositories/userRepository";


const userRepo = new userRepository();
const educationRepo = new educationRepository();
const userEducationRepo = new userEducationRepository();

export const EducationsService = {
// getLearningContent(): Lấy nội dung học tập.
// rewardPointsForCompletion(userId, moduleId): Thưởng điểm khi hoàn thành mô-đun.

// [] getAllEducationalModules(): Lấy tất cả mô-đun giáo dục.
// [] startModule(userId, moduleId): Bắt đầu mô-đun giáo dục.

// [] completeEducation(walletAddress, educationId): Hoàn thành education
    completeEducation: async (walletAddress: string, educationId: number) => {
        // Tìm user theo walletAddress
        const user = await userRepo.getByWalletAddress(walletAddress);
        if (!user) throw new Error("User not found");

        // Tìm education theo educationId
        const education = await educationRepo.findById(educationId);
        if (!education) throw new Error("Education not found");

        //== tạo một userEducation mới với completedAt là ngày hiện tại
        const completed = await userEducationRepo.create({
            user: { connect: { id: user.id } },
            education: { connect: { id: educationId } },
            completedAt: new Date()
        })
        return {
            educationId: completed.educationId,
            isCompleted: true,
            pointsAwarded: education.points || 0,
            totalPoints: user.credit_score + (education.points || 0),
            educationPoints: education.points || 0,
            achievementUnlocked: null //== để tạm null, sau này có thể thêm tính năng achievement

        };
    }
}
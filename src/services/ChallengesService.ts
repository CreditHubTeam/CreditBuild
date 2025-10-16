import { userChallengeRepository } from "@/repositories/userChallengeRepository";
import { userRepository } from "@/repositories/userRepository";

//==
type Proof =
  | { type: "url"; value: string }
  | { type: "tx"; value: `0x${string}` }
  | { type: "answer"; value: string }
  | { type: "file"; value: string };

const userRepo = new userRepository();
const userChallengeRepo = new userChallengeRepository();

export const ChallengesService = {
    
// getDailyWeeklyChallenges(): Lấy các thử thách hàng ngày/hàng tuần.
// submitProof(challengeId, amount, proof, timestamp, userSignature): Gửi bằng chứng hoàn thành thử thách.
// markCompletion(challengeId, userId): Đánh dấu hoàn thành thử thách.
// validateProof(proof, paymentAPI, imageVerification): Xác thực bằng chứng.
// checkRules(challengeId, userId): Kiểm tra các quy tắc thử thách.
// storeUserChallengeRecord(record): Lưu trữ bản ghi thử thách của người dùng.

// [x] submitChallenge(challengeId, walletAddress, amount, proof): Gửi thử thách đã hoàn thành.
    submitChallenge: async (challengeId: string, walletAddress: `0x${string}`, amount?: number, proof?: Proof) => {
        // lấy user từ walletAddress
        const user = await userRepo.getByWalletAddress(walletAddress);
        if(!user){
            throw new Error("User not found");
        }
        // lấy userChallenge từ userId và challengeId
        const userChallenge = await userChallengeRepo.getByUserIdAndChallengeId(user.id, challengeId);
        // console.log("Found userChallenge:", userChallenge);
        if(!userChallenge){
            throw new Error("User challenge not found");
        }
        // sửa trạng thái của userChallenge thành SUBMITTED
        await userChallengeRepo.update(userChallenge.id, { status: "SUBMITTED" });
        // trả về dữ liệu

        //update user credit_score và total_points
        await userRepo.update(user.id, {
            credit_score: user.credit_score + (userChallenge.credit_change || 0),
            total_points: Number(user.total_points) + (userChallenge.points_awarded || 0)
        });
        return { 
            "challengeId": challengeId,
            "isCompleted": true,
            "pointsAwarded": userChallenge.points_awarded || 0,
            "creditChange": userChallenge.credit_change || 0,
            "newCreditScore": user.credit_score + (userChallenge.credit_change || 0),
            "totalPoints": Number(user.total_points) + (userChallenge.points_awarded || 0),
            "achievementUnlocked": "" //== hiện tại chưa có achievement
        };

    }


// [] getAllChallenges(): Lấy tất cả thử thách có sẵn.
// [] getUserChallenges(userId): Lấy thử thách của người dùng.
// [] getChallengeDetails(challengeId): Lấy chi tiết thử thách.
// [] getChallengeByStatus(userId, status): Lấy thử thách theo trạng thái (đang diễn ra, đã hoàn thành).
// [] startChallenge(challengeId, userId): Bắt đầu thử thách.

}
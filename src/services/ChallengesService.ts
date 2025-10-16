import { challengeRepository } from "@/repositories/challengeRepository";
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
const challengeRepo = new challengeRepository();

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
        // // lấy userChallenge từ userId và challengeId
        // let userChallenge = await userChallengeRepo.getByUserIdAndChallengeId(user.id, challengeId);
        // // console.log("Found userChallenge:", userChallenge);
        // if(!userChallenge){
            
        // }
        //tim challenge
            const challenge = await challengeRepo.findById(challengeId);
            if(!challenge){
                throw new Error("Challenge not found");
            }
            //tao moi userChallenge neu chua co
            const userChallenge = await userChallengeRepo.create({
                user: { connect: { id: user.id } }, // Liên kết với bảng users
                challenge: { connect: { id: challengeId } }, // Liên kết với bảng challenges
                status: "SUBMITTED",
                points_awarded: challenge.points,
                credit_change: challenge.credit_impact,
                proof: proof ? JSON.stringify(proof) : undefined,
            });
        // // sửa trạng thái của userChallenge thành SUBMITTED
        // await userChallengeRepo.update(userChallenge.id, { status: "SUBMITTED" });
        // trả về dữ liệu
        // console.log("points_awarded:", userChallenge.points_awarded);
        // console.log("credit_change:", userChallenge.credit_change);
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
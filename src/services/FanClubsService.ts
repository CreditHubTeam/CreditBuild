import { fanClubMembershipRepository } from "@/repositories/fanClubMembershipRepository";
import { fanClubRepository } from "@/repositories/fanClubRepository";
import { userRepository } from "@/repositories/userRepository";

const fanClubRepo = new fanClubRepository();
const fanClubMembershipRepo = new fanClubMembershipRepository();
const userRepo = new userRepository();

export const FanClubsService = {

    // [x] getAllFanClubs(): Lấy danh sách câu lạc bộ người hâm mộ.
    getAllFanClubs: async () => {

        //clb
        const clubs = await fanClubRepo.findAll();
        //kol
        
        // eslint-disable-next-line prefer-const
        let result = [];
        for(const club of clubs){
            //tim user kol
            const kols = await userRepo.getById(club.owner_id);
            result.push({
                id: club.id,
                kolName: kols?.username || "Unknown",
                kolVerified: kols?.kyc_status == "pending" ? false : true,
                // kolSubtitle: kols?.specialization || "",
                title: club.name,
                description: club.description,
                members: club.current_members || 0,
                challenges: 2, //== tạm thời để 2, sau này có thể thêm bảng Challenge và liên kết với FanClub
                avgEarnings: 15, //== tạm thời để 15, sau này có thể tính toán dựa trên dữ liệu thực tế
                socials: {
                    twitter: "twitter.com/test", //== tạm thời để link test, sau này có thể lấy từ kols
                    instagram: "instagram.com/test", //== tạm thời để link test, sau này có thể lấy từ kols
                    youtube: "youtube.com/test" //== tạm thời để link test, sau này có thể lấy từ kols
                },
                priceLabel: club.membership_fee > 0 ? `${club.membership_fee} MOCA` : "Free",
                image: club.image_url || "https://via.placeholder.com/300x150.png?text=Fan+Club", //== tạm thời để ảnh placeholder, sau này có thể lấy từ club.club_image
                isJoined: false //== mặc định chưa tham gia, khi lấy theo user sẽ cập nhật lại
            })
        }
        return result;
    },

// [] getFanClubDetails(clubId): Lấy chi tiết câu lạc bộ người hâm mộ.
// [] joinFanClub(userId, clubId): Tham gia câu lạc bộ người hâm mộ.
joinFanClub: async (walletAddress: string, clubId: string) => {
    // Tìm user theo walletAddress
    const user = await userRepo.getByWalletAddress(walletAddress);
    if (!user) throw new Error("User not found");
    //tìm club theo clubId
    const club = await fanClubRepo.findById(clubId);
    if (!club) throw new Error("Fan Club not found");
    //tim owner cua club
    const owner = await userRepo.getById(club.owner_id);
    if (!owner) throw new Error("Owner not found");

    //==kiểm tra user đã tham gia club chưa
    //tạo fan club membership
    const existingMembership = await fanClubMembershipRepo.isUserInClub(user.id, clubId);
    if (existingMembership) throw new Error("User already joined this club");

    const result = await fanClubMembershipRepo.create({
        user: { connect: { id: user.id } },
        club: { connect: { id: clubId } },
    });
    
    return {
        fanClubId: result.club_id,
        joinedAt: result.joined_at,
        kolName: owner.username,
        members: club.current_members + 1, //== giả sử số thành viên tăng lên 1 ngay khi tham gia, sau này có thể cập nhật từ database
        isJoined: true //== luôn tham gia thành công
    }

},

// getMembershipRequirements(clubId): Lấy yêu cầu tham gia câu lạc bộ.
// getClubMembers(clubId): Lấy danh sách thành viên câu lạc bộ.

}
import { fanClubRepository } from "@/repositories/fanClubRepository";
import { kolRepository } from "@/repositories/kolRepository";

const fanClubRepo = new fanClubRepository();
const kolRepo = new kolRepository();

export const FanClubsService = {

// [] getAllFanClubs(): Lấy danh sách câu lạc bộ người hâm mộ.
getAllFanClubs: async () => {

    //clb
    const clubs = await fanClubRepo.findAll();
    //kol
    
    // eslint-disable-next-line prefer-const
    let result = [];
    for(const club of clubs){
        const kols = await kolRepo.findById(club.kolId);
        result.push({
            id: club.id,
            kolName: kols?.kol_name || "Unknown",
            kolVerified: kols?.verification_status || false,
            kolSubtitle: kols?.specialization || "",
            title: club.club_name,
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
            image: club.club_image || "https://via.placeholder.com/300x150.png?text=Fan+Club" //== tạm thời để ảnh placeholder, sau này có thể lấy từ club.club_image
        })
    }
    return result;
},

// [] getFanClubDetails(clubId): Lấy chi tiết câu lạc bộ người hâm mộ.
// [] joinFanClub(userId, clubId): Tham gia câu lạc bộ người hâm mộ.


// getMembershipRequirements(clubId): Lấy yêu cầu tham gia câu lạc bộ.
// getClubMembers(clubId): Lấy danh sách thành viên câu lạc bộ.

}
import { ApiFanClubCard } from "@/lib/types/api";
import { ViewFanClubCard } from "@/lib/types/view";

export function toViewFanClubCard(x: ApiFanClubCard): ViewFanClubCard {
  const priceLabel = `${x.price.amount} ${x.price.currency}`;
  return {
    id: x.id,
    kolName: x.kol.name,
    kolVerified: x.kol.verified,
    kolSubtitle: x.kol.specialization,
    title: x.title,
    description: x.description,
    members: x.stats.members,
    challenges: x.stats.challenges,
    avgEarnings: x.stats.avgEarnings,
    socials: x.kol.socials ?? {},
    priceLabel,
    image: x.image,
    isJoin: x.isJoin,
  };
}

// ====== Example used in the app ======
// import { useQuery } from "@tanstack/react-query";
// import { toViewFanClubCard } from "@/lib/mappers/fanClub";
// import { api } from "@/lib/http";

// function useFanClubs() {
//   return useQuery({
//     queryKey: ["fanClubs"],
//     queryFn: async () => {
//       const { data } = await api.get("/fan-clubs");
//       return data.map(toViewFanClubCard);
//     },
//   });
// }

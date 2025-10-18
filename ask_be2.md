# FE request

## Create Club // DONE

### POST /api/fan-clubs

```bash
{
  name: string;
  description: string;
  membershipType: "open" | "invite_only";
  tags: string[];
  logoFile?: File | null;
};
```

```bash
{
  id: string;
  kolName: string;
  kolVerified: boolean;
  kolSubtitle?: string; // specialization
  title: string;
  description?: string;
  members: number;
  challenges: number;
  avgEarnings: number; // number hiển thị
  socials: {
    twitter?: number;
    youtube?: number;
    telegram?: number;
  };
  priceLabel: string; // "100 MOCA"
  image?: string; // cover/thumb nếu có
  isJoined: boolean;
}
```

## Create Challenge for Club

### POST /api/fan-clubs/{fanClubId}/challenges

```bash
export type CreateClubChallengeRequest = {
  walletAddress: string;
  icon?: string;
  title: string;
  description: string;
  category: string;
  points: number;
  creditImpact: number;
  estimatedTimeMinutes?: number;
  typeProof?: string;
};
```

```bash
# Res thì giống đối tượng Challenge là xong
export type Challenge = {
  id: string;
  type: string;
  category: string;
  name: string;
  description?: string;
  points: number;
  creditImpact: number;
  isCompleted: boolean;
  icon?: string;
  estimatedTimeMinutes?: number;
};
```

```bash

```

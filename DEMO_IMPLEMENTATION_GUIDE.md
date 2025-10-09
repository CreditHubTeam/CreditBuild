# Implementation Guide: Daily Challenge System

## Overview

Hệ thống demo đơn giản cho phép người dùng làm nhiệm vụ hàng ngày, tích điểm, đạt achievements và hoàn thành education content.

## Current Code Backup

### Original `weeklyCount` Function

```typescript
// src/modules/challenges/repo.ts (BACKUP - ORIGINAL VERSION)
weeklyCount: (userId: number, challengeId: number) =>
  prisma.userChallenge.count({
    where: {
      userId,
      challengeId,
      createdAt: { gte: new Date(Date.now() - 7 * 86400 * 1000) },
    },
  }),
```

## Feature Requirements

### 1. Daily Challenge System

- **4 nhiệm vụ mỗi ngày** được random từ seed data
- **Hoàn thành nhiệm vụ** → tích điểm → lưu offchain
- **Ngày mới** → 4 nhiệm vụ mới (bất kể ngày cũ hoàn thành hay chưa)
- **Streak system**: Chỉ tăng khi user làm ít nhất 1 nhiệm vụ trong ngày

### 2. Achievement System

- Tự động check điều kiện sau khi hoàn thành nhiệm vụ
- Nếu đủ điều kiện → tạo và add vào database (offchain)

### 3. Education System

- User click → FE hiển thị popup xác nhận
- User click OK → Call API → Mark as completed

## Implementation Steps

### Step 1: Update Challenge Repository

**File:** `src/modules/challenges/repo.ts`

```typescript
import { prisma } from "@/core/db";

export const ChallengesRepo = {
  // Lấy tất cả challenges để random
  list: () => prisma.challenge.findMany({ orderBy: { createdAt: "desc" } }),
  
  byId: (id: number) => prisma.challenge.findUnique({ where: { id } }),
  
  // Lấy 4 challenges ngẫu nhiên cho ngày hôm nay
  getDailyChallenges: async (count: number = 4) => {
    const allChallenges = await prisma.challenge.findMany();
    // Shuffle và lấy N challenges
    const shuffled = allChallenges.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
  
  // Check xem user đã làm challenge trong ngày chưa
  hasCompletedToday: async (userId: number, challengeId: number) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const count = await prisma.userChallenge.count({
      where: {
        userId,
        challengeId,
        status: { in: ["APPROVED", "CLAIMED"] },
        createdAt: { gte: startOfDay },
      },
    });
    return count > 0;
  },
  
  // Đếm số challenges đã hoàn thành trong ngày
  getDailyCompletedCount: async (userId: number) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    return prisma.userChallenge.count({
      where: {
        userId,
        status: { in: ["APPROVED", "CLAIMED"] },
        createdAt: { gte: startOfDay },
      },
    });
  },
  
  // Tạo challenge attempt
  createAttempt: (data: {
    userId: number;
    challengeId: number;
    amount?: number;
    proof?: any;
    status?: string;
  }) => prisma.userChallenge.create({ 
    data: {
      ...data,
      status: data.status || "APPROVED", // Demo mode: auto approve
    }
  }),
  
  // Update attempt
  updateAttempt: (id: number, data: any) =>
    prisma.userChallenge.update({ where: { id }, data }),
};
```

### Step 2: Update Challenge Service

**File:** `src/modules/challenges/service.ts`

```typescript
import { ChallengesRepo } from "./repo";
import { UsersRepo } from "@/modules/users/repo";
import { AchievementsService } from "@/modules/achievements/service";

export const ChallengesService = {
  // Lấy daily challenges cho user
  getDailyChallenges: async (walletAddress: string) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) throw new Error("User not found");
    
    const challenges = await ChallengesRepo.getDailyChallenges(4);
    
    // Check xem challenge nào đã completed hôm nay
    const challengesWithStatus = await Promise.all(
      challenges.map(async (challenge) => {
        const completed = await ChallengesRepo.hasCompletedToday(
          user.id,
          challenge.id
        );
        return {
          ...challenge,
          completedToday: completed,
        };
      })
    );
    
    return challengesWithStatus;
  },
  
  // Submit/Complete challenge
  completeChallenge: async (
    walletAddress: string,
    challengeId: number,
    proof?: any
  ) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) throw new Error("User not found");
    
    const challenge = await ChallengesRepo.byId(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    
    // Check đã complete hôm nay chưa
    const alreadyCompleted = await ChallengesRepo.hasCompletedToday(
      user.id,
      challengeId
    );
    if (alreadyCompleted) {
      throw new Error("Already completed this challenge today");
    }
    
    // Tạo attempt
    const attempt = await ChallengesRepo.createAttempt({
      userId: user.id,
      challengeId: challenge.id,
      proof,
      status: "APPROVED", // Demo mode: auto approve
    });
    
    // Update user points và stats
    const newPoints = Number(user.totalPoints) + challenge.points;
    const newCreditScore = user.creditScore + challenge.creditImpact;
    const newTotalChallenges = user.totalChallenges + 1;
    
    // Check xem đây có phải challenge đầu tiên trong ngày không (để update streak)
    const completedToday = await ChallengesRepo.getDailyCompletedCount(user.id);
    const shouldUpdateStreak = completedToday === 1; // Challenge đầu tiên trong ngày
    
    await UsersRepo.update(user.id, {
      totalPoints: BigInt(newPoints),
      creditScore: newCreditScore,
      totalChallenges: newTotalChallenges,
      streakDays: shouldUpdateStreak ? user.streakDays + 1 : user.streakDays,
    });
    
    // Check achievements
    await AchievementsService.checkAndAward(user.id);
    
    return {
      success: true,
      pointsEarned: challenge.points,
      creditChange: challenge.creditImpact,
      newTotalPoints: newPoints,
      newCreditScore: newCreditScore,
      streakUpdated: shouldUpdateStreak,
    };
  },
};
```

### Step 3: Create Users Repository Update Method

**File:** `src/modules/users/repo.ts`

Add this method:

```typescript
update: (id: number, data: {
  totalPoints?: bigint;
  creditScore?: number;
  totalChallenges?: number;
  streakDays?: number;
  username?: string;
}) => prisma.user.update({ where: { id }, data }),
```

### Step 4: Create Achievements Service

**File:** `src/modules/achievements/service.ts` (NEW)

```typescript
import { prisma } from "@/core/db";

export const AchievementsService = {
  // Check và award achievements cho user
  checkAndAward: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    
    const achievements = await prisma.achievement.findMany();
    
    for (const achievement of achievements) {
      // Check xem user đã có achievement chưa
      const hasAchievement = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });
      
      if (hasAchievement) continue;
      
      // Check điều kiện từ achievement.conditions
      const conditions = achievement.conditions as any;
      let qualifies = false;
      
      // Example conditions check
      if (conditions.minChallenges && user.totalChallenges >= conditions.minChallenges) {
        qualifies = true;
      }
      if (conditions.minStreak && user.streakDays >= conditions.minStreak) {
        qualifies = true;
      }
      if (conditions.minPoints && Number(user.totalPoints) >= conditions.minPoints) {
        qualifies = true;
      }
      
      // Award achievement nếu đủ điều kiện
      if (qualifies) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
        
        console.log(`🏆 User ${userId} earned achievement: ${achievement.name}`);
      }
    }
  },
  
  // Lấy tất cả achievements của user
  getUserAchievements: async (userId: number) => {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
  },
};
```

### Step 5: Create Education Service

**File:** `src/modules/education/service.ts`

```typescript
import { prisma } from "@/core/db";
import { UsersRepo } from "@/modules/users/repo";

export const EducationService = {
  // Lấy education content by id/slug
  get: (idOrSlug: string) => {
    const id = parseInt(idOrSlug);
    if (!isNaN(id)) {
      return prisma.educationContent.findUnique({ where: { id } });
    }
    return prisma.educationContent.findFirst({ where: { title: idOrSlug } });
  },
  
  // List tất cả education content
  list: () => prisma.educationContent.findMany({ orderBy: { createdAt: "desc" } }),
  
  // Mark education content as completed
  completeEducation: async (walletAddress: string, educationId: number) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) throw new Error("User not found");
    
    const education = await prisma.educationContent.findUnique({
      where: { id: educationId },
    });
    if (!education) throw new Error("Education content not found");
    
    // Check đã complete chưa
    const existing = await prisma.userEducation.findUnique({
      where: {
        userId_educationId: {
          userId: user.id,
          educationId: education.id,
        },
      },
    });
    
    if (existing) {
      return { alreadyCompleted: true, points: 0 };
    }
    
    // Tạo record completion
    await prisma.userEducation.create({
      data: {
        userId: user.id,
        educationId: education.id,
        completed: true,
      },
    });
    
    // Add points cho user
    const newPoints = Number(user.totalPoints) + education.points;
    await UsersRepo.update(user.id, {
      totalPoints: BigInt(newPoints),
    });
    
    return {
      success: true,
      pointsEarned: education.points,
      newTotalPoints: newPoints,
    };
  },
  
  // Lấy education progress của user
  getUserProgress: async (userId: number) => {
    return prisma.userEducation.findMany({
      where: { userId },
      include: { education: true },
    });
  },
};
```

### Step 6: Add Missing Prisma Models

**File:** `prisma/schema.prisma`

Add these models if missing:

```prisma
model UserEducation {
  id          Int              @id @default(autoincrement())
  user        User             @relation(fields: [userId], references: [id])
  userId      Int
  education   EducationContent @relation(fields: [educationId], references: [id])
  educationId Int
  completed   Boolean          @default(false)
  completedAt DateTime         @default(now())

  @@unique([userId, educationId])
  @@index([userId])
}

model EducationContent {
  id          Int             @id @default(autoincrement())
  title       String          @db.VarChar(128)
  category    String          @db.VarChar(64)
  content     String
  duration    Int             @default(0)
  points      Int             @default(0)
  featured    Boolean         @default(false)
  createdAt   DateTime        @default(now())
  users       UserEducation[]
}
```

Also update User model to add relation:

```prisma
model User {
  // ... existing fields
  education       UserEducation[]
}
```

### Step 7: Create API Routes

#### Daily Challenges API

**File:** `src/app/api/challenges/daily/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ChallengesService } from "@/modules/challenges/service";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");
    
    if (!walletAddress) {
      return NextResponse.json(
        { ok: false, msg: "walletAddress is required" },
        { status: 400 }
      );
    }
    
    const challenges = await ChallengesService.getDailyChallenges(walletAddress);
    return NextResponse.json({ ok: true, challenges });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, msg: error.message },
      { status: 500 }
    );
  }
}
```

#### Complete Challenge API

**File:** `src/app/api/challenges/complete/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ChallengesService } from "@/modules/challenges/service";
import * as z from "zod";

const CompleteChallengeInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  challengeId: z.number(),
  proof: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = CompleteChallengeInput.parse(await req.json());
    
    const result = await ChallengesService.completeChallenge(
      body.walletAddress,
      body.challengeId,
      body.proof
    );
    
    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, msg: error.message },
      { status: 400 }
    );
  }
}
```

#### Complete Education API

**File:** `src/app/api/education/complete/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";
import * as z from "zod";

const CompleteEducationInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  educationId: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = CompleteEducationInput.parse(await req.json());
    
    const result = await EducationService.completeEducation(
      body.walletAddress,
      body.educationId
    );
    
    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, msg: error.message },
      { status: 400 }
    );
  }
}
```

#### List Education API

**File:** `src/app/api/education/route.ts` (NEW)

```typescript
import { NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";

export async function GET() {
  try {
    const content = await EducationService.list();
    return NextResponse.json({ ok: true, content });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, msg: error.message },
      { status: 500 }
    );
  }
}
```

#### User Achievements API

**File:** `src/app/api/users/[address]/achievements/route.ts` (NEW)

```typescript
import { NextResponse } from "next/server";
import { UsersRepo } from "@/modules/users/repo";
import { AchievementsService } from "@/modules/achievements/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const user = await UsersRepo.byWallet(address);
    
    if (!user) {
      return NextResponse.json(
        { ok: false, msg: "User not found" },
        { status: 404 }
      );
    }
    
    const achievements = await AchievementsService.getUserAchievements(user.id);
    return NextResponse.json({ ok: true, achievements });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, msg: error.message },
      { status: 500 }
    );
  }
}
```

## Database Migration

After updating schema:

```bash
# Push schema changes
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed data (if needed)
npm run db:seed
```

## Testing Flow

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234567890123456789012345678901234567890","username":"demo"}'
```

### 2. Get Daily Challenges

```bash
curl "http://localhost:3000/api/challenges/daily?walletAddress=0x1234567890123456789012345678901234567890"
```

### 3. Complete a Challenge

```bash
curl -X POST http://localhost:3000/api/challenges/complete \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234567890123456789012345678901234567890","challengeId":1}'
```

### 4. Get Education Content

```bash
curl http://localhost:3000/api/education
```

### 5. Complete Education

```bash
curl -X POST http://localhost:3000/api/education/complete \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234567890123456789012345678901234567890","educationId":1}'
```

### 6. Get User Achievements

```bash
curl http://localhost:3000/api/users/0x1234567890123456789012345678901234567890/achievements
```

## Key Features Implemented

✅ **Daily Challenges**: 4 challenges/day, auto-refresh daily
✅ **Points System**: Offchain storage, instant rewards
✅ **Streak System**: Updates only when completing 1+ challenges/day
✅ **Achievement Auto-Check**: Triggers after each challenge completion
✅ **Education Simple Flow**: Click → Confirm → Complete
✅ **Demo Mode**: No complex validation, all auto-approved

## Notes

- All data stored offchain (database only)
- No blockchain transactions in demo mode
- Challenges auto-approved for simplicity
- Achievements checked automatically
- Streak only increases if user completes at least 1 challenge per day
- New challenges appear daily regardless of previous day completion

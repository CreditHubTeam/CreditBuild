-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CLAIMED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(64),
    "credit_score" INTEGER NOT NULL DEFAULT 300,
    "education_points" BIGINT NOT NULL DEFAULT 0,
    "financial_points" BIGINT NOT NULL DEFAULT 0,
    "kyc_status" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moca_id" VARCHAR(128),
    "referral_code" VARCHAR(16),
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "social_points" BIGINT NOT NULL DEFAULT 0,
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "tier_level" VARCHAR(32) NOT NULL DEFAULT 'bronze',
    "total_challenges" INTEGER NOT NULL DEFAULT 0,
    "total_points" BIGINT NOT NULL DEFAULT 0,
    "wallet_address" VARCHAR(66) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kol" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kol_name" VARCHAR(128) NOT NULL,
    "verification_status" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "social_followers" JSONB NOT NULL,
    "specialization" VARCHAR(64) NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "total_earnings" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanClub" (
    "id" SERIAL NOT NULL,
    "kolId" INTEGER NOT NULL,
    "club_name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "entry_requirements" JSONB NOT NULL,
    "membership_fee" BIGINT NOT NULL DEFAULT 0,
    "max_members" INTEGER NOT NULL,
    "current_members" INTEGER NOT NULL DEFAULT 0,
    "club_image" VARCHAR(255),
    "contract_address" VARCHAR(66),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FanClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanClubMembership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "membership_tier" VARCHAR(32) NOT NULL DEFAULT 'basic',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_tasks_completed" INTEGER NOT NULL DEFAULT 0,
    "tier_points" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "FanClubMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "creditImpact" INTEGER NOT NULL,
    "category" VARCHAR(64),
    "rules" JSONB NOT NULL,
    "icon" VARCHAR(8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER,
    "difficultyLevel" VARCHAR(32) NOT NULL DEFAULT 'beginner',
    "endDate" TIMESTAMP(3),
    "estimatedTimeMinutes" INTEGER,
    "fanClubId" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "maxCompletions" INTEGER,
    "recurrencePattern" VARCHAR(64),
    "socialImpact" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "verificationMethod" VARCHAR(64),

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialTask" (
    "id" SERIAL NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "platform" VARCHAR(32) NOT NULL,
    "action_type" VARCHAR(64) NOT NULL,
    "content_requirements" JSONB NOT NULL,
    "hashtags_required" TEXT[],
    "mention_requirements" TEXT[],
    "min_engagement_metrics" JSONB NOT NULL,
    "verification_webhook" VARCHAR(255),
    "auto_verification" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SocialTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialTaskCompletion" (
    "id" SERIAL NOT NULL,
    "userChallengeId" INTEGER NOT NULL,
    "socialTaskId" INTEGER NOT NULL,
    "platformPostId" VARCHAR(128) NOT NULL,
    "postUrl" VARCHAR(512) NOT NULL,
    "engagementMetrics" JSONB NOT NULL,
    "verificationStatus" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" INTEGER,

    CONSTRAINT "SocialTaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnhancedPointLedger" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pointsDelta" BIGINT NOT NULL,
    "pointCategory" VARCHAR(32),
    "reason" VARCHAR(128),
    "source" VARCHAR(64),
    "challengeId" INTEGER,
    "fanClubId" INTEGER,
    "multiplier" DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    "txHash" VARCHAR(128),
    "mocaTokenEquivalent" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnhancedPointLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KolEarning" (
    "id" SERIAL NOT NULL,
    "kolId" INTEGER NOT NULL,
    "fanClubId" INTEGER NOT NULL,
    "revenueSource" VARCHAR(64) NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" VARCHAR(16) NOT NULL,
    "transactionHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KolEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30),
    "status" "AttemptStatus" NOT NULL DEFAULT 'PENDING',
    "proof" JSONB,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "creditChange" INTEGER NOT NULL DEFAULT 0,
    "txHash" VARCHAR(128),
    "completionKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(8),

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointLedger" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "delta" BIGINT NOT NULL,
    "reason" VARCHAR(128) NOT NULL,
    "source" VARCHAR(64) NOT NULL,
    "txHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractConfig" (
    "id" SERIAL NOT NULL,
    "networkName" VARCHAR(64) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "rpcUrl" TEXT NOT NULL,
    "pointsToken" VARCHAR(66),
    "questAddress" VARCHAR(66),
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "duration" INTEGER,
    "points" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(256),

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEducation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "educationId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEducation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_moca_id_key" ON "User"("moca_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_referral_code_key" ON "User"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallenge_completionKey_key" ON "UserChallenge"("completionKey");

-- CreateIndex
CREATE INDEX "UserChallenge_userId_challengeId_createdAt_idx" ON "UserChallenge"("userId", "challengeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "PointLedger_userId_createdAt_idx" ON "PointLedger"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserEducation_userId_educationId_key" ON "UserEducation"("userId", "educationId");

-- AddForeignKey
ALTER TABLE "Kol" ADD CONSTRAINT "Kol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanClub" ADD CONSTRAINT "FanClub_kolId_fkey" FOREIGN KEY ("kolId") REFERENCES "Kol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanClubMembership" ADD CONSTRAINT "FanClubMembership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FanClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanClubMembership" ADD CONSTRAINT "FanClubMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_fanClubId_fkey" FOREIGN KEY ("fanClubId") REFERENCES "FanClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialTask" ADD CONSTRAINT "SocialTask_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialTaskCompletion" ADD CONSTRAINT "SocialTaskCompletion_socialTaskId_fkey" FOREIGN KEY ("socialTaskId") REFERENCES "SocialTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialTaskCompletion" ADD CONSTRAINT "SocialTaskCompletion_userChallengeId_fkey" FOREIGN KEY ("userChallengeId") REFERENCES "UserChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialTaskCompletion" ADD CONSTRAINT "SocialTaskCompletion_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedPointLedger" ADD CONSTRAINT "EnhancedPointLedger_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedPointLedger" ADD CONSTRAINT "EnhancedPointLedger_fanClubId_fkey" FOREIGN KEY ("fanClubId") REFERENCES "FanClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedPointLedger" ADD CONSTRAINT "EnhancedPointLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KolEarning" ADD CONSTRAINT "KolEarning_fanClubId_fkey" FOREIGN KEY ("fanClubId") REFERENCES "FanClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KolEarning" ADD CONSTRAINT "KolEarning_kolId_fkey" FOREIGN KEY ("kolId") REFERENCES "Kol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallenge" ADD CONSTRAINT "UserChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallenge" ADD CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointLedger" ADD CONSTRAINT "PointLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEducation" ADD CONSTRAINT "UserEducation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEducation" ADD CONSTRAINT "UserEducation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

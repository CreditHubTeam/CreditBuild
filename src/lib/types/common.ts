export type ChainAddress = `0x${string}`;
export type ISODate = string; // '2025-10-09T02:15:00.000Z'

export type TierLevel = "bronze" | "silver" | "gold" | "platinum";
export type KycStatus = "pending" | "verified" | "rejected";

export type ChallengeType =
  | "financial"
  | "social"
  | "educational"
  | "kol_exclusive";
export type VerificationMethod = "manual" | "automatic" | "smart_contract";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Recurrence = "daily" | "weekly" | "monthly";

export type SocialPlatform = "twitter" | "instagram" | "tiktok" | "youtube";
export type SocialAction =
  | "post"
  | "share"
  | "comment"
  | "follow"
  | "create_content";

export type PointCategory = "financial" | "social" | "educational" | "bonus";
export type RevenueSource =
  | "membership_fees"
  | "task_completions"
  | "commissions";

export type ChallengeStatus = "pending" | "completed" | "failed";

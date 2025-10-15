import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding (updated to match schema.prisma)...");

  // 1) Contract config
  console.log("📡 Ensuring contract config...");
  const cfg = await prisma.contractConfig.findFirst({ where: { chain: "creditcoin-testnet" } });
  if (!cfg) {
    await prisma.contractConfig.create({
      data: {
        chain: "creditcoin-testnet",
        name: "Creditcoin Testnet",
        contract_address: null,
        json_config: {},
      },
    });
    console.log("✅ Contract config created");
  } else {
    console.log("ℹ️ Contract config already exists");
  }

  // 2) Sample users
  console.log("👥 Creating sample users...");
  const alice = await prisma.user.upsert({
    where: { wallet_address: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00" },
    update: {},
    create: {
      wallet_address: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
      username: "alice",
      credit_score: 420,
      streak_days: 5,
      total_points: BigInt(150),
      social_points: BigInt(0),
      financial_points: BigInt(0),
      education_points: BigInt(0),
      tier_level: "silver",
    },
  });

  await prisma.user.upsert({
    where: { wallet_address: "0x2222222222222222222222222222222222222222" },
    update: {},
    create: {
      wallet_address: "0x2222222222222222222222222222222222222222",
      username: "bob",
      credit_score: 350,
      streak_days: 2,
      total_points: BigInt(50),
      social_points: BigInt(0),
      financial_points: BigInt(0),
      education_points: BigInt(0),
      tier_level: "bronze",
    },
  });

  // 3) Achievements
  console.log("🏆 Creating achievements...");
  const achievements = [
    { id: "first_steps", name: "First Steps", description: "Complete your first challenge", icon: "🚀" },
    { id: "week_warrior", name: "Week Warrior", description: "Complete 7 challenges", icon: "💪" },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { id: a.id }, update: {}, create: a });
  }

  // 4) Education items
  console.log("📚 Creating education items...");
  const eduItems = [
    { title: "What is Creditcoin?", description: "Learn about Creditcoin blockchain and its benefits", duration: 5, points: 25 },
    { title: "Understanding Credit Scores", description: "Learn how credit scores work and what affects them", duration: 10, points: 50 },
  ];
  for (const e of eduItems) {
    const found = await prisma.education.findFirst({ where: { title: e.title } });
    if (!found) {
      await prisma.education.create({ data: e });
    }
  }

  // 5) Challenges
  console.log("🎯 Creating sample challenges...");
  const challenges = [
    { type: "daily", category: "onboarding", name: "Daily Check-in", description: "Login every day", points: 10, credit_impact: 1, xp: 0, rules: {} },
    { type: "education", category: "education", name: "Complete Financial Course", description: "Finish a course", points: 100, credit_impact: 5, xp: 10, rules: {} },
  ];
  for (const c of challenges) {
    const found = await prisma.challenge.findFirst({ where: { name: c.name } });
    if (!found) {
      await prisma.challenge.create({ data: c });
    }
  }

  // 6) Fan clubs
  console.log("🎪 Creating sample fan clubs...");
  const existingFanClubs = await prisma.fanClub.findMany();
  if (existingFanClubs.length === 0) {
    const fc = await prisma.fanClub.create({
      data: {
        owner_id: alice.id,
        name: "Savings Savvy Club",
        slug: "savings-savvy",
        description: "A community focused on saving habits",
        visibility: "public",
        membership_fee: BigInt(0),
        max_members: 500,
        current_members: 0,
        metadata: {},
      },
    });

    // create a membership for alice
    await prisma.fanClubMembership.create({
      data: {
        club_id: fc.id,
        user_id: alice.id,
        role: "owner",
        member_points: BigInt(0),
      },
    });
    console.log("✅ Fan club and membership created");
  } else {
    console.log("ℹ️ Fan clubs already exist");
  }

  // 7) Sample user challenge (claim)
  console.log("📝 Creating sample user challenge submissions...");
  const someChallenge = await prisma.challenge.findFirst();
  if (someChallenge) {
    await prisma.userChallenge.createMany({
      data: [
        {
          user_id: alice.id,
          challenge_id: someChallenge.id,
          status: "submitted",
          proof: {},
          points_awarded: 0,
          credit_change: 0,
        },
      ],
    });
  }

  // 8) User achievements and point ledger
  console.log("🔖 Creating sample user achievements & point ledger...");
  const ach = await prisma.achievement.findUnique({ where: { id: "first_steps" } });
  if (ach) {
    await prisma.userAchievement.upsert({ where: { user_id_achievement_id: { user_id: alice.id, achievement_id: ach.id } }, update: {}, create: { user_id: alice.id, achievement_id: ach.id } });
  }

  await prisma.pointLedger.create({
    data: {
      user_id: alice.id,
      delta: BigInt(50),
      category: "bonus",
      reason: "Initial bonus",
      source: "seed",
    },
  });

  console.log("✅ Database seeding completed successfully!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});

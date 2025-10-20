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
      kyc_status: "verified"
    },
  });

  const bob = await prisma.user.upsert({
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
      kyc_status: "pending"
    },
  });
  const charlie = await prisma.user.upsert({
    where: { wallet_address: "0x3333333333333333333333333333333333333333" },
    update: {},
    create: {
      wallet_address: "0x3333333333333333333333333333333333333333",
      username: "charlie",
      credit_score: 600,
      streak_days: 10,
      total_points: BigInt(300),
      social_points: BigInt(0),
      financial_points: BigInt(0),
      education_points: BigInt(0),
      tier_level: "gold",
      kyc_status: "verified"
    },
  });
  const diana = await prisma.user.upsert({
    where: { wallet_address: "0x4444444444444444444444444444444444444444" },
    update: {},
    create: {
      wallet_address: "0x4444444444444444444444444444444444444444",
      username: "diana",
      credit_score: 500,
      streak_days: 7,
      total_points: BigInt(200),
      social_points: BigInt(0),
      financial_points: BigInt(0),
      education_points: BigInt(0),
      tier_level: "platinum",
      kyc_status: "verified"
    },
  });

  // 3) Achievements
  console.log("🏆 Creating achievements...");
  const achievements = [
    { id: "first_steps", name: "First Steps", description: "Complete your first challenge", icon: "🚀" },
    { id: "week_warrior", name: "Week Warrior", description: "Complete 7 challenges", icon: "💪" },
    { id: "social_butterfly", name: "Social Butterfly", description: "Engage with 10 community posts", icon: "🦋" },
    { id: "saver_streak", name: "Saver Streak", description: "Save consistently for 14 days", icon: "💰" },
    { id: "scholar", name: "Scholar", description: "Complete 5 education items", icon: "🎓" },
    { id: "community_helper", name: "Community Helper", description: "Answer 5 questions in forums", icon: "🤝" },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { id: a.id }, update: {}, create: a });
  }

  // 4) Education items
  console.log("📚 Creating education items...");
  const eduItems = [
    { title: "What is Creditcoin?", description: "Learn about Creditcoin blockchain and its benefits", duration: 5, points: 25 },
    { title: "Understanding Credit Scores", description: "Learn how credit scores work and what affects them", duration: 10, points: 50 },
    { title: "Budgeting Basics", description: "Principles of budgeting and how to allocate income", duration: 15, points: 40 },
    { title: "Savings Strategies", description: "Tips and tactics to build a consistent savings habit", duration: 8, points: 30 },
    { title: "Intro to DeFi", description: "Overview of decentralized finance and common use cases", duration: 12, points: 60 },
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
    { type: "habit", category: "budgeting", name: "Budgeting Sprint", description: "Plan your weekly budget", points: 40, credit_impact: 2, xp: 5, rules: { required_steps: 1 } },
    { type: "streak", category: "savings", name: "7-Day Saver", description: "Save at least once a day for 7 days", points: 60, credit_impact: 3, xp: 8, rules: { days: 7 } },
    { type: "referral", category: "growth", name: "Refer a Friend", description: "Refer a friend who signs up", points: 150, credit_impact: 4, xp: 20, rules: { max_rewards_per_user: 5 } },
    { type: "social", category: "community", name: "Community Post", description: "Create 3 helpful posts", points: 30, credit_impact: 1, xp: 5, rules: { required_posts: 3 } },
    { type: "help", category: "community", name: "Answer Questions", description: "Help 5 users in the forum", points: 45, credit_impact: 2, xp: 8, rules: { required_answers: 5 } },
    { type: "education", category: "defi", name: "DeFi Explorer", description: "Complete an introductory DeFi tutorial", points: 80, credit_impact: 5, xp: 15, rules: {} },
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
      data: {
        owner_id: bob.id,
        name: "Tech Innovators Club",
        slug: "tech-innovators",
        description: "A community for tech enthusiasts",
        visibility: "public",
        membership_fee: BigInt(0),
        max_members: 300,
        current_members: 0,
        metadata: {},
      }
        });

        await prisma.fanClub.create({
      data: {
        owner_id: alice.id,
        name: "Fitness Fanatics",
        slug: "fitness-fanatics",
        description: "A club for fitness lovers",
        visibility: "public",
        membership_fee: BigInt(0),
        max_members: 200,
        current_members: 0,
        metadata: {},
      }
        });

        await prisma.fanClub.create({
      data: {
        owner_id: bob.id,
        name: "Bookworms Society",
        slug: "bookworms-society",
        description: "A community for book lovers",
        visibility: "public",
        membership_fee: BigInt(0),
        max_members: 150,
        current_members: 0,
        metadata: {},
      }
        });

        await prisma.fanClub.create({
      data: {
        owner_id: alice.id,
        name: "Travel Enthusiasts",
        slug: "travel-enthusiasts",
        description: "A club for travel lovers",
        visibility: "public",
        membership_fee: BigInt(0),
        max_members: 250,
        current_members: 0,
        metadata: {},
      }
    });

    // create a membership for alice
    await prisma.fanClubMembership.create({
      data: {
        club_id: fc.id,
        user_id: alice.id,
        role: "owner",
        member_points: BigInt(0),
      },
      data: {
        club_id: fc.id,
        user_id: bob.id,
        role: "member",
      },
      data: {
        club_id: fc.id,
        user_id: charlie.id,
        role: "member",
      },
      data: {
        club_id: fc.id,
        user_id: diana.id,
        role: "member",
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

  // tạo các challenge trong club
  console.log("🎯 Creating club-specific challenges...");
  const club = await prisma.fanClub.findFirst({ where: { name: "Savings Savvy Club" } });
  if (club) {
    const clubChallenges = [
      {
        title: "Save $100",
        description: "Challenge yourself to save $100 this month.",
        club_id: club.id,
        reward: BigInt(100),
      },
      {
        title: "No Spend Week",
        description: "Participate in a no-spend week and share your experience.",
        club_id: club.id,
        reward: BigInt(50),
      },
    ];
    await prisma.challenge.createMany({ data: clubChallenges });
  }

  console.log("✅ Database seeding completed successfully!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});

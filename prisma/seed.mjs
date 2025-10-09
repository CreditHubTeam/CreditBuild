import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seeding...");

    // ✅ 1. Contract Config cho Creditcoin testnet - FIXED
    console.log("📡 Creating contract config...");
    
    // Check if config already exists
    const existingConfig = await prisma.contractConfig.findFirst({
        where: { chainId: 102031 }
    });
    
    if (!existingConfig) {
        await prisma.contractConfig.create({
            data: {
                networkName: "Creditcoin Testnet",
                chainId: 102031,
                rpcUrl: "https://rpc.cc3-testnet.creditcoin.network/",
                pointsToken: null,
                questAddress: process.env.QUEST_ADDRESS || null,
                paused: false
            }
        });
        console.log("✅ Contract config created");
    } else {
        console.log("ℹ️ Contract config already exists");
    }

    // ✅ 2. Sample Users
    console.log("👥 Creating sample users...");
    const u1 = await prisma.user.upsert({
        where: { wallet_address: "0x1111111111111111111111111111111111111111" },
        update: {},
        create: {
            wallet_address: "0x1111111111111111111111111111111111111111",
            username: "alice",
            credit_score: 420,
            streak_days: 5,
            total_challenges: 3,
            total_points: BigInt(150),
            tier_level: "silver"
        }
    });

    const u2 = await prisma.user.upsert({
        where: { wallet_address: "0x2222222222222222222222222222222222222222" },
        update: {},
        create: {
            wallet_address: "0x2222222222222222222222222222222222222222",
            username: "bob",
            credit_score: 350,
            streak_days: 2,
            total_challenges: 1,
            total_points: BigInt(50),
            tier_level: "bronze"
        }
    });

    // ✅ 3. Challenges - Check if already exist before createMany
    console.log("🎯 Creating challenges...");
    const existingChallenges = await prisma.challenge.findMany();
    
    if (existingChallenges.length === 0) {
        await prisma.challenge.createMany({
            data: [
                // Daily Challenges
                {
                    type: "daily",
                    category: "onboarding",
                    name: "Daily Check-in",
                    description: "Login every day to build your streak",
                    points: 10,
                    creditImpact: 1,
                    socialImpact: 0,
                    rules: {
                        cooldown: { unit: "day", value: 1 },
                        maxClaimsPerWeek: 7
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 1,
                    isRecurring: true,
                    recurrencePattern: "daily",
                    icon: "🌞",
                    featured: true
                },
                
                // Social Challenges
                {
                    type: "social",
                    category: "growth",
                    name: "Follow on X",
                    description: "Follow our project account on X (Twitter)",
                    points: 50,
                    creditImpact: 5,
                    socialImpact: 10,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["url"],
                        verificationMethod: "manual"
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 2,
                    icon: "🐦",
                    featured: true
                },
                {
                    type: "social",
                    category: "growth",
                    name: "Share Project",
                    description: "Share our project on social media",
                    points: 75,
                    creditImpact: 6,
                    socialImpact: 15,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["url"],
                        requiredHashtags: ["#CreditBuild", "#Web3"]
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 5,
                    icon: "📢"
                },

                // Onchain Challenges
                {
                    type: "onchain",
                    category: "onchain",
                    name: "Mint NFT Badge",
                    description: "Mint your first achievement NFT badge",
                    points: 100,
                    creditImpact: 10,
                    socialImpact: 5,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["tx"],
                        contractAddress: "0x...",
                        network: "creditcoin-testnet"
                    },
                    difficultyLevel: "intermediate",
                    estimatedTimeMinutes: 10,
                    icon: "🪙",
                    featured: true
                },
                {
                    type: "onchain",
                    category: "onchain",
                    name: "Make Transaction",
                    description: "Complete your first transaction on Creditcoin",
                    points: 50,
                    creditImpact: 8,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["tx"],
                        minValue: "0.001"
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 5,
                    icon: "💸"
                },

                // Savings Challenges
                {
                    type: "savings",
                    category: "savings",
                    name: "Save $50",
                    description: "Save $50 this month to build emergency fund",
                    points: 75,
                    creditImpact: 8,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["receipt", "statement"],
                        minAmount: 50
                    },
                    difficultyLevel: "intermediate",
                    estimatedTimeMinutes: 30,
                    icon: "💰"
                },
                {
                    type: "savings",
                    category: "savings",
                    name: "Emergency Fund Goal",
                    description: "Build a $500 emergency fund",
                    points: 200,
                    creditImpact: 15,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["statement"],
                        minAmount: 500
                    },
                    difficultyLevel: "advanced",
                    estimatedTimeMinutes: 60,
                    icon: "🏦"
                },

                // Payment Challenges  
                {
                    type: "payment",
                    category: "payment",
                    name: "Pay Bill On Time",
                    description: "Make a timely bill payment",
                    points: 60,
                    creditImpact: 12,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["receipt"],
                        requiresDueDate: true
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 15,
                    icon: "💳"
                },
                {
                    type: "payment",
                    category: "payment", 
                    name: "Credit Card Payment",
                    description: "Pay credit card bill before due date",
                    points: 80,
                    creditImpact: 15,
                    rules: {
                        requiresProof: true,
                        allowedProofTypes: ["receipt"],
                        paymentType: "credit_card"
                    },
                    difficultyLevel: "intermediate",
                    estimatedTimeMinutes: 10,
                    icon: "💳"
                },

                // Education Challenges
                {
                    type: "education",
                    category: "education",
                    name: "Complete Financial Course",
                    description: "Finish a financial literacy course",
                    points: 100,
                    creditImpact: 5,
                    rules: {
                        requiresProof: false,
                        autoComplete: true
                    },
                    difficultyLevel: "beginner",
                    estimatedTimeMinutes: 20,
                    icon: "📚",
                    featured: true
                }
            ]
        });
        console.log("✅ Challenges created");
    } else {
        console.log("ℹ️ Challenges already exist");
    }

    // ✅ 4. Achievements - Check before createMany
    console.log("🏆 Creating achievements...");
    const existingAchievements = await prisma.achievement.findMany();
    
    if (existingAchievements.length === 0) {
        await prisma.achievement.createMany({
            data: [
                {
                    id: "first_steps",
                    name: "First Steps",
                    description: "Complete your first challenge",
                    icon: "🚀"
                },
                {
                    id: "week_warrior", 
                    name: "Week Warrior",
                    description: "Complete 7 challenges",
                    icon: "💪"
                },
                {
                    id: "streak_superstar",
                    name: "Streak Superstar", 
                    description: "Maintain 7-day streak",
                    icon: "🔥"
                },
                {
                    id: "month_master",
                    name: "Month Master",
                    description: "Maintain 30-day streak",
                    icon: "👑"
                },
                {
                    id: "social_butterfly",
                    name: "Social Butterfly",
                    description: "Complete 5 social challenges",
                    icon: "🦋"
                },
                {
                    id: "savings_champion",
                    name: "Savings Champion", 
                    description: "Complete 10 savings challenges",
                    icon: "💰"
                },
                {
                    id: "credit_builder",
                    name: "Credit Builder",
                    description: "Reach 600 credit score",
                    icon: "📈"
                },
                {
                    id: "credit_champion",
                    name: "Credit Champion",
                    description: "Achieve 800+ credit score", 
                    icon: "⭐"
                },
                {
                    id: "perfect_score",
                    name: "Perfect Score",
                    description: "Reach maximum 850 credit score",
                    icon: "🏆"
                }
            ]
        });
        console.log("✅ Achievements created");
    } else {
        console.log("ℹ️ Achievements already exist");
    }

    // ✅ 5. Educational Content
    console.log("📚 Creating educational content...");
    const existingEducation = await prisma.education.findMany();
    
    if (existingEducation.length === 0) {
        await prisma.education.createMany({
            data: [
                {
                    title: "What is Creditcoin?",
                    description: "Learn about Creditcoin blockchain and its benefits",
                    duration: 5,
                    points: 25
                },
                {
                    title: "Understanding Credit Scores", 
                    description: "Learn how credit scores work and what affects them",
                    duration: 10,
                    points: 50
                },
                {
                    title: "Building Credit History",
                    description: "Strategies to establish and improve your credit history",
                    duration: 15,
                    points: 75
                },
                {
                    title: "Debt Management Strategies",
                    description: "Learn effective ways to manage and reduce debt",
                    duration: 12,
                    points: 60
                },
                {
                    title: "Emergency Fund Basics",
                    description: "Why you need an emergency fund and how to build one",
                    duration: 8,
                    points: 40
                },
                {
                    title: "Investment Fundamentals",
                    description: "Introduction to personal investing and wealth building",
                    duration: 20,
                    points: 100
                },
                {
                    title: "Budgeting 101",
                    description: "Create and maintain a personal budget",
                    duration: 15,
                    points: 75
                },
                {
                    title: "Blockchain & DeFi Basics",
                    description: "Understanding decentralized finance and Web3",
                    duration: 25,
                    points: 125
                }
            ]
        });
        console.log("✅ Educational content created");
    } else {
        console.log("ℹ️ Educational content already exists");
    }

    // ✅ 6. Sample User Progress (cho testing)
    console.log("📊 Creating sample user progress...");
    
    // Get some challenges for sample data
    const allChallenges = await prisma.challenge.findMany({ take: 3 });
    
    // Create some completed challenges for alice
    if (allChallenges.length > 0) {
        const existingUserChallenge = await prisma.userChallenge.findFirst({
            where: { userId: u1.id, challengeId: allChallenges[0].id }
        });
        
        if (!existingUserChallenge) {
            await prisma.userChallenge.create({
                data: {
                    userId: u1.id,
                    challengeId: allChallenges[0].id,
                    status: "CLAIMED",
                    pointsAwarded: allChallenges[0].points,
                    creditChange: allChallenges[0].creditImpact,
                    proof: { completed: true, timestamp: new Date() }
                }
            });
        }

        // Give alice an achievement
        const existingAchievement = await prisma.userAchievement.findFirst({
            where: { userId: u1.id, achievementId: "first_steps" }
        });
        
        if (!existingAchievement) {
            await prisma.userAchievement.create({
                data: {
                    userId: u1.id,
                    achievementId: "first_steps"
                }
            });
        }
    }

    // ✅ 7. Point Ledgers for sample users
    console.log("💰 Creating point ledgers...");
    const existingLedgers = await prisma.pointLedger.findMany({ 
        where: { userId: u1.id } 
    });
    
    if (existingLedgers.length === 0) {
        await prisma.pointLedger.createMany({
            data: [
                {
                    userId: u1.id,
                    delta: BigInt(50),
                    reason: "Challenge completion bonus",
                    source: "challenge_completion"
                },
                {
                    userId: u1.id,
                    delta: BigInt(25),
                    reason: "Daily check-in",
                    source: "daily_challenge"
                },
                {
                    userId: u2.id,
                    delta: BigInt(10),
                    reason: "First challenge",
                    source: "challenge_completion"
                }
            ]
        });
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("📊 Created:");
    console.log("  - 1 Contract Config");
    console.log("  - 2 Sample Users");
    console.log("  - 10 Challenges (across all categories)");
    console.log("  - 9 Achievements");
    console.log("  - 8 Educational Content items");
    console.log("  - Sample user progress and points");

    await prisma.$disconnect();
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    });

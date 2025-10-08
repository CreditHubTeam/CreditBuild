import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Config Creditcoin testnet (optional)
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

    // Users
    const u1 = await prisma.user.upsert({
        where: { walletAddress: "0x1111111111111111111111111111111111111111" },
        update: {},
        create: { walletAddress: "0x1111111111111111111111111111111111111111", username: "alice" }
    });
    const u2 = await prisma.user.upsert({
        where: { walletAddress: "0x2222222222222222222222222222222222222222" },
        update: {},
        create: { walletAddress: "0x2222222222222222222222222222222222222222", username: "bob" }
    });

    // Challenges
    await prisma.challenge.createMany({
        data: [
            { type: "daily", name: "Daily Check-in", description: "Login every day", points: 10, creditImpact: 1, category: "daily", rules: { cooldown: { unit: "day", value: 1 }, maxClaimsPerWeek: 7 }, icon: "🌞" },
            { type: "social", name: "Follow X", description: "Follow project account", points: 50, creditImpact: 5, category: "social", rules: { requiresProof: true, allowedProofTypes: ["url"] }, icon: "🐦" },
            { type: "onchain", name: "Mint Badge", description: "Mint NFT test badge", points: 100, creditImpact: 10, category: "onchain", rules: { requiresProof: true, allowedProofTypes: ["tx"] }, icon: "🪙" },
            { type: "savings", name: "Save $50", description: "Save $50 this month", points: 75, creditImpact: 8, category: "savings", rules: { requiresProof: true, allowedProofTypes: ["receipt"] }, icon: "💰" },
            { type: "savings", name: "Emergency Fund", description: "Build emergency fund", points: 200, creditImpact: 15, category: "savings", rules: { requiresProof: true, allowedProofTypes: ["statement"] }, icon: "🏦" },
            { type: "payment", name: "Pay Bill On Time", description: "Make timely payment", points: 60, creditImpact: 12, category: "payment", rules: { requiresProof: true, allowedProofTypes: ["receipt"] }, icon: "💳" },
            { type: "education", name: "Complete Course", description: "Finish financial literacy course", points: 100, creditImpact: 5, category: "education", rules: { requiresProof: false }, icon: "📚" }
        ]
    });

    // Achievements
    await prisma.achievement.createMany({
        data: [
            {
                id: "first_steps",
                name: "First Steps",
                description: "Complete your first challenge",
                icon: "🚀",
                points: 50,
                conditions: { minChallenges: 1 }
            },
            {
                id: "week_warrior",
                name: "Week Warrior",
                description: "Maintain a 7-day streak",
                icon: "🔥",
                points: 200,
                conditions: { minStreak: 7 }
            },
            {
                id: "monthly_master",
                name: "Monthly Master",
                description: "Maintain a 30-day streak",
                icon: "👑",
                points: 1000,
                conditions: { minStreak: 30 }
            },
            {
                id: "good_credit_club",
                name: "Good Credit Club",
                description: "Reach 650 credit score",
                icon: "📈",
                points: 500,
                conditions: { minCreditScore: 650 }
            },
            {
                id: "savings_master",
                name: "Savings Master",
                description: "Complete 10 savings challenges",
                icon: "💰",
                points: 300,
                conditions: { minChallenges: 10, challengeCategory: "savings" }
            },
            {
                id: "perfect_credit",
                name: "Perfect Credit",
                description: "Reach 850 credit score",
                icon: "🏆",
                points: 2000,
                conditions: { minCreditScore: 850 }
            }
        ]
    });

    // Education
    await prisma.education.createMany({
        data: [
            { title: "What is Credit Score?", desc: "Learn the basics of credit scoring", duration: 5, points: 25 },
            { title: "Building Credit History", desc: "How to establish and build your credit", duration: 10, points: 50 },
            { title: "Debt Management", desc: "Strategies for managing debt effectively", duration: 15, points: 75 },
            { title: "Investment Basics", desc: "Introduction to personal investment", duration: 20, points: 100 }
        ]
    });

    console.log("Seeded.");
    await prisma.$disconnect();
}

main().catch(console.error);

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
            { type: "daily", name: "Check-in", description: "Login mỗi ngày", points: 10, creditImpact: 1, category: "onboarding", rules: { cooldown: { unit: "day", value: 1 }, maxClaimsPerWeek: 7 }, icon: "🌞" },
            { type: "social", name: "Follow X", description: "Follow tài khoản dự án", points: 50, creditImpact: 5, category: "growth", rules: { requiresProof: true, allowedProofTypes: ["url"] }, icon: "🐦" },
            { type: "onchain", name: "Mint test badge", description: "Mint NFT test", points: 100, creditImpact: 10, category: "onchain", rules: { requiresProof: true, allowedProofTypes: ["tx"] }, icon: "🪙" }
        ]
    });

    // Education
    await prisma.educationItem.createMany({
        data: [
            { slug: "what-is-creditcoin", title: "Creditcoin là gì?", category: "intro", tags: ["creditcoin", "evm"], bodyMd: "# Creditcoin\nLớp EVM, chainId 102031, tCTC testnet..." },
            { slug: "how-to-faucet", title: "Nhận tCTC testnet", category: "setup", tags: ["faucet"], bodyMd: "# Faucet\nTruy cập faucet theo docs để nhận tCTC testnet." },
            { slug: "deploy-to-evm", title: "Deploy hợp đồng lên EVM", category: "dev", tags: ["solidity", "deploy"], bodyMd: "# Deploy\nDùng Foundry/Hardhat tới RPC Creditcoin testnet." }
        ]
    });

    console.log("Seeded.");
    await prisma.$disconnect();
}

main().catch(console.error);

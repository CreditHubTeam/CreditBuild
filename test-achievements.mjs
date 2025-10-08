// Test script to manually trigger achievement checking
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Simple achievement checking logic for testing
async function checkAndAwardAchievements(userId) {
    console.log(`Checking achievements for user ${userId}...`);

    // Get user data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            challenges: true,
            achievements: true
        }
    });

    if (!user) {
        console.log("User not found");
        return;
    }

    console.log(`User stats: challenges=${user.totalChallenges}, creditScore=${user.creditScore}, points=${user.totalPoints}`);

    // Get all achievements
    const achievements = await prisma.achievement.findMany();
    console.log(`Found ${achievements.length} achievements to check`);

    // Get already unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: userId }
    });
    const unlockedIds = userAchievements.map(ua => ua.achievementId);
    console.log(`User already has ${unlockedIds.length} achievements: [${unlockedIds.join(', ')}]`);

    // Check each achievement
    for (const achievement of achievements) {
        if (unlockedIds.includes(achievement.id)) {
            console.log(`⏭️  Skipping ${achievement.name} - already unlocked`);
            continue;
        }

        const conditions = typeof achievement.conditions === 'string'
            ? JSON.parse(achievement.conditions)
            : achievement.conditions || {};
        console.log(`🔍 Checking ${achievement.name} with conditions:`, conditions);

        let conditionMet = true;

        // Check minChallenges
        if (conditions.minChallenges && user.totalChallenges < conditions.minChallenges) {
            console.log(`   ❌ minChallenges: ${user.totalChallenges} < ${conditions.minChallenges}`);
            conditionMet = false;
        }

        // Check minCreditScore  
        if (conditions.minCreditScore && user.creditScore < conditions.minCreditScore) {
            console.log(`   ❌ minCreditScore: ${user.creditScore} < ${conditions.minCreditScore}`);
            conditionMet = false;
        }

        // Check minStreak
        if (conditions.minStreak && user.streakDays < conditions.minStreak) {
            console.log(`   ❌ minStreak: ${user.streakDays} < ${conditions.minStreak}`);
            conditionMet = false;
        }

        if (conditionMet) {
            console.log(`   ✅ All conditions met! Awarding ${achievement.name}`);

            // Award achievement
            await prisma.userAchievement.create({
                data: {
                    userId: userId,
                    achievementId: achievement.id
                }
            });

            console.log(`   🏆 Achievement "${achievement.name}" awarded! (+${achievement.points} points)`);
        } else {
            console.log(`   ⏳ Conditions not met for ${achievement.name}`);
        }
    }
}

// Test with user ID 3
checkAndAwardAchievements(3)
    .then(() => {
        console.log("\n✨ Achievement check completed!");
        process.exit(0);
    })
    .catch(console.error);
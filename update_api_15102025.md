 POST /api/auth/register
 ```json
 {
    "walletAddress": "0xbbb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
    "signature": "test"
}
```
```json
{
    "ok": true,
    "data": {
        "walletAddress": "0xbbb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        "creditScore": 300,
        "streakDays": 0,
        "totalPoints": "0",
        "socialPoints": "0",
        "financialPoints": "0",
        "educationPoints": "0",
        "bestStreak": 0,
        "isRegistered": true
    }
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/challenges
```json 
{
    "ok": true,
    "data": [
        {
            "id": "739acc34-772c-470c-b828-d6455d7e53b3",
            "type": "daily",
            "category": "onboarding",
            "name": "Daily Check-in",
            "description": "Login every day",
            "points": 10,
            "creditImpact": 1,
            "isCompleted": true
        },
        {
            "id": "739acc34-772c-470c-b828-d6455d7e53b3",
            "type": "daily",
            "category": "onboarding",
            "name": "Daily Check-in",
            "description": "Login every day",
            "points": 10,
            "creditImpact": 1,
            "isCompleted": true
        }
    ]
}
```
---
POST api/challenges/739acc34-772c-470c-b828-d6455d7e53b3/submit
```json
{
    "walletAddress": "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
    "amount": 100
}
```
```json

{
    "ok": true,
    "data": {
        "challengeId": "739acc34-772c-470c-b828-d6455d7e53b3",
        "isCompleted": true,
        "pointsAwarded": 0,
        "creditChange": 0,
        "newCreditScore": 480,
        "totalPoints": 210,
        "achievementUnlocked": ""
    }
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/achievements?top=3
```json
{
    "ok": true,
    "data": [
        {
            "id": "4bd98cfa-e0dd-44f1-9c0d-297fe316c886",
            "name": "First Steps",
            "description": "Complete your first challenge",
            "icon": "🚀",
            "unlocked": true
        },
        {
            "id": "week_warrior",
            "name": "Week Warrior",
            "description": "Complete 7 challenges",
            "icon": "💪",
            "unlocked": false
        }
    ]
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/achievements
```json
{
    "ok": true,
    "data": [
        {
            "id": "4bd98cfa-e0dd-44f1-9c0d-297fe316c886",
            "name": "First Steps",
            "description": "Complete your first challenge",
            "icon": "🚀",
            "unlocked": true
        },
        {
            "id": "week_warrior",
            "name": "Week Warrior",
            "description": "Complete 7 challenges",
            "icon": "💪",
            "unlocked": false
        }
    ]
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/educations?status=no_enrollment
```json
{
    "ok": true,
    "data": [
        {
            "id": 1,
            "title": "What is Creditcoin?",
            "description": "Learn about Creditcoin blockchain and its benefits",
            "duration": "5 min",
            "points": 25,
            "isCompleted": false
        },
        {
            "id": 2,
            "title": "Understanding Credit Scores",
            "description": "Learn how credit scores work and what affects them",
            "duration": "10 min",
            "points": 50,
            "isCompleted": false
        },
        {
            "id": 3,
            "title": "Building Credit History",
            "description": "Strategies to establish and improve your credit history",
            "duration": "15 min",
            "points": 75,
            "isCompleted": false
        }
    ]
}
```
---
POST /api/education/4/complete
```json
{
    "walletAddress": "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00"
}
```
```json
{
    "ok": true,
    "data": {
        "educationId": 4,
        "isCompleted": true,
        "pointsAwarded": 60,
        "totalPoints": 480,
        "educationPoints": 60,
        "achievementUnlocked": null
    }
}
```
---
GET /api/fan-clubs
```json
{
    "ok": true,
    "data": [
        {
            "id": "3f2b7bee-22fa-4f43-a5b4-cbecbdc10830",
            "kolName": "alice1",
            "kolVerified": false,
            "title": "Savings Savvy Club",
            "description": "A community focused on saving habits",
            "members": 0,
            "challenges": 2,
            "avgEarnings": 15,
            "socials": {
                "twitter": "twitter.com/test",
                "instagram": "instagram.com/test",
                "youtube": "youtube.com/test"
            },
            "priceLabel": "Free",
            "image": "https://via.placeholder.com/300x150.png?text=Fan+Club",
            "isJoined": false
        }
    ]
}
```
---
POST /api/fan-clubs/join
```json
{
    "walletAddress": "0x2222222222222222222222222222222222222222",
    "fanClubId": "3f2b7bee-22fa-4f43-a5b4-cbecbdc10830"
}
```
```json
{
    "ok": true,
    "data": {
        "fanClubId": "3f2b7bee-22fa-4f43-a5b4-cbecbdc10830",
        "joinedAt": "2025-10-15T08:08:17.539Z",
        "kolName": "bob",
        "members": 1,
        "isJoined": true
    }
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00
```json
{
    "ok": true,
    "data": {
        "walletAddress": "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        "creditScore": 480,
        "streakDays": 5,
        "totalPoints": 210,
        "isRegistered": true,
        "bestStreak": 5
    }
}
```
---
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/fan-clubs
```json
{
    "ok": true,
    "data": [
        {
            "id": "3f2b7bee-22fa-4f43-a5b4-cbecbdc10830",
            "kolName": "bob",
            "kolVerified": false,
            "title": "Savings Savvy Club",
            "description": "A community focused on saving habits",
            "members": 0,
            "challenges": 2,
            "avgEarnings": 15,
            "socials": {
                "twitter": "twitter.com/test",
                "instagram": "instagram.com/test",
                "youtube": "youtube.com/test"
            },
            "priceLabel": "Free",
            "image": "https://via.placeholder.com/300x150.png?text=Fan+Club",
            "isJoined": true
        }
    ]
}
```

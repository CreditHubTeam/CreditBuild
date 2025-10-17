# API Documentation Updates
### Create Club 
POST `/api/fan-clubs` ==Đã có==  ==Đã test phía BE==
- [x]: thống nhất request, response
- [x]: setup route
- [x]: setup service
- [x]: viet logic
```json
{
    "walletAddress": "string", //wallet cua owner club
  "name": "string",
  "description": "string",
  "membershipType": "open" | "invite_only",
  "tags": ["string"],
//   "logoFile": "File | null" // test thi bo qua file
}
```
```json
{
    "ok": true,
    "data": {
            {
            "id": "string",
            "kolName": "string",
            "kolVerified": true,
            "kolSubtitle": "string",
            "title": "string",
            "description": "string",
            "members": 0,
            "challenges": 0,
            "avgEarnings": 0,
            "socials": {
                "twitter": 0,
                "youtube": 0,
                "telegram": 0
            },
            "priceLabel": "string", // "100 MOCA"
            "image": "string", // cover/thumb nếu có
            "isJoined": true
            }
    }
}
```
---
### Create Challenge for Club
POST `/api/fan-clubs/:id/challenges` ==Đã có== ==Đã test phía BE==
- [x]: thống nhất request, response
- [x]: setup route
- [x]: setup service
- [x]: viet logic
```json
{
    "walletAddress": "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
    "icon": "string 1",
    "title": "string 1",
    "description": "string",
    "category": "string",
    "points": 0,
    "creditImpact": 0,
    "estimatedTimeMinutes": 10,
    "typeProof": "string",
    "startDate": "2025-10-15T00:00:00Z", //thêm startDate
    "endDate": "2025-12-31T23:59:59Z" //thêm endDate
}
```
```json
{
    "ok": true,
    "data": {
        "id": "e0eca36e-297d-4fe6-9d1c-f1c7851eae21",
        "type": "club",
        "category": "string",
        "name": "string 1",
        "descrioption": "string",
        "points": 0,
        "creditImpact": 0,
        "isCompleted": false,
        "icon": "https://via.placeholder.com/100.png?text=Challenge",
        "estimatedTimeMinutes": 10
    }
}
```
---
### GET Challenges for Club
GET `/api/fan-clubs/:id/challenges` ==Chưa có==
- [ ]: thống nhất request, response
- [x]: setup route
- [ ]: setup service
- [ ]: viet logic
```json
{
    "ok": true,
    "data": [
        {
            "id": "739acc34-772c-470c-b828-d6455d7e53b3",
            "fanClubId": "3f2b7bee-22fa-4f43-a5b4-cbecbdc10830",
            "name": "Challenge Title",
            "description": "Challenge Description",
            "type": "daily",
            "category": "education",
            "points": 20,
            "creditImpact": 2,
            "xp": 50,
            "rule": { },
            "startDate": "2025-10-15T00:00:00Z",
            "endDate": "2025-12-31T23:59:59Z"
            }
    ]
}
```
---
### GET Members of Club
GET `/api/fan-clubs/{fanClubId}/members` ==Chưa có==
- [ ]: thống nhất request, response
- [x]: setup route
- [ ]: setup service
- [ ]: viet logic
```json
{
    "ok": true,
    "data": [
        {
            "walletAddress": "0xccc7518cD8F8f096A23426AE3c8a9d778b4CBf00",
            "joinedAt": "2025-10-15T08:08:17.539Z",
            "username": "bob",
            "totalPoints": 50,
            "creditScore": 320,
            "challengesCompleted": 3,
            "achievementsUnlocked": 1
        }
    ]
}
```
---
### Submit Challenge for Member
POST `/fan-clubs/:id/challenges/:challengeId/submit` ==Chưa có==
- [ ]: thống nhất request, response
- [ ]: setup route
- [ ]: setup service
- [ ]: viet logic
```json
{
    "walletAddress": "0xbbb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
    "signature": "test", //option
    "proof": {}, //option
}
```
```json
{
    "ok": true,
    "data": {
        "challengeId": "739acc34-772c-470c-b828-d6455d7e53b3",
        "status": "Under Review", //đợi admin duyệt
    }
}
```
---
### Review Challenge Submission (Admin)
POST `/api/fan-clubs/:id/challenges/:challengeId/review` ==Chưa có==
- [ ]: thống nhất request, response
- [ ]: setup route
- [ ]: setup service
- [ ]: viet logic
```json
{
    "walletAddress": "0xbbb7518cD8F8f096A23426AE3c8a9d778b4CBf00", //wallet cua owner club
    "isApproved": true
    //lấy challenge ở trên
}
```
```json
{
    "ok": true,
    "data": {
        "challengeId": "739acc34-772c-470c-b828-d6455d7e53b3",
        "memberAddress": "0xccc7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        "isCompleted": true,
        "status": "Approved",
        "pointsAwarded": 20,
        "creditChange": 2,
        "newCreditScore": 302,
        "totalPoints": 20,
        "achievementUnlocked": null
    }
}
```
---
### Register User
POST `/api/auth/register`
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
GET /api/users/0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00/educations
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
            "isCompleted": true
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

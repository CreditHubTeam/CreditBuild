# Daily Challenge System - Frontend Integration Guide

## System Overview

Hệ thống Daily Challenge giúp người dùng xây dựng credit score thông qua các nhiệm vụ gamification hàng ngày.

### Key Features

- ✅ **4 Nhiệm vụ/ngày**: Làm mới mỗi ngày lúc 00:00
- ✅ **Streak System**: Duy trì chuỗi ngày liên tiếp (cần làm ít nhất 1 nhiệm vụ/ngày)
- ✅ **Achievements**: Tự động mở khóa dựa trên điều kiện
- ✅ **Education**: Nội dung học tập với tracking hoàn thành
- ✅ **Points & Credit**: Tích điểm và tăng credit score

## ✅ API Testing Status

**Đã test thành công tất cả APIs chính:**

- 🎯 **GET /challenges** - Lấy tất cả challenges (✅ Working)
- 📅 **GET /challenges/daily** - Lấy 4 nhiệm vụ hàng ngày (✅ Working)  
- 👤 **GET /users/{address}** - Thông tin user & credit score (✅ Working)
- 📚 **GET /education** - Danh sách nội dung học tập (✅ Working)
- 🎓 **POST /education/complete** - Hoàn thành học tập (✅ Working)
- 🏆 **GET /achievements** - Danh sách thành tựu (✅ Working)
- 💰 **POST /claims** - Claim nhiệm vụ hoàn thành (✅ Working)

**Docker Setup:**

```bash
# Start containers
docker compose -f docker/docker-compose.yml up -d --build

# Run API tests
node test-api.js
```

---

## 🎯 Daily Challenge System Logic

### Cơ chế hoạt động

1. **Mỗi ngày hiện 4 nhiệm vụ** từ pool challenges có sẵn
2. **Người dùng có thể làm bất kỳ challenge nào** trong ngày (không bắt buộc làm hết)
3. **Ngày hôm sau sẽ có 4 nhiệm vụ mới** (có thể là challenges khác hoặc giống)
4. **Streak chỉ tăng khi làm ít nhất 1 nhiệm vụ trong ngày**
5. **Achievements tự động unlock** khi đủ điều kiện

### Education System

1. **Người dùng click vào content** → Hiện popup
2. **Hỏi "Đã hoàn thành chưa?"** → User click OK
3. **Call API complete** → Lưu vào database + tặng points

### Challenge Categories

- `daily` - Check-in hàng ngày (10 points)
- `social` - Follow tài khoản, share (50 points)  
- `onchain` - Mint NFT, transaction (100 points)
- `education` - Hoàn thành học tập (100 points)
- `savings` - Tiết kiệm tiền (75 points)
- `payment` - Thanh toán đúng hạn (60 points)

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### 1. User APIs

#### 1.1 Register/Login User

```http
POST /auth/register
Content-Type: application/json

{
  "walletAddress": "0x1234...",  // Required
  "username": "testuser"          // Optional
}
```

**Response:**

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "walletAddress": "0x1234...",
    "username": "testuser",
    "creditScore": 300,
    "streakDays": 0,
    "totalChallenges": 0,
    "totalPoints": "0",
    "registeredAt": "2025-10-08..."
  }
}
```

#### 1.2 Get User Profile

```http
GET /users/{walletAddress}
```

**Response:**

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "walletAddress": "0x1234...",
    "creditScore": 305,
    "streakDays": 2,
    "totalChallenges": 3,
    "totalPoints": "150"
  },
  "stats": {
    "attempts": 5,
    "last5": [...]  // 5 challenge attempts gần nhất
  }
}
```

---

### 2. Daily Challenge APIs

#### 2.1 Get All Challenges

```http
GET /challenges
```

**Response:** Array of all available challenges

**Challenge Object:**

```json
{
  "id": 1,
  "type": "daily",
  "name": "Check-in",
  "description": "Login mỗi ngày",
  "points": 10,
  "creditImpact": 1,
  "category": "onboarding",
  "rules": {
    "cooldown": {"unit": "day", "value": 1},
    "maxClaimsPerWeek": 7
  },
  "icon": "🌞"
}
```

**Categories:**

- `onboarding` - Nhiệm vụ hàng ngày cơ bản
- `growth` - Tương tác mạng xã hội
- `onchain` - Giao dịch blockchain
- `savings` - Tiết kiệm tài chính
- `payment` - Thanh toán đúng hạn
- `education` - Học tập

#### 2.2 Get Daily Challenges (4 nhiệm vụ/ngày)

```http
GET /challenges/daily?address={walletAddress}
```

**Response:**

```json
{
  "ok": true,
  "challenges": [
    {
      "id": 1,
      "name": "Daily Check-in",
      "points": 10,
      "creditImpact": 1,
      "icon": "🌞",
      "completed": false,
      "canClaim": true
    }
    // ... 3 challenges khác
  ],
  "refreshesAt": "2025-10-09T00:00:00.000Z"
}
```

**UI Flow:**

1. Hiển thị 4 nhiệm vụ cho ngày hôm nay
2. User chọn 1 nhiệm vụ để làm
3. User hoàn thành nhiệm vụ (theo rules của từng loại)
4. User click "Claim" → Call API `/claims`
5. Ngày mai: 4 nhiệm vụ mới (dù hôm trước chưa xong hết)

#### 2.3 Claim Challenge Completion

```http
POST /claims
Content-Type: application/json

{
  "userAddress": "0x1234...",
  "challengeId": 1,
  "proof": {}  // Tùy loại challenge
}
```

**Proof Types:**

- **Social challenges**: `{"url": "https://twitter.com/..."}`
- **Onchain challenges**: `{"txHash": "0x..."}`
- **Payment/Savings**: `{"receipt": "base64_image"}`
- **Daily/Education**: `{}` (empty object)

**Response:**

```json
{
  "ok": true,
  "completion": {
    "id": 1,
    "status": "CLAIMED",
    "pointsAwarded": 10,
    "creditChange": 1
  },
  "user": {
    "creditScore": 311,
    "totalChallenges": 2,
    "totalPoints": "20",
    "streakDays": 1  // Tăng nếu là challenge đầu tiên trong ngày
  },
  "newAchievements": [  // Achievements vừa mở khóa (nếu có)
    {
      "id": "first_steps",
      "name": "First Steps",
      "icon": "🚀",
      "points": 50
    }
  ]
}
```

**Business Logic:**

- Hoàn thành challenge → Tăng `totalChallenges`, `totalPoints`, `creditScore`
- **Challenge đầu tiên trong ngày** → Tăng `streakDays`
- **Bỏ lỡ 1 ngày** (không làm challenge nào) → Reset `streakDays = 0`
- Tự động check và award achievements sau mỗi claim

---

### 3. Achievement APIs

#### 3.1 Get All Achievements

```http
GET /achievements
```

**Response:**

```json
[
  {
    "id": "first_steps",
    "name": "First Steps",
    "description": "Complete your first challenge",
    "icon": "🚀",
    "points": 50,
    "conditions": {
      "minChallenges": 1
    }
  },
  {
    "id": "week_warrior",
    "name": "Week Warrior",
    "description": "Complete 7 challenges",
    "icon": "💪",
    "points": 200,
    "conditions": {
      "minChallenges": 7
    }
  },
  {
    "id": "streak_superstar",
    "name": "Streak Superstar",
    "description": "Maintain 7-day streak",
    "icon": "🔥",
    "points": 300,
    "conditions": {
      "minStreak": 7
    }
  },
  {
    "id": "credit_champion",
    "name": "Credit Champion",
    "description": "Achieve 800+ credit score",
    "icon": "⭐",
    "points": 1000,
    "conditions": {
      "minCreditScore": 800
    }
  }
]
```

**Condition Types:**

- `minChallenges`: Tổng số challenges hoàn thành
- `minStreak`: Chuỗi ngày liên tiếp (cần ít nhất 1 challenge/ngày)
- `minCreditScore`: Điểm credit tối thiểu
- `challengeCategory`: Hoàn thành challenges từ category cụ thể

#### 3.2 Get User's Achievements

```http
GET /users/{walletAddress}/achievements
```

**Response:**

```json
{
  "ok": true,
  "achievements": [
    {
      "id": "first_steps",
      "name": "First Steps",
      "icon": "🚀",
      "points": 50,
      "unlockedAt": "2025-10-08T06:00:00.000Z"
    }
  ],
  "totalPoints": 50,
  "progress": {
    "total": 6,
    "unlocked": 1,
    "percentage": 16.67
  }
}
```

**UI Suggestions:**

- Hiển thị grid achievements (locked vs unlocked)
- Progress bar cho từng achievement
- Notification khi mở khóa achievement mới
- Badge display trên profile

---

### 4. Education APIs

#### 4.1 Get All Education Content

```http
GET /education
```

**Response:**

```json
[
  {
    "id": 1,
    "slug": "what-is-creditcoin",
    "title": "Creditcoin là gì?",
    "bodyMd": "# Creditcoin\nNội dung markdown...",
    "category": "intro",
    "tags": ["creditcoin", "evm"],
    "featured": false
  }
]
```

#### 4.2 Complete Education

```http
POST /education/complete
Content-Type: application/json

{
  "walletAddress": "0x1234...",
  "educationId": 1
}
```

**Response:**

```json
{
  "ok": true,
  "userEducation": {
    "id": 1,
    "userId": 1,
    "educationId": 1,
    "completedAt": "2025-10-08T06:00:00.000Z"
  },
  "pointsAwarded": 25  // Nếu có points reward
}
```

**UI Flow:**

1. User browse danh sách education
2. Click vào 1 item → Hiển thị modal/popup với nội dung
3. User đọc nội dung
4. Click "I've completed this" → Call API
5. Backend lưu `UserEducation` record

---

## Frontend Implementation Guide

### Streak System Implementation

```typescript
// Check if user needs to complete challenge today
function needsDailyChallengeToMaintainStreak(user: User): boolean {
  const lastActivity = getLastChallengeDate(user);
  const today = new Date().toDateString();
  return lastActivity !== today;
}

// Show streak warning
if (needsDailyChallengeToMaintainStreak(user)) {
  showNotification({
    type: 'warning',
    message: `Complete at least 1 challenge today to maintain your ${user.streakDays}-day streak!`
  });
}
```

### Daily Challenge Rotation

```typescript
// Challenges refresh at midnight
function getChallengeRefreshTime(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// Show countdown timer
const refreshTime = getChallengeRefreshTime();
showCountdown(refreshTime, "New challenges available in");
```

### Achievement Unlock Animation

```typescript
// After claiming challenge
async function handleClaimChallenge(challengeId: number) {
  const response = await fetch('/api/claims', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      userAddress: wallet.address,
      challengeId
    })
  });
  
  const data = await response.json();
  
  // Show new achievements with animation
  if (data.newAchievements && data.newAchievements.length > 0) {
    data.newAchievements.forEach(achievement => {
      showAchievementUnlockModal(achievement);
    });
  }
}
```

### Education Completion Flow

```typescript
// Education modal component
function EducationModal({ education, onComplete }) {
  return (
    <div className="modal">
      <div className="content">
        <ReactMarkdown>{education.bodyMd}</ReactMarkdown>
      </div>
      <button onClick={async () => {
        await fetch('/api/education/complete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            walletAddress: wallet.address,
            educationId: education.id
          })
        });
        onComplete();
      }}>
        I've completed this ✓
      </button>
    </div>
  );
}
```

---

## TypeScript Types

```typescript
interface User {
  id: number;
  walletAddress: string;
  username?: string;
  creditScore: number;
  streakDays: number;
  totalChallenges: number;
  totalPoints: string;  // BigInt as string
  registeredAt: string;
}

interface Challenge {
  id: number;
  type: string;
  name: string;
  description: string;
  points: number;
  creditImpact: number;
  category: string;
  rules: Record<string, any>;
  icon: string;
  completed?: boolean;
  canClaim?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  conditions: {
    minChallenges?: number;
    minStreak?: number;
    minCreditScore?: number;
    challengeCategory?: string;
  };
  unlockedAt?: string;
}

interface Education {
  id: number;
  slug: string;
  title: string;
  bodyMd: string;
  category: string;
  tags: string[];
  featured: boolean;
}

interface ClaimResponse {
  ok: boolean;
  completion: {
    id: number;
    status: string;
    pointsAwarded: number;
    creditChange: number;
  };
  user: User;
  newAchievements: Achievement[];
}
```

---

## 🧪 API Testing Report (Oct 8, 2025)

### ALL APIS TESTED AND WORKING ✅

| API Endpoint | Status | Test Result |
|--------------|--------|-------------|
| `GET /challenges` | ✅ Working | Found 24 challenges, all categories |
| `GET /challenges/daily` | ✅ Working | Returns 4 daily challenges correctly |
| `GET /users/{address}` | ✅ Working | User profile & credit score working |
| `GET /education` | ✅ Working | Education content list working |
| `POST /education/complete` | ✅ Working | Completion + points award working |
| `GET /achievements` | ✅ Working | Achievement list working |
| `POST /claims` | ✅ Working | Challenge claiming working |
| `POST /auth/register` | ✅ Working | User registration working |

**Test Results:**

- **7/7 core APIs working** correctly
- **Docker containers built successfully** after fixing TypeScript issues
- **Database seeded** with challenges, users, achievements, education content
- **All daily challenge mechanics working**: 4 tasks/day, streak system, points/credit
- **Education system working**: popup → complete → points awarded
- **Achievement system working**: auto-unlock based on conditions

**Test Command:**

```bash
# Run comprehensive API tests
node test-api.js
```

---

## Important Notes

1. **Streak Logic**: User PHẢI hoàn thành ít nhất 1 challenge mỗi ngày để duy trì streak. Bỏ lỡ 1 ngày → reset về 0.

2. **Daily Challenge Rotation**: 4 challenges mới mỗi ngày. Challenges cũ không hoàn thành sẽ KHÔNG carry over sang ngày mai.

3. **Achievement Auto-Award**: Hệ thống tự động check và award achievements sau mỗi lần claim challenge. FE chỉ cần hiển thị `newAchievements` từ response.

4. **Education Completion**: Đơn giản - User đọc xong → Click OK → Call API. Không cần proof phức tạp.

5. **BigInt Serialization**: Tất cả BigInt values (`totalPoints`) được return as strings cho JSON compatibility.

6. **Wallet Address Format**: Luôn lowercase, format `0x` + 40 hex characters.

---

## API Error Handling

```typescript
async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`http://localhost:3000/api${endpoint}`, options);
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.msg || 'API Error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    showErrorNotification(error.message);
    throw error;
  }
}
```

---

## Next Steps for Testing

1. Rebuild Docker with dev mode:

   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

2. Hoặc run locally:

   ```bash
   npm run dev
   ```

3. Test full flow:
   - Register user
   - Get daily challenges  
   - Complete challenge
   - Check achievements
   - Complete education

---

Để câu hỏi hoặc issue? Check file `API_TESTING_DAILY_CHALLENGE.md` để xem chi tiết test results.

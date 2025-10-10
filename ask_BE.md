# Ask api BE

Khi connect ví thì FE gọi API để lưu address vào DB. BE sẽ trả về JSON với thông tin user như ví dụ dưới đây.

*Lưu ý:*

- interface Achievement {...} giống vậy là khi user truy cập page thì thực hiện get về, BE trả data giống vậy.
- `FE call via:` Nghĩa là FE post, put gì đó với body là các prop z

Endpoint: `/api/resgister`

```json
{
  "walletAddress": "0x1234...abcd",
  "creditScore": 420,        // default: 300
  "totalChallenges": 15,
  "streakDays": 7,
  "totalPoints": 300,
  "bestStreak": 14,
  "isRegistered": true
}
```

FE call via:

```json
{
  "walletAddress": "0x1234abcd5678ef...",
  "signature": "0xabcdef...", // chữ ký xác thực (tùy chọn)
//   "referralCode": "FRIEND123" // nếu user nhập code người giới thiệu
}
```

## Dashboard (dữ liệu ban đầu)

Các component trên trang `/dashboard` dùng các nguồn dữ liệu sau:

- CreditScore
  - Hiển thị dựa trên JSON trả về từ `/api/resgister` (đã nêu ở trên).

- ChallengesGrid
  - Endpoint: `/api/challenges`
  - Schema (TypeScript-like):

```ts
interface Challenge {
  id: number;
  type: string;
  category: string;
  name: string;
  description?: string;
  points: number;
  creditImpact: number;
  icon?: string;
  estimatedTimeMinutes?: number;
  isCompleted: boolean; // false nếu chưa hoàn thành
}
```

FE call: POST `/api/challenges/:id/submit`

``` json
{
  "walletAddress": "0x1234abcd5678ef...",
  "amount": 100, // optional (ví dụ nhiệm vụ "Deposit $100" cái người dùm điền 100 dô) => Ăn luôn
  "proof": {
    ... Empty because mvp
  }
}
```

BE response OK gì đó ròi có data càng tốt:

```json
{
  "challengeId": 12,
  "isCompleted": true,
  "pointsAwarded": 10,
  "creditChange": 5,
  "newCreditScore": 425,
  "totalPoints": 310,
  "achievementUnlocked": ["first_steps"]
}

```

- AchievementsPreview
  - Endpoint: `/api/achievements/Gained`
  - Lọc: sắp xếp giảm dần theo ngày (mới -> cũ) và chỉ lấy top 3 mục gần nhất.
  - Schema trả về (mỗi item):

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "icon": "string",
  "unlocked": true
}
```

## Trang /achievements

Danh sách achievements full (dùng cho trang /achievements):

```ts
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
```

## Trang /progress

FE có thể reuse `userData` (dữ liệu từ `/api/resgister`) để hiển thị tiến trình của user trên trang `/progress`.

## Trang /education

Endpoint: `/api/education`

Data be mock:

```json
{
  "id": "credit_basics",
  "title": "Credit Score Basics",
  "description": "Learn what affects your credit score",
  "duration": "5 min",
  "points": 25,
  "isCompleted": false
}
```

> Ghi chú: `id` được để dạng string để dễ map với route / slug.

FE call via: POST /api/education/:id/complete

```json
{
  "walletAddress": "0x1234abcd5678ef...",
  "progress": 100,   // %
  "proof": {}
}
```

BE response:

```json
{
  "educationId": "credit_basics",
  "isCompleted": true,
  "pointsAwarded": 25,
  "totalPoints": 325,
  "educationPoints": 25,
  "achievementUnlocked": ["education_starter"]
}

```

## Trang /fan-clubs

Endpoint: `/api/fan-clubs`

Schema trả về (mỗi fan-club):

```ts
interface FanClub {
  id: number;
  kolName: string;
  kolVerified: boolean;
  kolSubtitle?: string; // specialization
  title: string;
  description?: string;
  members: number;
  challenges: number;
  avgEarnings: number; // hiển thị dạng number
  socials: {
    twitter?: string;
    youtube?: string;
    telegram?: string;
  };
  priceLabel: string; // e.g. "100 MOCA"
  image?: string; // cover/thumb nếu có
}
```

FE call api via: POST /api/fan-clubs/join

```json
{
  "walletAddress": "0x1234abcd5678ef...",
  "fanClubId": 2, // club mà user sẽ join
}

```

BE response:

```json
{
  "fanClubId": 2,
  "joinedAt": "2025-10-10T12:00:00Z", // CHọn 1 định dạng duy nhất dễ handle nhất
  "kolName": "NFT Sensei",
  "members": 1521, // Kiểu bạn là thành viên thứ....
  "isJoined": false, // Join bằng true thì reason khỏi để nội dung
  "reason": "The member in this club is full! Please contact with admin and join again! Sorry Sinoo too much!"
}

```

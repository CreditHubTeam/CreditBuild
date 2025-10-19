# Ask api BE

Khi connect ví thì FE gọi API để lưu address vào DB. BE sẽ trả về JSON với thông tin user như ví dụ dưới đây.

*Lưu ý:*

- interface Achievement {...} giống vậy là khi user truy cập page thì thực hiện get về, BE trả data giống vậy.
- `FE call via:` Nghĩa là FE post, put gì đó với body là các prop z

Endpoint: `/api/resgister`  => //DONE => đã chuẩn respond

```json
{
    "ok": true,
    "data": {
        "walletAddress": "0x4411111111111111111111111111111111111111",
        "creditScore": 300,
        "totalChallenges": 0,
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
  - Endpoint: `/api/challenges` =>== đổi lại thành `/api/users/[wallet_address]/challenges` (lấy danh sách các nhiệm vụ đang làm or hoàn thành) == //DONE => đã chuẩn respond
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

Respond:

```json
{
    "ok": true,
    "data": {
        "userChallenges": [
            {
                "id": 1,
                "type": "daily",
                "category": "onboarding",
                "name": "Daily Check-in",
                "description": "Login every day to build your streak",
                "points": 10,
                "creditImpact": 1,
                "icon": "🌞",
                "estimatedTimeMinutes": 1,
                "isCompleted": true
            },
            {
                "id": 2,
                "type": "social",
                "category": "growth",
                "name": "Follow on X",
                "description": "Follow our project account on X (Twitter)",
                "points": 50,
                "creditImpact": 5,
                "icon": "🐦",
                "estimatedTimeMinutes": 2,
                "isCompleted": true
            }
        ]
    }
}
```

FE call: POST `/api/challenges/:id/submit` //DONE => đã chuẩn respond

``` json
{
  "walletAddress": "0x1234abcd5678ef...",
  "amount": 100, // optional (ví dụ nhiệm vụ "Deposit $100" cái người dùm điền 100 dô) => Ăn luôn
  "proof": {"type":"url","value":"https://example.com/proof.png"} // nếu có proof
}
```

```json
{
  "walletAddress": "0x1234abcd5678ef...",
  "amount": 100, // optional (ví dụ nhiệm vụ "Deposit $100" cái người dùm điền 100 dô) => Ăn luôn
  // nếu không có proof => bỏ luôn cái proof
}
```

BE response OK gì đó ròi có data càng tốt:

```json
{
    "ok": true,
    "data": {
        "challengeId": 3,
        "isCompleted": true,
        "pointsAwarded": 10,
        "creditChange": 5,
        "newCreditScore": 425,
        "totalPoints": 160,
        "achievementUnlocked": ""
    }
}

```

- AchievementsPreview
  - Endpoint: `/api/achievements/Gained` => đổi lại thành `/api/users/[wallet_address]/achievements?top=3` (lấy danh sách các achievement đã mở khóa, với tham số `top` để lấy các mục mới nhất, nếu không có `top` thì lấy hết) == //DONE => đã chuẩn respond
  - Lọc: sắp xếp giảm dần theo ngày (mới -> cũ) và chỉ lấy top 3 mục gần nhất.
  - Schema trả về (mỗi item):

```json
{
    "ok": true,
    "data": {
        "achievements": [
            {
                "id": 2,
                "name": "Streak Superstar",
                "description": "Maintain 7-day streak",
                "icon": "🔥",
                "unlocked": true
            },
            {
                "id": 1,
                "name": "First Steps",
                "description": "Complete your first challenge",
                "icon": "🚀",
                "unlocked": true
            }
        ]
    }
}
```

## Trang /achievements

Danh sách achievements full (dùng cho trang /achievements): => xài ``/api/users/[wallet_address]/achievements` ở trên rồi //DONE => đã chuẩn respond

```ts
interface Achievement {
  id: string; // => đang là int
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
```

## Trang /progress

FE có thể reuse `userData` (dữ liệu từ `/api/resgister`) để hiển thị tiến trình của user trên trang `/progress`. //DONE

## Trang /education

Endpoint: `/api/education` => này lấy danh sách các khóa học mà chưa học, tại học xong rồi thì claim achievement thì không hiện nữa => sửa lại thành `/api/users/[wallet_address]/educations?status=no_enrollment` (lấy danh sách các khóa học mà user chưa đăng ký hoặc chưa hoàn thành, `completed`, `in_progress`) //==DONE => đã chuẩn respond

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

=> respond

```json
{
    "ok": true,
    "data": {
        "userEducations": [
            {
                "id": 4,
                "title": "Debt Management Strategies",
                "description": "Learn effective ways to manage and reduce debt",
                "duration": "12 min",
                "points": 60,
                "isCompleted": false
            },
            {
                "id": 5,
                "title": "Emergency Fund Basics",
                "description": "Why you need an emergency fund and how to build one",
                "duration": "8 min",
                "points": 40,
                "isCompleted": false
            }
            //... more educations
        ]
    }
}
```

> Ghi chú: `id` được để dạng string để dễ map với route / slug. => ê ê cái này lỡ xài number rồi, chắc qua demo xong sửa lại ha, với chắc thêm một cột slug riêng, tại id là index rồi á

FE call via: POST /api/education/:id/complete => //DONE => đã chuẩn respond

```json
{
  "walletAddress": "0x1234abcd5678ef...",
  //"progress": 100,   // % => này chưa làm được vì sơ đồ database chưa có mục progress nên là bấm vào coi xong bấm xác nhận thì hoàn thành, 
  //"proof": {} //này demo chắc cũng chưa cần ha
}
```

BE response:

```json
{
    "ok": true,
    "data": {
        "educationId": 5,
        "isCompleted": true,
        "pointsAwarded": 40,
        "totalPoints": 460,
        "educationPoints": 40,
        "achievementUnlocked": null
    }
}
```

## Trang /fan-clubs

Endpoint: `/api/fan-clubs` => hiện tại là vậy đi //==DONE => đã chuẩn respond

nữa chắc sửa thành `api/users/[wallet_address]/fan-clubs` (lấy danh sách các fan-club mà user chưa tham gia)

Schema trả về (mỗi fan-club):

```ts
interface FanClub {
  id: number;
  kolName: string;
  kolVerified: boolean;
  kolSubtitle?: string; // specialization
  title: string; //=> club name 
  description?: string;
  members: number;
  challenges: number; //
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

==respond==

```json
{
    "ok": true,
    "data": {
        "allFanClubs": [
            {
                "id": 1,
                "kolName": "Nguyen",
                "kolVerified": false,
                "kolSubtitle": "specializetion adasd",
                "title": "CreditClub",
                "description": "Credit description",
                "members": 2,
                "challenges": 2,
                "avgEarnings": 15,
                "socials": {
                    "twitter": "twitter.com/test",
                    "instagram": "instagram.com/test",
                    "youtube": "youtube.com/test"
                },
                "priceLabel": "10 MOCA",
                "image": "https://via.placeholder.com/300x150.png?text=Fan+Club"
            }
        ]
    }
}
```

FE call api via: POST /api/fan-clubs/join //==DONE => đã chuẩn respond

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

=> respond

```json
{
    "ok": true,
    "data": {
        "fanClubId": 1,
        "joinedAt": "2025-10-12T02:07:16.319Z",
        "kolName": "Nguyen",
        "members": 3,
        "isJoined": true
    }
}
```

GET /api/users/[wallet_address]
=> respond

```json
{
    "ok": true,
    "data": {
        "walletAddress": "0x1111111111111111111111111111111111111111",
        "creditScore": 420,
        "totalChallenges": 3,
        "streakDays": 5,
        "totalPoints": 150,
        "isRegistered": true,
        "bestStreak": 5
    }
}
```

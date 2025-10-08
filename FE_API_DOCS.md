# CreditBuild API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

No authentication required for current endpoints.

## User Management

### Register User

Create or update a user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890", // Required: Valid Ethereum address
  "username": "testuser"  // Optional: 2-64 characters
}
```

**Response:**

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "username": "testuser",
    "creditScore": 300,
    "streakDays": 0,
    "totalChallenges": 0,
    "totalPoints": "0",  // String format (BigInt)
    "registeredAt": "2025-10-07T05:45:23.456Z"
  }
}
```

### Get User Profile

Retrieve user profile and statistics.

**Endpoint:** `GET /users/{walletAddress}`

**Parameters:**

- `walletAddress`: Ethereum wallet address (0x format)

**Response:**

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "username": "testuser",
    "creditScore": 300,
    "streakDays": 0,
    "totalChallenges": 0,
    "totalPoints": "0",
    "registeredAt": "2025-10-07T05:45:23.456Z"
  },
  "stats": {
    "attempts": 0,
    "last5": []  // Last 5 challenge attempts
  }
}
```

**Error Response (404):**

```json
{
  "ok": false,
  "msg": "Not found"
}
```

## Challenges

### Get Challenge by ID

Retrieve challenge details.

**Endpoint:** `GET /challenges/{id}`

**Parameters:**

- `id`: Challenge ID (number)

**Response:**

```json
{
  "id": 1,
  "type": "payment",
  "name": "Make First Payment",
  "description": "Complete your first payment challenge",
  "points": 100,
  "creditImpact": 5,
  "category": "basic",
  "rules": {}, // Challenge-specific rules
  "icon": "💳",
  "createdAt": "2025-10-07T05:45:23.456Z"
}
```

### Submit Challenge Attempt

Submit proof for a challenge.

**Endpoint:** `POST /challenges/{id}/submit`

**Parameters:**

- `id`: Challenge ID (number)

**Request Body:**

```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890",
  "amount": 100,
  "proof": {
    "txHash": "0xabc...",
    "timestamp": 1696723523456
  }
}
```

**Response:**

```json
{
  "ok": true,
  "attemptId": 1,
  "pointsAwarded": 100,
  "creditChange": 5,
  "txHash": "0xdef456..." // Optional: blockchain transaction hash
}
```

## Education

### Get Education Content

Retrieve educational content by ID.

**Endpoint:** `GET /education/{id}`

**Parameters:**

- `id`: Education content ID or slug

**Response:**

```json
{
  "id": 1,
  "title": "Credit Score Basics",
  "category": "fundamentals",
  "content": "Learn about credit scores...",
  "duration": 300,
  "points": 50,
  "featured": true,
  "createdAt": "2025-10-07T05:45:23.456Z"
}
```

## Utility

### OpenAPI Specification

Get the complete API specification.

**Endpoint:** `GET /openapi`

**Response:** OpenAPI 3.1.0 JSON specification

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:

```json
{
  "ok": false,
  "msg": "Error description"
}
```

## Frontend Integration Tips

### Wallet Address Validation

```javascript
const isValidAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);
```

### API Client Example

```javascript
const API_BASE = 'http://localhost:3000/api';

// Register user
const registerUser = async (walletAddress, username) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, username })
  });
  return response.json();
};

// Get user profile
const getUserProfile = async (walletAddress) => {
  const response = await fetch(`${API_BASE}/users/${walletAddress}`);
  return response.json();
};
```

### TypeScript Types

```typescript
interface User {
  id: number;
  walletAddress: string;
  username?: string;
  creditScore: number;
  streakDays: number;
  totalChallenges: number;
  totalPoints: string; // BigInt as string
  registeredAt: string;
}

interface UserStats {
  attempts: number;
  last5: any[];
}

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  msg?: string;
}
```

## Development Notes

- All BigInt values are returned as strings for JSON compatibility
- Wallet addresses must be in lowercase 0x format
- Username is optional but recommended for better UX
- Challenge proofs are flexible JSON objects
- Education content supports markdown formatting

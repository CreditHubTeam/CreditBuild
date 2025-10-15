# Auto Register User Implementation

## 🎯 Chức năng đã implement

### 1. **Auto Register khi Connect Wallet**

- Khi user connect wallet thành công, system sẽ tự động:
  1. Gọi `getUser(walletAddress)` để kiểm tra user đã tồn tại chưa
  2. Nếu user chưa tồn tại (API trả lỗi) → Tự động gọi `postRegister({ walletAddress })`
  3. Nếu user đã tồn tại → Hiển thị "Welcome back! 👋"

### 2. **Smart Notification System**

- **User mới**: "Welcome! Account created successfully! 🎉"
- **User cũ**: "Welcome back! 👋" (chỉ hiện 1 lần per session)
- **User đã tồn tại nhưng API register fail**: "Welcome back! 👋"

### 3. **Automatic Data Refresh**

- Sau khi register thành công → Auto refresh `currentUser` query
- Tất cả data liên quan sẽ được load tự động

## 🔧 Technical Implementation

### `src/state/data.tsx` - Các thay đổi chính

1. **Import postRegister API**:

```typescript
import { getUser, postRegister } from "@/lib/api/user";
```

2. **Auto Register Mutation**:

```typescript
const mAutoRegister = useMutation({
  mutationKey: ["autoRegister"],
  mutationFn: async (walletAddress: string) => postRegister({ walletAddress }),
  onSuccess: (data, walletAddress) => {
    notify("Welcome! Account created successfully! 🎉", "success");
    setHasWelcomed(walletAddress);
    qc.invalidateQueries({ queryKey: ["currentUser"] });
  },
  onError: (error: Error, walletAddress) => {
    if (error.message.includes("USER_ALREADY_EXISTS") || error.message.includes("already exists")) {
      notify("Welcome back! 👋", "info");
      setHasWelcomed(walletAddress);
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    } else {
      notify("Registration failed. Please try again.", "error");
    }
  },
});
```

3. **Auto Register Effect**:

```typescript
React.useEffect(() => {
  if (!address) {
    setHasWelcomed(null);
    return;
  }

  // Auto register nếu user query failed (user chưa tồn tại)
  if (address && qCurrentUser.isError && !mAutoRegister.isPending) {
    console.log("User not found, auto-registering for address:", address);
    mAutoRegister.mutate(address);
  }
  
  // Welcome back message cho existing user
  if (address && qCurrentUser.data && !qCurrentUser.isLoading && hasWelcomed !== address) {
    console.log("Welcome back user:", qCurrentUser.data);
    notify("Welcome back! 👋", "info");
    setHasWelcomed(address);
  }
}, [address, qCurrentUser.data, qCurrentUser.isError, qCurrentUser.isLoading, mAutoRegister, notify, hasWelcomed]);
```

4. **Updated Type Definition**:

```typescript
type DataCtx = {
  currentUser: User | null;  // Allow null state
  creditPercentage: number;
  // ... other properties
};
```

## 🧪 Test Component

### `src/components/DataTest.tsx` - Test Interface

- Hiển thị wallet status
- Hiển thị current user data
- Hiển thị tất cả data từ các API endpoints
- Instructions để test

### `src/app/test/page.tsx` - Test Page

- Access tại: `/test`
- Để test toàn bộ chức năng

## 🚀 Cách Test

1. **Navigate đến**: `http://localhost:3000/test`
2. **Connect wallet** với address: `0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00`
3. **Quan sát**:
   - Console logs cho auto-register process
   - Notifications hiển thị
   - Data loading từ APIs
   - Current user information

## 📋 API Endpoints được test

- ✅ **POST /register** - Auto register user
- ✅ **GET /users/{walletAddress}** - Get current user
- ✅ **GET /user/{walletAddress}/challenges** - Get user challenges  
- ✅ **GET /api/users/{walletAddress}/educations** - Get user educations
- ✅ **GET /user/{walletAddress}/achievements** - Get user achievements
- ✅ **GET /education** - Get general educations
- ✅ **GET /fan-clubs** - Get fan clubs

## 🎯 Flow hoạt động

```
1. User connects wallet
   ↓
2. DataProvider detects new address
   ↓  
3. Automatically calls getUser(address)
   ↓
4a. If user exists:
    → Show "Welcome back! 👋"
    → Load all user data
   ↓
4b. If user not found (API error):
    → Auto call postRegister({ walletAddress })
    → Show "Welcome! Account created successfully! 🎉"
    → Refresh currentUser query
    → Load all user data
```

Clean, simple implementation với proper error handling và UX notifications! 🎉

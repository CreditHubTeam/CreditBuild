# Fix: Spam API Calls Issue

## 🚨 **Vấn đề đã fix:**

**Problem**: Code spam call API register liên tục khi fail, gây performance issues và server overload.

**Root Cause**:

- useEffect dependency array bao gồm `qCurrentUser.isError`
- Khi register fail, `isError` vẫn true và trigger lại useEffect
- Không có mechanism để ngăn chặn retry attempts

## 🔧 **Solutions Applied:**

### 1. **Registration Attempt Tracking**

```typescript
const [registrationAttempted, setRegistrationAttempted] = React.useState<Set<string>>(new Set());
```

- Track các wallet addresses đã thử register
- Ngăn chặn multiple attempts cho cùng 1 address

### 2. **Enhanced Auto Register Mutation**

```typescript
const mAutoRegister = useMutation({
  mutationFn: async (walletAddress: string) => {
    // Mark that we've attempted registration for this address
    setRegistrationAttempted(prev => new Set(prev).add(walletAddress));
    return postRegister({ walletAddress });
  },
  // ... error handling không retry automatically
});
```

- Mark registration attempt ngay khi start
- Không auto-retry khi có real errors

### 3. **Improved useEffect Logic**

```typescript
// Separate effects để tránh unnecessary re-triggers
React.useEffect(() => {
  if (
    address && 
    qCurrentUser.isError && 
    !mAutoRegister.isPending && 
    !registrationAttempted.has(address)  // ✅ Key fix: chỉ try 1 lần
  ) {
    mAutoRegister.mutate(address);
  }
}, [address, qCurrentUser.isError, mAutoRegister, registrationAttempted]);
```

**Key Changes:**

- ✅ Kiểm tra `!registrationAttempted.has(address)` trước khi retry
- ✅ Tách useEffect cho auto-register và welcome message
- ✅ Cleaner dependency arrays

### 4. **State Reset on Address Change**

```typescript
React.useEffect(() => {
  if (!address) {
    setHasWelcomed(null);
    setRegistrationAttempted(new Set()); // Reset attempts when disconnect
  }
}, [address]);
```

- Reset attempts khi user disconnect/switch wallet
- Clean state management

## 🧪 **Debug Tools Added:**

### `src/components/DebugAutoRegister.tsx`

- Real-time log monitoring
- Current status display
- Test instructions
- Network call monitoring helper

### Updated Test Page: `/test`

- Debug component + Data test trong same page
- Easy troubleshooting

## 📊 **Before vs After:**

### ❌ **Before (Problem):**

```
Connect wallet → getUser fails → Auto register → Register fails → 
Auto register again → Register fails → Auto register again → ∞ SPAM
```

### ✅ **After (Fixed):**

```
Connect wallet → getUser fails → Auto register (mark attempted) → 
Register fails → STOP (no more attempts for this address)
```

## 🚀 **Testing:**

1. **Existing User Test:**
   - Connect: `0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00`
   - Should see: "Welcome back! 👋" (no registration attempt)

2. **New User Test:**
   - Connect: `0x1234567890123456789012345678901234567890`
   - Should see: 1 registration attempt only, no spam

3. **Network Monitor:**
   - Open DevTools → Network tab
   - Watch for repeated POST requests to `/register`
   - Should see maximum 1 request per address

## 💡 **Prevention Measures:**

- ✅ Registration attempt tracking
- ✅ Clean state management
- ✅ Separated useEffect logic
- ✅ Proper error handling without auto-retry
- ✅ Debug tools for monitoring

**Result**: No more spam API calls, clean UX, better performance! 🎉

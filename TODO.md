# Todo for the MVP production

 Để đi “bài bản & chuyên nghiệp” cho production, chuyển dần từ **Context tự code** sang kiến trúc chuẩn theo module (feature-based), dùng **wagmi + viem** cho ví/EVM, tách **UI state** và **domain state**, đưa dữ liệu thật qua **API/Server Actions** có kiểm tra schema (zod), thêm test/CI, logging, v.v.

---

# Phase 1 — Tổ chức lại kiến trúc & route

## Cấu trúc thư mục (feature-first)

```
src/
  app/
    (marketing)/page.tsx          # landing công khai
    dashboard/page.tsx            # sau khi login/đúng network
    achievements/page.tsx
    progress/page.tsx
    education/page.tsx
    api/
      users/register/route.ts     # ví dụ API route (POST)
  components/
    ui/                           # design system: Button, Card, Modal, Toast...
    nav/                          # Header, BottomNav
    dashboard/                    # CreditScore, ChallengesGrid...
    modal/                        # Modal con
  providers/
    wallet.tsx                    # wagmi + Query client provider
    ui.tsx                        # UI state provider (modals/toast)
  features/
    wallet/                       # hook + service ví (wagmi wrapper)
    user/                         # hooks server/client: user profile, registration
    challenges/                   # query hooks, mutations
  lib/
    chains/creditcoin.ts          # định nghĩa chain EVM
    schemas.ts                    # zod schema chung
    types.ts
    utils.ts
```

* **UI state (mở/đóng modal, toast, loading)** vẫn dùng một **UIContext nhẹ** (không trộn domain).
* **Domain state** (ví, user, thử thách…) dùng **wagmi + TanStack Query** (wagmi đã dùng Query dưới nắp capo).

---

# Phase 2 — Ví & mạng EVM chuẩn (wagmi + viem)

## 1) Cài đặt

```bash
npm i wagmi viem @tanstack/react-query
# nếu cần connector:
npm i @wagmi/core @walletconnect/ethereum-provider
```

## 2) Định nghĩa chain Creditcoin Testnet (viem)

`src/lib/chains/creditcoin.ts`

```ts
import { defineChain } from "viem";

export const creditcoinTestnet = defineChain({
  id: 102031,                              // chainId decimal
  name: "Creditcoin Testnet",
  nativeCurrency: { name: "Creditcoin", symbol: "CTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.cc3-testnet.creditcoin.network"] },
    public:  { http: ["https://rpc.cc3-testnet.creditcoin.network"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://creditcoin-testnet.blockscout.com" },
  },
});
```

## 3) Khởi tạo wagmi + Query Provider

`src/providers/wallet.tsx`

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { creditcoinTestnet } from "@/lib/chains/creditcoin";

const config = createConfig({
  chains: [creditcoinTestnet],
  connectors: [injected()],
  transports: { [creditcoinTestnet.id]: http(creditcoinTestnet.rpcUrls.default.http[0]) },
  ssr: true,
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
```

## 4) Gắn Provider vào layout

`src/app/layout.tsx`

```tsx
import WalletProvider from "@/providers/wallet";
import UIProvider from "@/providers/ui"; // provider UI cho modal/toast riêng
// ...meta, fonts, styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <UIProvider>{children}</UIProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
```

## 5) Thay thế mock connect/network switch bằng hook wagmi

* Kết nối ví: `useConnect`, `useAccount`, `useDisconnect`
* Chuyển network: `useSwitchChain` (wagmi), fallback EIP-1193 cho ví không hỗ trợ.

`src/features/wallet/useWallet.ts`

```ts
"use client";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { creditcoinTestnet } from "@/lib/chains/creditcoin";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain, isPending: isSwitching } = useSwitchChain();

  const correctChainId = creditcoinTestnet.id;
  const onConnectInjected = () => connect({ connector: injected() });

  const onSwitchToCreditcoin = async () => {
    // wagmi way (ưu tiên)
    try {
      switchChain({ chainId: correctChainId });
      return;
    } catch {}
    // fallback thuần EIP-1193
    const ethereum = (window as any).ethereum;
    if (!ethereum?.request) throw new Error("No EIP-1193 provider");
    const hexId = "0x" + correctChainId.toString(16);
    try {
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexId }] });
    } catch (err: any) {
      // 4902 = chain chưa add -> add
      if (err?.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: hexId,
            chainName: creditcoinTestnet.name,
            rpcUrls: creditcoinTestnet.rpcUrls.default.http,
            nativeCurrency: creditcoinTestnet.nativeCurrency,
            blockExplorerUrls: [creditcoinTestnet.blockExplorers?.default?.url],
          }],
        });
      } else {
        throw err;
      }
    }
  };

  const isCorrectNetwork = chain?.id === correctChainId;

  return {
    address, isConnected, chain, isCorrectNetwork,
    isConnecting, isSwitching,
    onConnectInjected, onSwitchToCreditcoin, disconnect, chains,
  };
}
```

> Sau khi có hook này, **NetworkSwitchModal** của bạn chỉ việc gọi `onSwitchToCreditcoin`. **Header** gọi `onConnectInjected`/`disconnect`. Không còn “bấm không ăn”.

---

# Phase 3 — Tách UI state & cập nhật component

Giữ Context chỉ cho UI (modal/toast). Domain (ví/user/challenges) dùng hooks riêng.

`src/providers/ui.tsx`

```tsx
"use client";
import { createContext, useContext, useState } from "react";

type ModalId = "wallet" | "network" | "registration" | "challenge" | null;

const UIContext = createContext<{
  modal: ModalId; setModal: (m: ModalId)=>void;
  toast: { type: "info"|"success"|"error"|"warning"; message: string } | null;
  setToast: (t: UIContextType["toast"]) => void;
} | null>(null);

type UIContextType = React.ContextType<typeof UIContext>;

export default function UIProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalId>(null);
  const [toast, setToast] = useState<UIContextType["toast"]>(null);

  return <UIContext.Provider value={{ modal, setModal, toast, setToast }}>{children}</UIContext.Provider>;
}
export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be inside UIProvider");
  return ctx;
};
```

Ví dụ trong **Header**:

```tsx
import { useWallet } from "@/features/wallet/useWallet";
import { useUI } from "@/providers/ui";

export default function Header() {
  const { isConnected, address, isCorrectNetwork, onConnectInjected, disconnect } = useWallet();
  const { setModal } = useUI();

  return (
    <header>
      {!isConnected ? (
        <button onClick={() => onConnectInjected()}>Connect</button>
      ) : (
        <div>
          <span>{address?.slice(0,6)}...{address?.slice(-4)}</span>
          {!isCorrectNetwork && <button onClick={() => setModal("network")}>Switch Network</button>}
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </header>
  );
}
```

**NetworkSwitchModal**:

```tsx
import { useWallet } from "@/features/wallet/useWallet";
import { useUI } from "@/providers/ui";

export default function NetworkSwitchModal() {
  const { modal, setModal } = useUI();
  const { onSwitchToCreditcoin, isSwitching } = useWallet();
  if (modal !== "network") return null;

  return (
    <div className="modal">
      <button
        disabled={isSwitching}
        onClick={async () => {
          try { await onSwitchToCreditcoin(); setModal(null); }
          catch (e) { /* show toast error */ }
        }}
      >
        {isSwitching ? "Switching..." : "Switch to Creditcoin Testnet"}
      </button>
    </div>
  );
}
```

---

# Phase 4 — Dữ liệu thật, API & Server Actions

* Dùng **API Route** hoặc **Server Action** để lưu dữ liệu off-chain (user profile, achievements, progress).
* Validate bằng **zod**, chống input bẩn.
* Tương tác on-chain: tạo `contracts/creditbuild.ts` (ABI, address) + hooks `useCreditBuildRead/Write`.

## Ví dụ API register (POST)

`src/lib/schemas.ts`

```ts
import { z } from "zod";
export const RegisterSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  goal: z.enum(["improve","build","maintain"]),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
```

`src/app/api/users/register/route.ts`

```ts
import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // TODO: lưu DB (Prisma/Drizzle). Demo trả mock:
  return NextResponse.json({ ok: true, user: { ...parsed.data, creditScore: 300 } });
}
```

## Client action gọi API + Query invalidate

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { address: string; goal: string }) => {
      const res = await fetch("/api/users/register", { method: "POST", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Register failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
```

> Sau khi “đăng ký”, hiển thị toast, redirect `router.push("/dashboard")`.

---

# Phase 5 — Contract hooks (viem)

`src/features/wallet/creditbuildContract.ts`

```ts
import { Address } from "viem";
export const CREDITBUILD_ADDRESS: Address = "0xYourDeployedContract";
export const CREDITBUILD_ABI = [
  // ABI rút gọn: e.g. function submitChallenge(uint256 id, uint256 amount) external
] as const;
```

Hook ghi đọc:

```ts
"use client";
import { useWriteContract, useReadContract } from "wagmi";
import { CREDITBUILD_ADDRESS, CREDITBUILD_ABI } from "./creditbuildContract";

export function useSubmitChallenge() {
  const { writeContractAsync, isPending } = useWriteContract();
  const submit = (id: bigint, amount: bigint) =>
    writeContractAsync({
      address: CREDITBUILD_ADDRESS,
      abi: CREDITBUILD_ABI,
      functionName: "submitChallenge",
      args: [id, amount],
    });
  return { submit, isPending };
}
```

> Kết hợp optimistic UI + toast. Gắn guard `isCorrectNetwork` trước khi gọi.

---

# Phase 6 — Chất lượng dự án

* **Env & secrets**:

  * `NEXT_PUBLIC_` cho client (ví dụ WalletConnect projectId).
  * Server-only để gọi dịch vụ (DB URL, API key).
* **Kiểm tra & format**: ESLint + Prettier + `husky` + `lint-staged`.
* **Tests**:

  * Unit: Vitest
  * UI: React Testing Library
  * E2E: Playwright
* **CI/CD**: GitHub Actions (lint + test + build), Vercel dynamic deploy.
* **Observability**: Sentry + Vercel Analytics (đặc biệt cho lỗi web3).
* **A11y & UX**: focus ring, keyboard nav, reduced motion, toasts thân thiện.
* **Hiệu năng**: `next/image`, `dynamic import`, memo, virtualization nếu list dài.
* **Storybook**: xây design system cho UI 8-bit (Button/Card/Modal/Toast) → giúp dev nhanh & đồng nhất.

---

## Checklist “chuyển từ mock → prod”

1. ✅ Tách **UIContext** (modal/toast) và **wallet hooks (wagmi)**.
2. ✅ Thay **mock switch** bằng `useSwitchChain` (+ EIP-1193 fallback).
3. ✅ Dùng **route thật** (`/dashboard`, `/achievements`, …) thay vì `currentPage` trong state.
4. ✅ Kết nối **API** cho registration/challenges; validate **zod**; lưu **DB** (Prisma/Drizzle).
5. ✅ Tạo **contract hooks** (read/write) với **wagmi/viem**; quản lý lỗi & loading.
6. ✅ Thêm **tests + CI**, **logging**, **env**.
7. ✅ Dọn **components/ui** thành **design system 8-bit** dùng lại toàn app.

Next step => `wallet.tsx`, `useWallet.ts`, `ui.tsx`, sửa lại `Header`, `NetworkSwitchModal`, và chuyển các page sang route `/dashboard`… để bạn copy-paste ngay.

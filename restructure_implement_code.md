# Implement clean + Restructure code

# Hướng dẫn tập 1

 Chuẩn hoá **state kiến trúc theo module (multi-context + hooks domain)**, nối **wagmi** một cách “đúng bài” (SSR-safe), thêm **Creditcoin Testnet** (chainId 102031) và thay thế `useApp` bằng các hook chuyên trách: `useWallet`, `useNetwork`, `useUI`, `useData`. Bên dưới là **document step-by-step** + **code khung** .

> Tình trạng: (AppContext quá “all-in-one”, hook `useApp` lẫn nhiều domain, network switch đang mock…). Dưới đây là lộ trình refactor + code mẫu tương thích với cấu trúc hiện tại.

---

# Mục tiêu refactor FE

1. **Tách state theo domain** để giảm re-render & dễ maintain:

   * `UI` (modals, loading, notification)
   * `Wallet/Network` (connectors, connect/disconnect, switch chain, SSR cookie hydration)
   * `Data` (challenges, education, achievements, submit challenge → gọi BE)
   * `User` (hồ sơ, dashboard tổng hợp – có thể nằm trong Data)

2. **Chuẩn hóa wagmi**: dùng `defineChain` cho **Creditcoin Testnet (102031)**, SSR hydration (`cookieToInitialState`), connectors `injected` & `walletConnect`.

3. **Thay `useApp`** bằng **hooks domain**: `useUI()`, `useWallet()`, `useNetwork()`, `useData()`.
   => Component chỉ subscribe phần mình cần → ít render, code rõ ràng.

4. **Routing & Page Guards**: BottomNav/Router check `isConnected` + `networkOk` chuẩn wagmi.

---

# CẤU TRÚC MỚI (FE)

```
src/
  app/
    layout.tsx              # giữ như hiện tại (cookieToInitialState)
    providers.tsx           # gộp Wagmi + React Query + UI + Wallet + Data
  features/                 # nhóm UI theo tính năng (dashboard, education...)
    dashboard/
      ConnectionPanel.tsx
      CreditScore.tsx
      ChallengesGrid.tsx
      ...
    education/
      EducationList.tsx
      ...
    achievements/
      ...
  ui/                       # UI primitives
    Modal.tsx
    Notification.tsx
    Loading.tsx
    ...
  state/                    # NEW: multi-context + hooks
    ui.tsx                  # UIProvider + useUI
    wallet.tsx              # WalletProvider + useWallet
    network.tsx             # Network helpers + useNetwork
    data.tsx                # DataProvider + useData (call BE, cache bằng React Query)
  lib/
    wagmi.ts                # defineChain(Creditcoin testnet), connectors
    http.ts                 # fetch wrapper (with baseURL)
    types.ts                # (giữ)
```

> Bạn không cần xoá ngay AppContext cũ. Làm theo **Phase** dưới đây để chuyển dần.

---

## Phase 0 – Wagmi: định nghĩa Creditcoin testnet + SSR

`src/lib/wagmi.ts`

```ts
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, walletConnect } from 'wagmi/connectors'

export const creditcoinTestnet = defineChain({
  id: 102031,
  name: 'Creditcoin Testnet',
  nativeCurrency: { name: 'Creditcoin', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network/'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' } },
  testnet: true,
})

export function getConfig() {
  return createConfig({
    chains: [creditcoinTestnet],
    connectors: [
      injected(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! })
    ],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    transports: { [creditcoinTestnet.id]: http('https://rpc.cc3-testnet.creditcoin.network/') }
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
```

> `layout.tsx` của bạn đã có `cookieToInitialState` → giữ nguyên (ok chuẩn SSR).

---

## Phase 1 – UI state (modals, loading, notification)

`src/state/ui.tsx`

```tsx
'use client'
import React, { createContext, useContext, useCallback, useState } from 'react'

type ModalId = 'walletSelection' | 'networkSwitch' | 'registration' | 'challenge' | null
type NoticeType = 'success'|'error'|'warning'|'info'

type UIState = {
  modal: ModalId
  loading: { visible: boolean; message: string }
  notice: { visible: boolean; message: string; type: NoticeType }
}

type UIContextType = UIState & {
  open: (m: Exclude<ModalId, null>) => void
  close: () => void
  showLoading: (msg?: string) => void
  hideLoading: () => void
  notify: (message: string, type?: NoticeType) => void
  clearNotice: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalId>(null)
  const [loading, setLoading] = useState({ visible: false, message: 'Processing...' })
  const [notice, setNotice] = useState({ visible: false, message: '', type: 'info' as NoticeType })

  const open = useCallback((m: Exclude<ModalId, null>) => setModal(m), [])
  const close = useCallback(() => setModal(null), [])
  const showLoading = useCallback((msg?: string) => setLoading({ visible: true, message: msg ?? 'Processing...' }), [])
  const hideLoading = useCallback(() => setLoading({ visible: false, message: 'Processing...' }), [])
  const notify = useCallback((message: string, type: NoticeType = 'info') => setNotice({ visible: true, message, type }), [])
  const clearNotice = useCallback(() => setNotice((n) => ({ ...n, visible: false })), [])

  return (
    <UIContext.Provider value={{ modal, loading, notice, open, close, showLoading, hideLoading, notify, clearNotice }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within <UIProvider>')
  return ctx
}
```

**Thay thế nhanh trong component**

* `Notification` → `const { notice, clearNotice } = useUI()`
* `LoadingIndicator` → `const { loading } = useUI()`
* Các modal → `const { modal, open, close } = useUI()` (đổi id: `walletSelection`, `networkSwitch`, …)

---

## Phase 2 – Wallet/Network state (wagmi-native, không mock)

`src/state/wallet.tsx`

```tsx
'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { creditcoinTestnet } from '@/lib/wagmi'
import { useUI } from './ui'

type WalletCtx = {
  address?: `0x${string}`
  isConnected: boolean
  chainId: number | null
  networkOk: boolean
  connectors: ReturnType<typeof useConnect>['connectors']
  connect: ReturnType<typeof useConnect>['connectAsync']
  disconnect: ReturnType<typeof useDisconnect>['disconnect']
  ensureCreditcoin: () => Promise<void>
}

const WalletContext = createContext<WalletCtx | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()
  const { showLoading, hideLoading, notify, open, close } = useUI()

  const networkOk = chainId === creditcoinTestnet.id

  async function ensureCreditcoin() {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      notify('No injected wallet found', 'warning'); return
    }
    const provider = (window as any).ethereum
    const hexId = '0x' + creditcoinTestnet.id.toString(16)

    showLoading('Switching network...')
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexId }] })
      hideLoading(); notify('Switched to Creditcoin Testnet ⛓️', 'success'); close()
    } catch (err: any) {
      // add chain then switch
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: hexId,
            chainName: creditcoinTestnet.name,
            nativeCurrency: creditcoinTestnet.nativeCurrency,
            rpcUrls: creditcoinTestnet.rpcUrls.default.http,
            blockExplorerUrls: [creditcoinTestnet.blockExplorers!.default!.url]
          }]
        })
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexId }] })
        hideLoading(); notify('Creditcoin Testnet added & switched ✅', 'success'); close()
      } catch {
        hideLoading(); notify('Network switch rejected', 'error')
      }
    }
  }

  const value = useMemo<WalletCtx>(() => ({
    address: address as `0x${string}` | undefined,
    isConnected,
    chainId: chainId || null,
    networkOk,
    connectors,
    connect: connectAsync,
    disconnect,
    ensureCreditcoin
  }), [address, isConnected, chainId, networkOk, connectors, connectAsync, disconnect])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within <WalletProvider>')
  return ctx
}
```

> Giờ **Header/BottomNav/Modals** không cần state mock. Chúng lấy `address, isConnected, networkOk, ensureCreditcoin()` từ `useWallet()`.

---

## Phase 3 – Data (challenges, education, achievements, submit…)

`src/lib/http.ts`

```ts
export const api = {
  base: process.env.NEXT_PUBLIC_API_BASE ?? '',
  async get<T>(path: string) {
    const r = await fetch(`${api.base}${path}`, { cache: 'no-store' })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<T>
  },
  async post<T>(path: string, body: any) {
    const r = await fetch(`${api.base}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<T>
  }
}
```

`src/state/data.tsx`

```tsx
'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/http'
import { useWallet } from './wallet'
import { useUI } from './ui'

type Challenge = { id:number; name:string; description?:string; points:number; creditImpact:number; icon?:string }
type EducationItem = { id:number; slug:string; title:string; bodyMd:string; category:string; tags:string[] }

type DataCtx = {
  challenges: Challenge[]
  education: EducationItem[]
  refreshChallenges: () => void
  submitChallenge: (challengeId: number, payload: { amount?: number; proof?: any }) => Promise<void>
}

const DataContext = createContext<DataCtx | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()
  const { address, networkOk } = useWallet()
  const { showLoading, hideLoading, notify } = useUI()

  const qChallenges = useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.get<Challenge[]>('/api/challenges'),
  })

  const qEducation = useQuery({
    queryKey: ['education'],
    queryFn: () => api.get<EducationItem[]>('/api/education'),
  })

  const mSubmit = useMutation({
    mutationKey: ['submitChallenge'],
    mutationFn: async ({ challengeId, amount, proof }: { challengeId:number; amount?:number; proof?:any }) => {
      if (!address) throw new Error('Wallet not connected')
      return api.post(`/api/challenges/${challengeId}/submit`, { walletAddress: address, amount, proof })
    },
    onMutate: () => showLoading('Submitting challenge...'),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify('Challenge Completed! 🎉', 'success')
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (e:any) => notify(e.message ?? 'Submit failed', 'error')
  })

  const value = useMemo<DataCtx>(() => ({
    challenges: qChallenges.data ?? [],
    education: qEducation.data ?? [],
    refreshChallenges: () => qc.invalidateQueries({ queryKey: ['challenges'] }),
    submitChallenge: (challengeId, payload) => mSubmit.mutateAsync({ challengeId, ...payload }),
  }), [qChallenges.data, qEducation.data, qc, mSubmit])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}
```

---

## Phase 4 – Providers aggregator

`src/app/providers.tsx` (thay file hiện tại bằng bản này)

```tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from '@/lib/wagmi'
import { UIProvider } from '@/state/ui'
import { WalletProvider } from '@/state/wallet'
import { DataProvider } from '@/state/data'

export function Providers({ children, initialState }: { children: ReactNode; initialState?: State }) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <WalletProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </WalletProvider>
        </UIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

> `layout.tsx` của bạn đã đúng hướng (SSR wagmi). Giữ nguyên metadata, font, và `<Providers initialState={initialState}>...`.

---

## Phase 5 – Cập nhật components dùng hook mới

**Header.tsx** (rút gọn, không đụng global AppContext)

```tsx
'use client'
import { useWallet } from '@/state/wallet'
import { useUI } from '@/state/ui'

export default function Header() {
  const { address, isConnected, networkOk, connectors, connect, disconnect, ensureCreditcoin } = useWallet()
  const { open, notify } = useUI()

  return (
    <header className="w-full bg-mc-brown border-b-4 border-mc-darkbrown shadow-pixel sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="bg-mc-gold text-mc-darkbrown px-2 sm:px-4 py-1 sm:py-2 border-3 border-mc-darkbrown pixel-inset font-bold text-[8px] sm:text-[10px] whitespace-nowrap">
            <span className="hidden sm:inline">⛏️ CREDITCOIN</span>
            <span className="sm:hidden">⛏️ CC</span>
          </div>
          <h1 className="text-white text-sm sm:text-base drop-shadow truncate">CreditBuild</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {!isConnected ? (
            <button
              onClick={async () => {
                const injected = connectors.find(c => c.id === 'injected') ?? connectors[0]
                if (!injected) return notify('No wallet connector found', 'warning')
                await connect({ connector: injected })
              }}
              className="pixel-btn pixel-btn--primary text-[8px] sm:text-[12px] px-2 sm:px-4 py-1 sm:py-2"
            >
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1 sm:gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="bg-mc-darkstone text-white px-1 sm:px-2 py-1 border-2 border-black text-[8px] sm:text-[10px] max-w-[100px] sm:max-w-none truncate">
                  {address?.slice(0,6)}...{address?.slice(-4)}
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`text-xs ${networkOk ? "text-mc-green" : "text-mc-red"}`}>{networkOk ? "🟢" : "🔴"}</span>
                  <span>{networkOk ? "Creditcoin Testnet" : "Wrong Network"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!networkOk && (
                  <button onClick={ensureCreditcoin} className="pixel-btn pixel-btn--secondary text-[10px] px-2 py-1">
                    Switch Network
                  </button>
                )}
                <button onClick={() => disconnect()} className="pixel-btn pixel-btn--secondary text-[10px] px-2 py-1">
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
```

**ChallengesGrid.tsx** (đọc từ `useData`)

```tsx
'use client'
import { useData } from '@/state/data'
import { useUI } from '@/state/ui'

export default function ChallengesGrid() {
  const { challenges } = useData()
  const { open } = useUI()
  return (
    <div className="pixel-card p-5 mb-5">
      <h2 className="text-xl mb-4">Daily Challenges</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {challenges.map((c) => (
          <button key={c.id} onClick={() => open('challenge')} className="text-left bg-mc-dirt border-3 border-mc-darkbrown rounded-pixel p-4 hover:-translate-y-0.5 transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-mc-gold px-3 py-2 border-2 border-mc-darkbrown rounded-pixel">{c.icon ?? '🎯'}</div>
              <div className="font-bold">{c.name}</div>
            </div>
            <div className="text-[11px] opacity-90 mb-2">{c.description}</div>
            <div className="text-[11px] flex gap-3">
              <span className="pixel-badge bg-mc-green text-white">💰 {c.points} Points</span>
              <span className="pixel-badge bg-mc-blue text-white">📈 +{c.creditImpact} Credit</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

**ChallengeModal.tsx** (submit thật qua BE)

```tsx
'use client'
import { useState } from 'react'
import { useUI } from '@/state/ui'
import { useData } from '@/state/data'
import Modal from '@/ui/Modal' // nếu muốn tái dùng PixelModal hiện có thì import nó

export default function ChallengeModal() {
  const { modal, close } = useUI()
  const { submitChallenge } = useData()
  const [amount, setAmount] = useState<number>(0)

  if (modal !== 'challenge') return null

  return (
    <Modal title="Complete Challenge" onClose={close}>
      <form onSubmit={async (e) => { e.preventDefault(); await submitChallenge(/* challengeId */ 1, { amount, proof:{ type:'number', value:amount } }); close(); }}>
        <label className="text-[10px]">Amount ($):</label>
        <input type="number" className="w-full text-black p-2 border-2 border-black rounded mb-3" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
        <button className="pixel-btn pixel-btn--primary w-full">Complete</button>
      </form>
    </Modal>
  )
}
```

> Các modal khác (WalletSelectionModal, NetworkSwitchModal, RegistrationModal) đổi sang dùng `useWallet()`/`useUI()` tương tự – bỏ mock trong `AppContext`. (Bạn có thể lần lượt migrate từng modal).

---

## Phase 6 – Điều chỉnh Navigation & Guards

* **Landing “Get Started”**:

  * Nếu `!isConnected` → open(`walletSelection`)
  * Nếu `isConnected && !networkOk` → `ensureCreditcoin()`
  * Nếu đã ok → push `/dashboard`

* **BottomNav**: trước khi `router.push(path)` → nếu `!isConnected` hoặc `!networkOk` thì `notify()`.

---

## Phase 7 – Env & Build

`.env.local`

```
NEXT_PUBLIC_API_BASE=
NEXT_PUBLIC_WC_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`package.json` scripts giữ như hiện tại (Next 15 + Turbopack). (Bạn **không cần** `requirements.txt` vì đây là **Node/Next**.)

---

## Phase 8 – Kế hoạch migrate “không downtime”

1. **Thêm Providers mới** (UI, Wallet, Data) song song `AppContext` cũ.
2. **Chuyển từng component**: Header → BottomNav → Modals → Dashboard pages.
3. **Xoá AppContext** khi không còn import `useApp`.
4. **Kết nối BE thật**: cắm `NEXT_PUBLIC_API_BASE` đến service backend (đã định nghĩa API ở phần backend trước đó).
5. **Kiểm thử**:

   * Kết nối ví, switch chain (thật) → chainId `102031`.
   * `GET /api/challenges`, `POST /api/challenges/:id/submit` chạy ok (BE ledger + optional on-chain).
   * Education & Dashboard dùng React Query lấy data chuẩn.

---

## Map “useApp → hooks mới”

| Trước (useApp)                          | Sau (hook mới)                                       |
| --------------------------------------- | ---------------------------------------------------- |
| `isWalletConnected`                     | `useWallet().isConnected`                            |
| `currentUser`                           | (sẽ lấy từ BE qua `useData()` hoặc `useUser()`)      |
| `currentChainId` / `network`            | `useWallet().chainId` / `useWallet().networkOk`      |
| `connectToWallet` / `disconnectWallet`  | `useWallet().connect()` / `useWallet().disconnect()` |
| `switchToCorrectNetwork`                | `useWallet().ensureCreditcoin()`                     |
| `showModal` / `closeModals`             | `useUI().open()` / `useUI().close()`                 |
| `showNotification` / `hideNotification` | `useUI().notify()` / `useUI().clearNotice()`         |
| `showLoading` / `hideLoading`           | `useUI().showLoading()` / `useUI().hideLoading()`    |
| `challenges`, `education`               | `useData().challenges` / `useData().education`       |
| `completeChallenge`                     | `useData().submitChallenge(id, payload)`             |

---

## Vì sao cách này “đúng bài” & chuyên nghiệp?

* **Phân tầng rõ (UI/Wallet/Data)** → component chỉ rerender khi slice của nó đổi.
* **wagmi SSR-safe** (đã có `cookieToInitialState`) → không mất connect state khi refresh.
* **Dễ mở rộng**: thêm `dashboard` query, `achievements` query, `user` profile… chỉ thêm ở `state/data.tsx`.
* **Thay blockchain**? Chỉ sửa `defineChain()` + `.env`.
* **Loại bỏ “mock network switch”** → dùng `wallet_addEthereumChain`/`wallet_switchEthereumChain` thật.

---

# Hướng dẫn tập 2

# 0) Chuẩn bị & dependency (1 lần)

**Cài thêm (nếu thiếu):**

```bash
npm i wagmi viem @tanstack/react-query zod
```

**tsconfig (alias `@/*`)** – nếu chưa có:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

**ENV FE:**

```
# FE gọi BE nội bộ Next API, để trống là đủ
NEXT_PUBLIC_API_BASE=
# WalletConnect (nếu dùng)
NEXT_PUBLIC_WC_PROJECT_ID=xxxxxxx
```

---

# 1) Phase 0 – Wagmi + Creditcoin testnet (SSR-safe)

**`src/lib/wagmi.ts`**

```ts
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, walletConnect } from 'wagmi/connectors'

export const creditcoinTestnet = defineChain({
  id: 102031,
  name: 'Creditcoin Testnet',
  nativeCurrency: { name: 'Creditcoin', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network/'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' } },
  testnet: true,
})

export function getConfig() {
  return createConfig({
    chains: [creditcoinTestnet],
    connectors: [
      injected(),
      ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
        ? [walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! })]
        : [])
    ],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    transports: {
      [creditcoinTestnet.id]: http('https://rpc.cc3-testnet.creditcoin.network/')
    }
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
```

**`src/app/providers.tsx`**

```tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from '@/lib/wagmi'
import { UIProvider } from '@/state/ui'
import { WalletProvider } from '@/state/wallet'
import { DataProvider } from '@/state/data'

export function Providers({ children, initialState }: { children: ReactNode; initialState?: State }) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <WalletProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </WalletProvider>
        </UIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

> `layout.tsx` giữ `cookieToInitialState(config)` như bạn đang dùng.

---

# 2) Phase 1 – UI primitives + UI state (multi-context)

**Primitives: `src/ui/Modal.tsx`**

```tsx
'use client'
export default function Modal({
  title, onClose, children
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white text-black rounded-md w-[92%] max-w-md p-4 border-2 border-black">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="px-2 py-1 border border-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

**`src/ui/Notification.tsx`**

```tsx
'use client'
import { useUI } from '@/state/ui'

export default function Notification() {
  const { notice, clearNotice } = useUI()
  if (!notice.visible) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-2 rounded-md text-white shadow-lg ${{
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-slate-700'
      }[notice.type]}`}>
        <div className="flex items-center gap-3">
          <span>{notice.message}</span>
          <button onClick={clearNotice} className="underline">Close</button>
        </div>
      </div>
    </div>
  )
}
```

**`src/ui/Loading.tsx`**

```tsx
'use client'
import { useUI } from '@/state/ui'
export default function LoadingGlobal() {
  const { loading } = useUI()
  if (!loading.visible) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white text-black px-5 py-3 border-2 border-black rounded-md">
        {loading.message}
      </div>
    </div>
  )
}
```

**UI state: `src/state/ui.tsx`**

```tsx
'use client'
import React, { createContext, useContext, useCallback, useState } from 'react'

type ModalId = 'walletSelection'|'networkSwitch'|'registration'|'challenge'|null
type NoticeType = 'success'|'error'|'warning'|'info'
type UIState = {
  modal: ModalId
  loading: { visible: boolean; message: string }
  notice: { visible: boolean; message: string; type: NoticeType }
}
type UIContextType = UIState & {
  open: (m: Exclude<ModalId,null>) => void
  close: () => void
  showLoading: (msg?: string) => void
  hideLoading: () => void
  notify: (message: string, type?: NoticeType) => void
  clearNotice: () => void
}
const UIContext = createContext<UIContextType|null>(null)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalId>(null)
  const [loading, setLoading] = useState({ visible:false, message:'Processing...' })
  const [notice, setNotice] = useState({ visible:false, message:'', type:'info' as NoticeType })

  const open = useCallback((m: Exclude<ModalId,null>) => setModal(m), [])
  const close = useCallback(() => setModal(null), [])
  const showLoading = useCallback((msg?:string)=>setLoading({ visible:true, message:msg ?? 'Processing...' }),[])
  const hideLoading = useCallback(()=>setLoading({ visible:false, message:'Processing...' }),[])
  const notify = useCallback((message:string,type:NoticeType='info')=>setNotice({ visible:true, message, type }),[])
  const clearNotice = useCallback(()=>setNotice((n)=>({ ...n, visible:false })),[])

  return <UIContext.Provider value={{ modal, loading, notice, open, close, showLoading, hideLoading, notify, clearNotice }}>
    {children}
  </UIContext.Provider>
}
export const useUI = () => {
  const ctx = useContext(UIContext); if (!ctx) throw new Error('useUI must be used within <UIProvider>'); return ctx
}
```

---

# 3) Phase 2 – Wallet/Network (wagmi thuần, không mock)

**`src/state/wallet.tsx`**

```tsx
'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { creditcoinTestnet } from '@/lib/wagmi'
import { useUI } from './ui'

type WalletCtx = {
  address?: `0x${string}`
  isConnected: boolean
  chainId: number | null
  networkOk: boolean
  connectors: ReturnType<typeof useConnect>['connectors']
  connect: ReturnType<typeof useConnect>['connectAsync']
  disconnect: ReturnType<typeof useDisconnect>['disconnect']
  ensureCreditcoin: () => Promise<void>
}
const WalletContext = createContext<WalletCtx|null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()
  const { showLoading, hideLoading, notify, close } = useUI()
  const networkOk = chainId === creditcoinTestnet.id

  async function ensureCreditcoin() {
    const eth = (window as any)?.ethereum
    if (!eth) { notify('No injected wallet found','warning'); return }
    const hexId = '0x' + creditcoinTestnet.id.toString(16)
    showLoading('Switching network...')
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params:[{ chainId: hexId }] })
      hideLoading(); notify('Switched to Creditcoin Testnet ⛓️','success'); close()
    } catch {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: hexId,
            chainName: creditcoinTestnet.name,
            nativeCurrency: creditcoinTestnet.nativeCurrency,
            rpcUrls: creditcoinTestnet.rpcUrls.default.http,
            blockExplorerUrls: [creditcoinTestnet.blockExplorers!.default!.url]
          }]
        })
        await eth.request({ method:'wallet_switchEthereumChain', params:[{ chainId: hexId }] })
        hideLoading(); notify('Creditcoin Testnet added & switched ✅','success'); close()
      } catch {
        hideLoading(); notify('Network switch rejected','error')
      }
    }
  }

  const value = useMemo<WalletCtx>(() => ({
    address: address as `0x${string}`|undefined,
    isConnected,
    chainId: chainId || null,
    networkOk,
    connectors,
    connect: connectAsync,
    disconnect,
    ensureCreditcoin
  }), [address, isConnected, chainId, networkOk, connectors, connectAsync, disconnect])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
export const useWallet = () => {
  const ctx = useContext(WalletContext); if (!ctx) throw new Error('useWallet must be used within <WalletProvider>'); return ctx
}
```

---

# 4) Phase 3 – Data layer (React Query; challenges, education, dashboard, ledger)

**`src/lib/http.ts`**

```ts
export const api = {
  base: process.env.NEXT_PUBLIC_API_BASE ?? '',
  async get<T>(path: string) {
    const r = await fetch(`${api.base}${path}`, { cache: 'no-store' })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<T>
  },
  async post<T>(path: string, body: unknown) {
    const r = await fetch(`${api.base}${path}`, {
      method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body)
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<T>
  }
}
```

**`src/state/data.tsx`**

```tsx
'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/http'
import { useWallet } from './wallet'
import { useUI } from './ui'

type Challenge = { id:number; name:string; description?:string; points:number; creditImpact:number; icon?:string }
type EducationItem = { id:number; slug:string; title:string; bodyMd:string; category:string; tags:string[] }
type Dashboard = {
  profile: { walletAddress:string; creditScore:number; totalPoints: string | number }
  completed: number
  recentAttempts: any[]
  leaderboard: { walletAddress:string; totalPoints:string|number; creditScore:number }[]
}
type LedgerItem = { id:number; delta:string|number; reason:string; source:string; txHash?:string; createdAt:string }

type DataCtx = {
  challenges: Challenge[]
  education: EducationItem[]
  dashboard?: Dashboard
  ledger?: LedgerItem[]
  refreshChallenges: () => void
  refreshDashboard: () => void
  submitChallenge: (challengeId: number, payload: { amount?: number; proof?: any }) => Promise<void>
}

const DataContext = createContext<DataCtx|null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()
  const { address } = useWallet()
  const { showLoading, hideLoading, notify } = useUI()

  const qChallenges = useQuery({ queryKey:['challenges'], queryFn: () => api.get<Challenge[]>('/api/challenges') })
  const qEducation  = useQuery({ queryKey:['education'],  queryFn: () => api.get<EducationItem[]>('/api/education') })
  const qDashboard  = useQuery({
    queryKey:['dashboard', address],
    enabled: !!address,
    queryFn: () => api.get<{ ok:boolean; data:Dashboard }>(`/api/dashboard?address=${address}`).then(r=>r.data)
  })
  const qLedger = useQuery({
    queryKey:['ledger', address],
    enabled: !!address,
    queryFn: () => api.get<LedgerItem[]>(`/api/users/${address}`).then((r:any)=> r.user?.ledger ?? [])
  })

  const mSubmit = useMutation({
    mutationKey:['submitChallenge'],
    mutationFn: async ({ challengeId, amount, proof }: { challengeId:number; amount?:number; proof?:any }) => {
      if (!address) throw new Error('Wallet not connected')
      return api.post(`/api/challenges/${challengeId}/submit`, { walletAddress: address, amount, proof })
    },
    onMutate: () => showLoading('Submitting challenge...'),
    onSettled: () => hideLoading(),
    onSuccess: () => {
      notify('Challenge Completed! 🎉','success')
      qc.invalidateQueries({ queryKey:['dashboard'] })
      qc.invalidateQueries({ queryKey:['ledger'] })
    },
    onError: (e:any) => notify(e.message ?? 'Submit failed','error')
  })

  const value = useMemo<DataCtx>(() => ({
    challenges: qChallenges.data ?? [],
    education: qEducation.data ?? [],
    dashboard: qDashboard.data,
    ledger: qLedger.data,
    refreshChallenges: () => qc.invalidateQueries({ queryKey:['challenges'] }),
    refreshDashboard: () => qc.invalidateQueries({ queryKey:['dashboard'] }),
    submitChallenge: (challengeId, payload) => mSubmit.mutateAsync({ challengeId, ...payload }),
  }), [qChallenges.data, qEducation.data, qDashboard.data, qLedger.data, qc, mSubmit])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
export const useData = () => {
  const ctx = useContext(DataContext); if (!ctx) throw new Error('useData must be used within <DataProvider>'); return ctx
}
```

---

# 5) Phase 4 – Component hoá: Header, Education, Dashboard, Ledger

**Header** (nút connect, switch network) – ví dụ đã gửi trước, dùng `useWallet()`/`useUI()`.

**Education list: `src/features/education/EducationList.tsx`**

```tsx
'use client'
import { useData } from '@/state/data'
export default function EducationList() {
  const { education } = useData()
  return (
    <div className="pixel-card p-4">
      <h2 className="text-lg font-bold mb-3">Learn & Earn</h2>
      <div className="grid gap-3">
        {education.map(item => (
          <div key={item.id} className="border-2 border-black rounded-md p-3 bg-white text-black">
            <div className="font-bold">{item.title}</div>
            <div className="text-xs opacity-80">{item.category} • {item.tags.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Challenges grid: `src/features/dashboard/ChallengesGrid.tsx`**

```tsx
'use client'
import { useData } from '@/state/data'
import { useUI } from '@/state/ui'

export default function ChallengesGrid() {
  const { challenges, submitChallenge } = useData()
  const { showLoading, hideLoading, notify } = useUI()
  return (
    <div className="pixel-card p-4">
      <h2 className="text-lg font-bold mb-3">Daily Challenges</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {challenges.map(c => (
          <div key={c.id} className="border-2 border-black rounded-md p-3 bg-white text-black">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{c.icon ?? '🎯'}</div>
              <div className="font-bold">{c.name}</div>
            </div>
            <div className="text-xs opacity-80 mb-2">{c.description}</div>
            <div className="text-xs mb-3">💰 {c.points} • 📈 +{c.creditImpact}</div>
            <button
              className="px-3 py-1 border-2 border-black rounded bg-black text-white"
              onClick={async ()=>{
                try{
                  showLoading('Submitting...');
                  await submitChallenge(c.id, { proof: { type:'action', value:'click' } })
                  notify('Completed!', 'success')
                }catch(e:any){ notify(e.message ?? 'Fail','error') }
                finally{ hideLoading() }
              }}
            >Complete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**CreditScore: `src/features/dashboard/CreditScore.tsx`**

```tsx
'use client'
import { useData } from '@/state/data'
export default function CreditScore() {
  const { dashboard } = useData()
  if (!dashboard) return null
  const p = dashboard.profile
  return (
    <div className="pixel-card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">{p.walletAddress.slice(0,6)}...{p.walletAddress.slice(-4)}</div>
          <div className="text-2xl font-bold">Credit Score: {p.creditScore}</div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70">Total Points</div>
          <div className="text-xl font-bold">{p.totalPoints as any}</div>
        </div>
      </div>
    </div>
  )
}
```

**Leaderboard: `src/features/dashboard/Leaderboard.tsx`**

```tsx
'use client'
import { useData } from '@/state/data'
export default function Leaderboard() {
  const { dashboard } = useData()
  if (!dashboard) return null
  return (
    <div className="pixel-card p-4">
      <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
      <div className="grid gap-2">
        {dashboard.leaderboard.map((u, i)=>(
          <div key={u.walletAddress} className="flex items-center justify-between border-2 border-black p-2 bg-white text-black rounded-md">
            <div>#{i+1} {u.walletAddress.slice(0,6)}...{u.walletAddress.slice(-4)}</div>
            <div>Pts {u.totalPoints as any} • CS {u.creditScore}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**LedgerTable (history): `src/features/history/LedgerTable.tsx`**

```tsx
'use client'
import { useData } from '@/state/data'
export default function LedgerTable() {
  const { ledger } = useData()
  if (!ledger) return null
  return (
    <div className="pixel-card p-4">
      <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
      <div className="grid gap-2">
        {ledger.map(l => (
          <div key={l.id} className="flex items-center justify-between border-2 border-black p-2 bg-white text-black rounded-md">
            <div className="text-xs">{l.reason} — {new Date(l.createdAt).toLocaleString()}</div>
            <div className="text-xs font-bold">Δ {String(l.delta)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

# 6) Phase 5 – Guards & Page tích hợp

**Guard hook: `src/state/network.tsx`**

```tsx
'use client'
import { useEffect } from 'react'
import { useWallet } from './wallet'
import { useUI } from './ui'
import { useRouter } from 'next/navigation'

export function useRequireWalletNetwork() {
  const { isConnected, networkOk, ensureCreditcoin } = useWallet()
  const { notify } = useUI()
  const router = useRouter()
  useEffect(() => {
    if (!isConnected) { notify('Please connect wallet','warning'); router.push('/') }
    else if (!networkOk) { notify('Wrong network. Switching...','warning'); ensureCreditcoin() }
  }, [isConnected, networkOk])
}
```

**Landing page CTA:**

* Nếu chưa connect → nút `Connect Wallet`.
* Nếu connect sai network → nút `Switch Network`.
* Nếu ok → nút `Go to Dashboard`.

**Dashboard page** (ghép các block)

```tsx
// src/app/dashboard/page.tsx
'use client'
import { useRequireWalletNetwork } from '@/state/network'
import CreditScore from '@/features/dashboard/CreditScore'
import ChallengesGrid from '@/features/dashboard/ChallengesGrid'
import Leaderboard from '@/features/dashboard/Leaderboard'
import LedgerTable from '@/features/history/LedgerTable'

export default function DashboardPage() {
  useRequireWalletNetwork()
  return (
    <div className="container mx-auto p-4 grid gap-4">
      <CreditScore />
      <ChallengesGrid />
      <Leaderboard />
      <LedgerTable />
    </div>
  )
}
```

**Education page**

```tsx
// src/app/education/page.tsx
'use client'
import EducationList from '@/features/education/EducationList'
export default function EducationPage(){ return <div className="container mx-auto p-4"><EducationList/></div> }
```

**Global UI mount** (thêm vào `app/layout.tsx` tree chỗ cuối body):

```tsx
// ví dụ trong layout hoặc root component
import Notification from '@/ui/Notification'
import LoadingGlobal from '@/ui/Loading'
// ...
<body>
  <Providers initialState={initialState}>
    {children}
    <Notification />
    <LoadingGlobal />
  </Providers>
</body>
```

---

# 7) Phase 6 – Modal chuyên dụng (tuỳ chọn)

Nếu bạn muốn tách modal riêng thay vì nút trong Header:

**WalletSelectionModal.tsx**

```tsx
'use client'
import Modal from '@/ui/Modal'
import { useUI } from '@/state/ui'
import { useWallet } from '@/state/wallet'

export default function WalletSelectionModal(){
  const { modal, close } = useUI()
  const { connectors, connect } = useWallet()
  if (modal !== 'walletSelection') return null
  return (
    <Modal title="Connect Wallet" onClose={close}>
      <div className="grid gap-2">
        {connectors.map(c => (
          <button key={c.id} className="px-3 py-2 border-2 border-black rounded bg-black text-white"
            onClick={async()=>{ await connect({ connector:c }); close(); }}>
            {c.name}
          </button>
        ))}
      </div>
    </Modal>
  )
}
```

**NetworkSwitchModal.tsx** – call `ensureCreditcoin()` từ `useWallet()`.

---

# 8) Phase 7 – Thay thế dần `useApp` & AppContext

Checklist migrate:

1. **Header** → dùng `useWallet`/`useUI`.
2. **BottomNav/Sidebar** → guard trước khi `push`.
3. **Modal** → chuyển sang `UIProvider`/`WalletProvider` (xoá dependency `useApp`).
4. **Pages**: `dashboard`, `education`, `missions` gọi data từ `useData`.
5. Khi không còn import `useApp` ở đâu → **xoá `AppContext`** + **`useApp`**.

Mẹo tìm nhanh:

```bash
grep -R "useApp" src | cat
```

---

# 9) Phase 8 – Test nhanh (E2E local)

* **Seed BE** xong (như doc backend): có 3 challenges, 3 bài education.
* FE:

  1. Mở `/` → Connect Wallet (MetaMask).
  2. Switch sang **Creditcoin Testnet (102031)**.
  3. Vào `/dashboard` → thấy Credit Score, Challenges, Leaderboard.
  4. Nhấn **Complete** một challenge → thông báo 🎉, dashboard & ledger cập nhật.
  5. `/education` → list hiển thị.

---

## Tại sao kiến trúc này đúng chuẩn?

* **Multi-context theo domain**: UI/Wallet/Data → component chỉ rerender khi slice state của nó đổi.
* **wagmi SSR**: không mất state khi F5.
* **Data layer = React Query**: caching/invalidate mạch lạc; BE có thể scale (router API hoặc tách service).
* **Dễ mở rộng**: thêm `achievements`, `profile editor`, `admin`,… chỉ việc thêm module tương ứng.

---

## Gợi ý làm gì tiếp theo?

* maybe do **`Achievements` feature** (FE + BE route), **Upload Proof (ảnh + URL)**, hoặc **WalletConnect modal đẹp** theo pixel-style hiện có.

---

# Hướng dẫn tập 3: (Reff thôi, chứ thấy lạc đề)

Gia sư sẽ “đi nốt” toàn bộ phần FE theo kiến trúc mới, kèm **kế hoạch triển khai**, **code cụ thể** cho các tính năng còn thiếu (challenge detail + proof động theo `rules`, education chi tiết/markdown, achievements, leaderboard page, history), và **checklist test**.

---

# Kế hoạch tổng (FE)

**Goal**: Clean kiến trúc + đủ tính năng MVP để demo:

* Kết nối ví + switch Creditcoin Testnet (102031)
* Dashboard (CreditScore, ChallengesGrid, Leaderboard, Ledger)
* Challenge detail + **submit proof** theo `rules` (image/url/tx/number…)
* Education (list + **detail markdown**)
* Achievements (tường thành tích; đọc từ API user)
* Guard (yêu cầu ví + đúng network)

**Lộ trình thực hiện**

1. Hoàn tất **multi-context** (UI/Wallet/Data) — đã xong khung.
2. Thêm **forms/tiện ích** (file→Base64, markdown render).
3. Implement **ChallengeModal (động theo rules)**.
4. Education **detail** (markdown).
5. Achievements **wall** + page.
6. Leaderboard page (riêng /leaderboard).
7. Guards + Nav hoàn chỉnh.
8. Test E2E với BE thật.

---

# Cài thêm phụ thuộc (nếu thiếu) => Phải biết business có cần này không

```bash
npm i react-markdown
```

---

# Cập nhật Data types & helpers

## 1) Cập nhật `Challenge` type để có `rules`

`src/state/data.tsx` (chỉ phần type ở đầu file – **thay** định nghĩa `Challenge`):

```tsx
type RuleSet = {
  cooldown?: { unit: 'hour'|'day'|'week'; value: number }
  minAmount?: number
  requiresProof?: boolean
  allowedProofTypes?: string[] // ["image","url","tx","number"]
  maxClaimsPerWeek?: number
}

type Challenge = {
  id: number
  name: string
  description?: string
  points: number
  creditImpact: number
  icon?: string
  rules?: RuleSet
}
```

> BE `/api/challenges` đang trả đầy đủ trường (gồm `rules`). Nếu chưa, bạn có thể thêm nhanh ở repo backend (select full).

## 2) Tiện ích file → Base64

`src/lib/file.ts`

```ts
export async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bin = Buffer.from(buf).toString('base64')
  return `data:${file.type};base64,${bin}`
}
```

---

# Challenge Detail + Submit Proof (động theo `rules`)

## 3) Modal hiển thị theo `allowedProofTypes`

`src/features/challenges/ChallengeModal.tsx`

```tsx
'use client'
import Modal from '@/ui/Modal'
import { useUI } from '@/state/ui'
import { useData } from '@/state/data'
import { useEffect, useMemo, useState } from 'react'
import { fileToBase64 } from '@/lib/file'

export default function ChallengeModal() {
  const { modal, close, notify, showLoading, hideLoading } = useUI()
  const { challenges, submitChallenge } = useData()
  const [activeId, setActiveId] = useState<number | null>(null)

  // Bạn có thể mở modal kèm state challengeId (tuỳ cách gọi). Ở đây minh hoạ: giữ id cuối cùng.
  useEffect(() => {
    // no-op: bạn có thể setActiveId khi bấm "Complete" tại ChallengesGrid, truyền qua context hoặc param
  }, [modal])

  const ch = useMemo(() => challenges.find(x => x.id === activeId), [challenges, activeId])
  const rules = ch?.rules ?? {}

  const [amount, setAmount] = useState<number | ''>('')
  const [url, setUrl] = useState('')
  const [tx, setTx] = useState('')
  const [image64, setImage64] = useState<string | null>(null)

  if (modal !== 'challenge') return null

  const allowed = new Set(rules.allowedProofTypes ?? [])
  const needProof = !!rules.requiresProof

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) { // 2MB limit
      notify('Image too large (>2MB)', 'warning')
      e.currentTarget.value = ''
      return
    }
    const b64 = await fileToBase64(f)
    setImage64(b64)
  }

  return (
    <Modal title={ch ? `Complete: ${ch.name}` : 'Complete Challenge'} onClose={close}>
      {!ch ? (
        <div className="text-sm">No challenge selected. Hãy mở modal kèm ID hoặc chọn từ danh sách.</div>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              showLoading('Submitting...')
              const proof: any = {}
              if (allowed.has('number') && amount !== '') proof.amount = Number(amount)
              if (allowed.has('url') && url) proof.url = url
              if (allowed.has('tx') && tx) proof.tx = tx
              if (allowed.has('image') && image64) proof.image = image64

              if (needProof && Object.keys(proof).length === 0) {
                notify('Proof is required by rules', 'warning'); return
              }
              // payload chuẩn: amount riêng (nếu có) + proof object
              await submitChallenge(ch.id, {
                amount: typeof amount === 'number' ? amount : undefined,
                proof: Object.keys(proof).length ? { type:'multi', ...proof } : undefined
              })
              close()
            } catch (err:any) {
              notify(err.message ?? 'Submit failed', 'error')
            } finally {
              hideLoading()
            }
          }}
        >
          <div className="text-xs opacity-80">{ch.description}</div>

          {allowed.has('number') && (
            <div>
              <label className="text-[11px]">Amount</label>
              <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value===''? '': Number(e.target.value))}
                     className="w-full text-black p-2 border-2 border-black rounded" placeholder={`min ${rules.minAmount ?? 0}`} />
            </div>
          )}

          {allowed.has('url') && (
            <div>
              <label className="text-[11px]">Proof URL</label>
              <input type="url" value={url} onChange={(e)=>setUrl(e.target.value)}
                     className="w-full text-black p-2 border-2 border-black rounded" placeholder="https://..." />
            </div>
          )}

          {allowed.has('tx') && (
            <div>
              <label className="text-[11px]">On-chain Tx Hash</label>
              <input value={tx} onChange={(e)=>setTx(e.target.value)} className="w-full text-black p-2 border-2 border-black rounded" placeholder="0x..." />
            </div>
          )}

          {allowed.has('image') && (
            <div>
              <label className="text-[11px]">Screenshot (max 2MB)</label>
              <input type="file" accept="image/*" onChange={onFileChange} />
              {image64 && <img src={image64} alt="preview" className="mt-2 max-h-40 border-2 border-black rounded" />}
            </div>
          )}

          <button className="mt-2 px-3 py-2 border-2 border-black rounded bg-black text-white">
            Submit
          </button>
        </form>
      )}
    </Modal>
  )
}
```

> Cách **mở modal kèm ID**: khi bấm nút “Complete” trong `ChallengesGrid`, bạn có thể set `activeId` qua context UI (thêm `ui.setData({ activeChallengeId })`) hoặc chuyển `ChallengeModal` thành component nhận `challengeId` từ props. Để đơn giản: bạn có thể **gắn `activeId` vào UIContext** (thêm trường `ctx.challengeId`, `setChallenge(id)`).

**Ví dụ sửa `ChallengesGrid` để mở modal đúng ID**
(đoạn handler):

```tsx
onClick={() => {
  // nếu bạn thêm UI context method setChallengeId:
  // setChallengeId(c.id); open('challenge')
  // Hoặc tạm thời dùng querystring / state manager tuỳ bạn
}}
```

---

# Education Detail (markdown)

## 4) Page hiển thị markdown

`src/features/education/EducationDetail.tsx`

```tsx
'use client'
import ReactMarkdown from 'react-markdown'

export default function EducationDetail({ title, bodyMd }:{ title:string; bodyMd:string }) {
  return (
    <div className="pixel-card p-4">
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <article className="prose max-w-none prose-p:my-2 prose-h2:mt-6">
        <ReactMarkdown>{bodyMd}</ReactMarkdown>
      </article>
    </div>
  )
}
```

`src/app/education/[slug]/page.tsx`

```tsx
'use client'
import { useEffect, useState } from 'react'
import EducationDetail from '@/features/education/EducationDetail'

export default function EduDetailPage({ params }:{ params:{ slug:string }}) {
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async()=>{
      try{
        const r = await fetch(`/api/education/${params.slug}`, { cache: 'no-store' })
        if (!r.ok) throw new Error(await r.text())
        setData(await r.json())
      }catch(e:any){ setErr(e.message ?? 'Load failed') }
    })()
  }, [params.slug])

  if (err) return <div className="p-4 text-sm text-red-500">{err}</div>
  if (!data) return <div className="p-4 text-sm">Loading...</div>

  return <div className="container mx-auto p-4">
    <EducationDetail title={data.title} bodyMd={data.bodyMd} />
  </div>
}
```

> Ở `EducationList.tsx`, link sang detail: `<Link href={`/education/${item.slug}`}>…</Link>`

---

# Achievements (tường thành tích)

## 5) Wall component (đọc từ `/api/users/[address]`)

`src/features/achievements/AchievementsWall.tsx`

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@/state/wallet'

type UA = { achievement:{ id:string; name:string; description?:string; icon?:string }, unlockedAt:string }

export default function AchievementsWall() {
  const { address } = useWallet()
  const [items, setItems] = useState<UA[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    fetch(`/api/users/${address}`, { cache: 'no-store' })
      .then(res => res.json())
      .then((r) => {
        // tuỳ payload BE; giả định r.user.achievements = [{achievement, unlockedAt}]
        setItems(r?.user?.achievements ?? [])
      })
      .finally(()=>setLoading(false))
  }, [address])

  if (!address) return null
  if (loading) return <div className="p-4 text-sm">Loading achievements...</div>

  return (
    <div className="pixel-card p-4">
      <h2 className="text-lg font-bold mb-3">Achievements</h2>
      {items.length === 0 ? <div className="text-xs opacity-70">No achievements yet.</div> :
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {items.map((ua) => (
           <div key={ua.achievement.id} className="border-2 border-black rounded-md p-3 bg-white text-black">
             <div className="text-2xl">{ua.achievement.icon ?? '🏆'}</div>
             <div className="font-bold">{ua.achievement.name}</div>
             <div className="text-[11px] opacity-80">{ua.achievement.description}</div>
             <div className="text-[10px] opacity-60 mt-1">Unlocked: {new Date(ua.unlockedAt).toLocaleDateString()}</div>
           </div>
         ))}
       </div>}
    </div>
  )
}
```

`src/app/achievements/page.tsx`

```tsx
'use client'
import { useRequireWalletNetwork } from '@/state/network'
import AchievementsWall from '@/features/achievements/AchievementsWall'
export default function AchievementsPage(){
  useRequireWalletNetwork()
  return <div className="container mx-auto p-4"><AchievementsWall/></div>
}
```

> Nếu BE chưa include `user.achievements` trong `/api/users/[address]`, chỉ cần update UsersService ở backend (`include: { achievements: { include: { achievement: true } } }`).

---

# Leaderboard page riêng (ngoài dashboard)

## 6) Trang /leaderboard

`src/app/leaderboard/page.tsx`

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function LeaderboardPage(){
  const [rows, setRows] = useState<{ walletAddress:string; totalPoints:any; creditScore:number }[]>([])
  useEffect(()=>{
    // reuse dashboard aggregate; hoặc tạo route riêng /api/leaderboard
    fetch('/api/dashboard?address=0x0000000000000000000000000000000000000000')
      .then(r=>r.json()).then(r=>setRows(r?.data?.leaderboard ?? []))
  },[])
  return (
    <div className="container mx-auto p-4">
      <div className="pixel-card p-4">
        <h2 className="text-lg font-bold mb-3">Leaderboard</h2>
        <div className="grid gap-2">
          {rows.map((u,i)=>(
            <div key={u.walletAddress} className="flex items-center justify-between border-2 border-black rounded-md p-2 bg-white text-black">
              <div>#{i+1} {u.walletAddress.slice(0,6)}...{u.walletAddress.slice(-4)}</div>
              <div>Pts {u.totalPoints} • CS {u.creditScore}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

> Tối ưu: làm API `/api/leaderboard` để không cần param giả.

---

# Navigation/Guard hoàn chỉnh

## 7) Hook Guard đã có: `useRequireWalletNetwork()`

Áp vào các page “private”: `/dashboard`, `/achievements`.

**Nav bảo vệ điều hướng**: trước khi `router.push(path)`, nếu `!isConnected` → open(`walletSelection`), nếu `!networkOk` → `ensureCreditcoin()`.

---

# Bổ sung: Switch Explorer link cho tx

Trong `LedgerTable.tsx`/`ChallengesGrid` bạn có thể render link:

```tsx
const EXPLORER = 'https://creditcoin-testnet.blockscout.com';
{l.txHash && <a target="_blank" href={`${EXPLORER}/tx/${l.txHash}`} className="underline">View Tx</a>}
```

---

# Checklist test E2E (FE + BE)

1. **Connect** MetaMask → connect & `networkOk` (Creditcoin Testnet 102031).
2. **Dashboard**: profile (CS/Points), challenges list, leaderboard hiển thị.
3. **Challenge Modal** mở đúng ID, hiển thị trường theo `rules.allowedProofTypes`.
4. **Submit** → noti success; dashboard & ledger invalidated và hiển thị bản ghi mới.
5. **Education** list + **detail** markdown.
6. **Achievements**: hiển thị danh sách; nếu BE chưa include → cập nhật BE.
7. **Leaderboard** page riêng.
8. **Reload** (SSR wagmi) vẫn giữ connect state (cookie storage).
9. **Wrong network** → guard tự switch hoặc cảnh báo.

---

# Gợi ý hoàn thiện tiếp theo (t tuỳ chọn)

* **UI đẹp & thống nhất**: trích style pixel hiện có, đóng gói `pixel-card`, `pixel-btn`, `pixel-badge` thành components trong `src/ui/`.
* **Proof upload lên storage**: thay vì Base64 inline, upload sang S3/R2, BE lưu URL trong `proof`.
* **Skeleton loading**: React Query `placeholderData` + skeleton components.
* **I18n** (vi/en) cho UI text.
* **Error Boundary** cho trang page.
* **E2E tests** (Playwright) cho 3 flow: connect + switch, submit challenge, xem tx.

---

Có thể bắt đầu từ **ChallengeModal (động)** + **Education detail** trước (nhanh nhất thấy hiệu quả). Bước tiếp theo call gia sư đei **UI method setChallengeId** trong `UIProvider` (để mở modal đúng ID) và patch `ChallengesGrid` .

# Codebase: 10:32-290925

## Directory Structure: main src folder

```text
fe-credit-build/
  src/
    app/
      achievements/
        page.tsx
      dashboard/
        page.tsx
      education/
        page.tsx
      favicon.ico
      globals.css
      layout.tsx
      page.tsx
      progress/
        page.tsx
      providers.tsx
    components/
      AppLayout.tsx
      BottomNav.tsx
      Dashboard/
        AchievementsPreview.tsx
        ChallengesGrid.tsx
        ConnectionPanel.tsx
        CreditScore.tsx
      Header.tsx
      LoadingIndicator.tsx
      Modals/
        ChallengeModal.tsx
        NetworkSwitchModal.tsx
        PixelModal.tsx
        RegistrationModal.tsx
        WalletSelectionModal.tsx
      Pages/
        AchievementsPage.tsx
        EducationPage.tsx
        ProgressPage.tsx
      UI/
        Notification.tsx
    context/
      AppContext.tsx
    hooks/
      useApp.ts
    lib/
      appData.ts
      types.ts
```

## Files

### package.json

```json
{
  "name": "fe-credit-build",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next": "15.5.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "@eslint/eslintrc": "^3"
  }
}
```

### src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import Providers from "./providers";
import AppLayout from "@/components/AppLayout";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "CreditBuild - Gamified Credit Builder",
  description: "Build your credit like Minecraft!",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className={pressStart.variable}>
      <body className={`${pressStart.className} text-[12px] leading-6 text-white bg-transparent`}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
```

### src/app/globals.css

```css
@import "tailwindcss";

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ====== 8-bit Minecraft theme (tokens) ====== */
@theme {
  /* font families */
  --font-pixel: "Press Start 2P", monospace;

  /* colors (mc-*) */
  --color-mc-brown: #8B4513;
  --color-mc-darkbrown: #654321;
  --color-mc-green: #228B22;
  --color-mc-gold: #FFD700;
  --color-mc-stone: #696969;
  --color-mc-darkstone: #4A4A4A;
  --color-mc-lightstone: #808080;
  --color-mc-dirt: #8B5A2B;
  --color-mc-oak: #DEB887;
  --color-mc-red: #CD5C5C;
  --color-mc-blue: #4682B4;

  /* radius & border */
  --radius-pixel: 4px;
  --border-3: 3px;
  --border-4: 4px;

  /* shadows */
  --shadow-pixel: 4px 4px 0 rgba(0, 0, 0, 0.3);
  --shadow-pixel-inset:
    inset 2px 2px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3);

  /* keyframes */
  @keyframes pulse2 {
    0% { opacity: 1 }
    50% { opacity: .5 }
    100% { opacity: 1 }
  }
}

/* ====== base layout ====== */
html, body { min-height: 100dvh }

body {
  /* nền “khối đá” 8-bit */
  background:
    linear-gradient(45deg, var(--color-mc-stone) 25%, var(--color-mc-lightstone) 25%,
      var(--color-mc-lightstone) 50%, var(--color-mc-stone) 50%,
      var(--color-mc-stone) 75%, var(--color-mc-lightstone) 75%);
  background-size: 40px 40px;
  font-family: var(--font-pixel);
  color: white;
}

/* ====== utilities 8-bit tuỳ biến (v4 dùng @utility) ====== */
@utility pixel-box {
  @apply border-[var(--border-4)] border-black rounded-[var(--radius-pixel)];
  box-shadow: var(--shadow-pixel);
}

@utility pixel-inset { box-shadow: var(--shadow-pixel-inset); }

@utility pixel-btn {
  @apply text-xs px-4 py-2 rounded-[var(--radius-pixel)] border-[var(--border-3)] border-black;
  box-shadow: var(--shadow-pixel);
}

@utility pixel-btn-primary { @apply bg-mc-gold text-black; }
@utility pixel-btn-secondary { @apply bg-mc-dirt text-white; }

@utility pixel-card {
  @apply bg-mc-dirt rounded-[var(--radius-pixel)] border-[var(--border-3)] border-mc-darkbrown;
  box-shadow: var(--shadow-pixel);
}

@utility pixel-badge { @apply text-[10px] px-2 py-1 rounded; }
@utility animate-pulse2 { animation: pulse2 2s infinite; }

/* Nền khối đá 8-bit (từ CSS gốc) */
html, body { @apply min-h-screen; }

body {
  background: linear-gradient(45deg, #696969 25%, #808080 25%, #808080 50%, #696969 50%, #696969 75%, #808080 75%);
  background-size: 40px 40px;
}

/* Utility 8-bit tái dùng */
.pixel-box { @apply border-4 border-black shadow-pixel rounded-pixel; box-shadow: var(--pixel-shadow, 4px 4px 0 rgba(0, 0, 0, 0.3)); }
.pixel-inset { box-shadow: inset 2px 2px 0 rgba(255, 255, 255, .3), inset -2px -2px 0 rgba(0, 0, 0, .3); }
.pixel-btn { @apply font-pixel text-xs px-4 py-2 border-3 rounded-pixel border-black bg-mc-gold shadow-pixel active:translate-y-[1px]; }
.pixel-btn--primary { @apply bg-mc-gold text-black; }
.pixel-btn--secondary { @apply bg-mc-dirt text-white; }
.pixel-card { @apply bg-mc-dirt border-3 border-mc-darkbrown rounded-pixel shadow-pixel; }
.pixel-badge { @apply text-[10px] px-2 py-1 rounded; }

/* Page Transitions */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
```

### src/app/page.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isWalletConnected, handleGetStarted } = useApp();
  const router = useRouter();

  // Auto redirect to dashboard if wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      router.push("/dashboard");
    }
  }, [isWalletConnected, router]);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="pixel-card p-8">
        <h1 className="text-2xl mb-3">Build Your Credit Score Like in Minecraft!</h1>
        <p className="opacity-90 mb-4">Complete daily challenges, earn achievements, and level up your financial life!</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">🎯<div className="text-[10px]">Daily Challenges</div></div>
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">🏆<div className="text-[10px]">Achievements</div></div>
          <div className="bg-mc-oak text-black border-3 border-black rounded-pixel p-3">📈<div className="text-[10px]">Track Progress</div></div>
        </div>
        <button className="pixel-btn pixel-btn--primary w-full md:w-auto" onClick={handleGetStarted}>
          {isWalletConnected ? "Continue" : "Get Started"}
        </button>
      </div>
    </section>
  );
}
```

### src/app/providers.tsx

```tsx
"use client";
import { AppProvider } from "@/context/AppContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
```

### src/app/dashboard/page.tsx

```tsx
"use client";
import ConnectionPanel from "@/components/Dashboard/ConnectionPanel";
import CreditScore from "@/components/Dashboard/CreditScore";
import ChallengesGrid from "@/components/Dashboard/ChallengesGrid";
import AchievementsPreview from "@/components/Dashboard/AchievementsPreview";

export default function DashboardPage() {
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <ConnectionPanel />
      <CreditScore />
      <ChallengesGrid />
      <AchievementsPreview />
    </section>
  );
}
```

### src/app/achievements/page.tsx

```tsx
"use client";
import AchievementsPage from "@/components/Pages/AchievementsPage";

export default function Achievements() {
  return <AchievementsPage />;
}
```

### src/app/progress/page.tsx

```tsx
"use client";
import ProgressPage from "@/components/Pages/ProgressPage";

export default function Progress() {
  return <ProgressPage />;
}
```

### src/app/education/page.tsx

```tsx
"use client";
import EducationPage from "@/components/Pages/EducationPage";

export default function Education() {
  return <EducationPage />;
}
```

### src/components/AppLayout.tsx

```tsx
"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import WalletSelectionModal from "@/components/Modals/WalletSelectionModal";
import NetworkSwitchModal from "@/components/Modals/NetworkSwitchModal";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import ChallengeModal from "@/components/Modals/ChallengeModal";
import LoadingIndicator from "@/components/LoadingIndicator";
import Notification from "@/components/UI/Notification";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      <Header />
      <main className="transition-all duration-300 ease-in-out">{children}</main>
      {!isLandingPage && <BottomNav />}
      <WalletSelectionModal />
      <NetworkSwitchModal />
      <RegistrationModal />
      <ChallengeModal />
      <LoadingIndicator />
      <Notification />
    </>
  );
}
```

### src/components/Header.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const {
    isWalletConnected,
    currentUser,
    currentChainId,
    network,
    connectToWallet,
    disconnectWallet,
    showModal,
    availableWallets,
  } = useApp();

  const networkOk = currentChainId === network.chainId;

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
          {!isWalletConnected ? (
            <button
              onClick={() => {
                if (availableWallets.filter((w) => w.available).length <= 1) {
                  const first = availableWallets.find((w) => w.available) ?? availableWallets[0];
                  if (first) connectToWallet(first);
                } else {
                  showModal("walletSelectionModal");
                }
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
                  <span className="hidden sm:inline">{currentUser.address}</span>
                  <span className="sm:hidden">{`${currentUser.address.slice(0, 6)}...${currentUser.address.slice(-4)}`}</span>
                </span>
                <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                  <span className={`animate-pulse2 text-xs ${networkOk ? "text-mc-green" : "text-mc-red"}`}>
                    {networkOk ? "🟢" : "🔴"}
                  </span>
                  <span className="truncate max-w-[80px] sm:max-w-none">{networkOk ? network.chainName : "Wrong Network"}</span>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2">
                {!networkOk && (
                  <button onClick={() => showModal("networkSwitchModal")} className="pixel-btn pixel-btn--secondary text-[7px] sm:text-[10px] px-1 sm:px-2 py-1">
                    <span className="hidden sm:inline">Switch Network</span>
                    <span className="sm:hidden">Switch</span>
                  </button>
                )}
                <button onClick={disconnectWallet} className="pixel-btn pixel-btn--secondary text-[7px] sm:text-[10px] px-1 sm:px-2 py-1">
                  <span className="hidden sm:inline">Disconnect</span>
                  <span className="sm:hidden">❌</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

### src/components/BottomNav.tsx

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

type NavItem = { path: string; icon: string; label: string; };

const navItems: NavItem[] = [
  { path: "/dashboard", icon: "🏠", label: "Home" },
  { path: "/achievements", icon: "🏆", label: "Achievements" },
  { path: "/progress", icon: "📈", label: "Progress" },
  { path: "/education", icon: "📚", label: "Learn" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isWalletConnected, showNotification } = useApp();

  const handleNavigation = (path: string) => {
    if (!isWalletConnected && path !== "/") {
      showNotification("Please connect your wallet first!", "warning");
      return;
    }
    router.push(path);
  };

  const Item = ({ path, icon, label }: { path: string; icon: string; label: string; }) => (
    <button
      onClick={() => handleNavigation(path)}
      className={`flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 transition-all duration-300 ease-out ${
        pathname === path ? "bg-mc-gold text-black transform scale-105 shadow-pixel" : "bg-mc-oak text-black hover:bg-mc-brown hover:text-white"
      } border-3 border-black rounded-pixel shadow-pixel hover:shadow-none active:translate-y-[1px] active:scale-100 min-h-[50px] sm:min-h-[65px] lg:min-h-[75px]`}
    >
      <span className="text-sm sm:text-lg lg:text-xl mb-1">{icon}</span>
      <span className="text-[8px] sm:text-[10px] lg:text-[12px] leading-tight text-center font-bold">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-2 sm:bottom-3 left-2 right-2 sm:left-4 sm:right-4 lg:left-8 lg:right-8 z-40">
      <div className="grid grid-cols-4 gap-1 sm:gap-3 lg:gap-4">
        {navItems.map((item) => (
          <Item key={item.path} path={item.path} icon={item.icon} label={item.label} />
        ))}
      </div>
    </nav>
  );
}
```

### src/components/LoadingIndicator.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function LoadingIndicator() {
  const { loading } = useApp();
  if (!loading.visible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="pixel-card bg-mc-stone p-6 text-center">
        <div className="text-3xl mb-3 animate-pulse2">⛏️</div>
        <p className="text-sm">{loading.message}</p>
      </div>
    </div>
  );
}
```

### src/components/Dashboard/ConnectionPanel.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function ConnectionPanel() {
  const { currentWalletType, currentChainId, network } = useApp();
  const networkText = currentChainId === network.chainId ? network.chainName : "Wrong Network";
  return (
    <div className="pixel-card p-4 bg-mc-blue mb-5">
      <div className="grid gap-2 text-[12px]">
        <div className="flex justify-between"><span>Wallet:</span><span>{currentWalletType ?? "Not Connected"}</span></div>
        <div className="flex justify-between"><span>Network:</span><span>{networkText}</span></div>
        <div className="flex justify-between"><span>Balance:</span><span>--</span></div>
      </div>
    </div>
  );
}
```

### src/components/Dashboard/CreditScore.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function CreditScore() {
  const { currentUser, creditPercentage } = useApp();
  return (
    <div className="pixel-card p-5 mb-5">
      <h2 className="text-xl mb-4">Your Credit Score</h2>
      <div className="grid gap-3">
        <div className="w-full h-6 bg-mc-lightstone border-3 border-black rounded-pixel overflow-hidden">
          <div className="h-full bg-mc-green" style={{ width: `${creditPercentage}%` }} />
        </div>
        <div className="flex items-center gap-2"><span className="text-2xl">{currentUser.creditScore}</span><span className="opacity-80">/850</span></div>
        <div><span className="mr-2">🔥 Streak:</span><span>{currentUser.streakDays} days</span></div>
      </div>
    </div>
  );
}
```

### src/components/Dashboard/ChallengesGrid.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function ChallengesGrid() {
  const { challenges, openChallenge } = useApp();
  return (
    <div className="pixel-card p-5 mb-5">
      <h2 className="text-xl mb-4">Daily Challenges</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {challenges.map((c) => (
          <button key={c.type} onClick={() => openChallenge(c)} className="text-left bg-mc-dirt border-3 border-mc-darkbrown rounded-pixel p-4 hover:-translate-y-0.5 transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-mc-gold px-3 py-2 border-2 border-mc-darkbrown rounded-pixel">{c.icon}</div>
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
  );
}
```

### src/components/Dashboard/AchievementsPreview.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function AchievementsPreview() {
  const { achievements, navigateToPage } = useApp();
  return (
    <div className="pixel-card p-5 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Recent Achievements</h2>
        <button className="pixel-btn pixel-btn--secondary" onClick={() => navigateToPage("achievementsPage")}>
          View All
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {achievements.slice(0, 3).map((a) => (
          <div key={a.id} className="bg-mc-oak text-black border-3 border-black rounded-pixel p-4">
            <div className="text-2xl">{a.icon}</div>
            <div className="mt-2 font-bold">{a.name}</div>
            <div className="text-[11px] opacity-90">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### src/components/Modals/WalletSelectionModal.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function WalletSelectionModal() {
  const { openModal, closeModals, availableWallets, connectToWallet } = useApp();
  return (
    <PixelModal open={openModal === "walletSelectionModal"} title="Connect Your Wallet" onClose={closeModals}>
      <div className="grid gap-3">
        {availableWallets.map((w) => (
          <button
            key={w.type}
            onClick={() => (w.available ? connectToWallet(w) : window.open(w.downloadUrl, "_blank"))}
            className={`pixel-card p-2 sm:p-3 flex items-center gap-2 sm:gap-3 min-w-0 ${w.available ? "" : "opacity-60 cursor-not-allowed"}`}
          >
            <div className="text-lg sm:text-2xl bg-mc-gold px-2 sm:px-3 py-1 sm:py-2 border-2 border-mc-darkbrown rounded-pixel flex-shrink-0">{w.icon}</div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs sm:text-sm font-bold truncate">{w.name}</div>
              <div className="text-[8px] sm:text-[10px] opacity-80 line-clamp-2 sm:line-clamp-none">{w.description}</div>
            </div>
            <div className={`text-[8px] sm:text-[10px] px-1 sm:px-2 py-1 rounded flex-shrink-0 ${w.available ? "bg-mc-green text-white" : "bg-mc-red text-white"}`}>
              <span className="hidden sm:inline">{w.available ? "Available" : "Install"}</span>
              <span className="sm:hidden">{w.available ? "✓" : "↓"}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] opacity-80 mt-3">
        Don&apos;t have a wallet? <a className="underline" href="https://metamask.io" target="_blank">Download MetaMask</a>
      </p>
    </PixelModal>
  );
}
```

### src/components/Modals/NetworkSwitchModal.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function NetworkSwitchModal() {
  const { openModal, closeModals, network, switchToCorrectNetwork } = useApp();
  return (
    <PixelModal open={openModal === "networkSwitchModal"} title="Switch Network" onClose={closeModals}>
      <div className="text-center">
        <h3 className="text-sm text-mc-darkbrown mb-4">Connect to {network.chainName}</h3>
        <p className="text-[10px] opacity-80 mb-4">This app requires connection to the Creditcoin Testnet. Click below to switch networks.</p>
        <div className="bg-mc-stone border-2 border-mc-darkstone p-4 text-left text-[10px]">
          <div className="flex justify-between mb-2"><span className="opacity-80">Network:</span><span className="font-bold text-white">{network.chainName}</span></div>
          <div className="flex justify-between mb-2"><span className="opacity-80">Chain ID:</span><span className="font-bold text-white">{network.chainIdDecimal}</span></div>
          <div className="flex justify-between"><span className="opacity-80">RPC URL:</span><span className="font-bold text-white">{network.rpcUrl}</span></div>
        </div>
        <button onClick={switchToCorrectNetwork} className="pixel-btn pixel-btn--primary w-full mt-4">Switch to Creditcoin Testnet</button>
      </div>
    </PixelModal>
  );
}
```

### src/components/Modals/RegistrationModal.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function RegistrationModal() {
  const { openModal, closeModals, handleRegistration } = useApp();
  return (
    <PixelModal open={openModal === "registrationModal"} title="Welcome to CreditBuild!" onClose={closeModals}>
      <p className="mb-4 text-[12px]">Ready to start building your credit score? Let&apos;s set up your profile!</p>
      <form onSubmit={handleRegistration} className="grid gap-3">
        <label className="text-[10px]">Choose your starting goal:</label>
        <select className="text-black p-2 rounded border-2 border-black">
          <option value="improve">Improve existing credit</option>
          <option value="build">Build from scratch</option>
          <option value="maintain">Maintain good credit</option>
        </select>
        <button className="pixel-btn pixel-btn--primary w-full">Start Building!</button>
      </form>
    </PixelModal>
  );
}
```

### src/components/Modals/ChallengeModal.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";
import { useState } from "react";

export default function ChallengeModal() {
  const { openModal, closeModals, currentChallenge, completeChallenge } = useApp();
  const [amount, setAmount] = useState<number>(0);
  if (!currentChallenge) return null;

  return (
    <PixelModal open={openModal === "challengeModal"} title={currentChallenge.name} onClose={closeModals}>
      <p className="mb-3 text-[12px]">{currentChallenge.description}</p>
      <div className="flex gap-3 text-[11px] mb-3">
        <span className="pixel-badge bg-mc-green text-white">💰 {currentChallenge.points} Points</span>
        <span className="pixel-badge bg-mc-blue text-white">📈 +{currentChallenge.creditImpact} Credit</span>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); completeChallenge(Number(amount)); }}>
        <label className="text-[10px]">Amount ($):</label>
        <input type="number" className="w-full text-black p-2 border-2 border-black rounded mb-3" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
        <button className="pixel-btn pixel-btn--primary w-full">Complete Challenge</button>
      </form>
    </PixelModal>
  );
}
```

### src/components/UI/Notification.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function Notification() {
  const { notification, hideNotification } = useApp();
  if (!notification.visible) return null;
  const color = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[notification.type];

  return (
    <div className="fixed top-3 inset-x-3">
      <div className={`pixel-card p-3 text-center ${color}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm">{notification.message}</span>
          <button className="pixel-btn pixel-btn--secondary text-[10px]" onClick={hideNotification}>&times;</button>
        </div>
      </div>
    </div>
  );
}
```

### src/components/Pages/AchievementsPage.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function AchievementsPage() {
  const { achievements, navigateToPage } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Achievements</h1>
        <button onClick={() => navigateToPage("dashboard")} className="pixel-btn pixel-btn--secondary">Back to Dashboard</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {achievements.map((a) => (
          <div key={a.id} className={`bg-mc-oak text-black border-3 border-black rounded-pixel p-4 ${a.unlocked ? "" : "opacity-60"}`}>
            <div className="text-2xl">{a.icon}</div>
            <div className="mt-2 font-bold">{a.name}</div>
            <div className="text-[11px] opacity-90">{a.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### src/components/Pages/ProgressPage.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function ProgressPage() {
  const { navigateToPage, currentUser } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Progress Tracking</h1>
        <button onClick={() => navigateToPage("dashboard")} className="pixel-btn pixel-btn--secondary">Back to Dashboard</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="pixel-card p-4"><h3>Total Challenges</h3><div className="text-2xl">{currentUser.totalChallenges}</div></div>
        <div className="pixel-card p-4"><h3>Points Earned</h3><div className="text-2xl">{currentUser.totalPointsEarned}</div></div>
        <div className="pixel-card p-4"><h3>Best Streak</h3><div className="text-2xl">{Math.max(currentUser.streakDays, 14)} days</div></div>
      </div>
    </section>
  );
}
```

### src/components/Pages/EducationPage.tsx

```tsx
"use client";
import { useApp } from "@/context/AppContext";

export default function EducationPage() {
  const { educationalContent, navigateToPage } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Financial Education</h1>
        <button onClick={() => navigateToPage("dashboard")} className="pixel-btn pixel-btn--secondary">Back to Dashboard</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {educationalContent.map((c) => (
          <div key={c.id} className="pixel-card p-4">
            <h3 className="font-bold mb-2">{c.title}</h3>
            <p className="text-[11px] opacity-90 mb-2">{c.description}</p>
            <div className="text-[11px] flex gap-3">
              <span className="pixel-badge bg-mc-blue text-white">{c.duration}</span>
              <span className="pixel-badge bg-mc-green text-white">+{c.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### src/context/AppContext.tsx

```tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { appData } from "@/lib/appData";
import type {
  Achievement,
  AppData,
  Challenge,
  User,
  WalletProvider,
} from "@/lib/types";

type PageId =
  | "landingPage"
  | "dashboard"
  | "achievementsPage"
  | "progressPage"
  | "educationPage";
type ModalId =
  | "walletSelectionModal"
  | "networkSwitchModal"
  | "registrationModal"
  | "challengeModal";

type Ctx = {
  currentUser: User;
  isWalletConnected: boolean;
  currentWalletType: string | null;
  currentChainId: string | null;
  availableWallets: WalletProvider[];
  currentPage: PageId;
  openModal: ModalId | null;
  currentChallenge: Challenge | null;
  loading: { visible: boolean; message: string };
  notification: { visible: boolean; message: string; type: "success" | "error" | "warning" | "info" };
  creditPercentage: number;
  challenges: Challenge[];
  achievements: Achievement[];
  educationalContent: AppData["educationalContent"];
  network: AppData["creditcoinNetwork"];
  detectWallets: () => void;
  connectToWallet: (wallet: WalletProvider) => Promise<void>;
  switchToCorrectNetwork: () => Promise<void>;
  disconnectWallet: () => void;
  showPage: (p: PageId) => void;
  navigateToPage: (p: PageId) => void;
  handleGetStarted: () => void;
  showModal: (m: ModalId) => void;
  closeModals: () => void;
  handleRegistration: (e?: React.FormEvent) => Promise<void>;
  openChallenge: (c: Challenge) => void;
  completeChallenge: (amount: number) => Promise<void>;
  showNotification: (msg: string, type?: "success" | "error" | "warning" | "info") => void;
  hideNotification: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    ...appData.sampleUser,
    isRegistered: false,
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWalletType, setCurrentWalletType] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);
  const [currentPage, setCurrentPage] = useState<PageId>("landingPage");
  const [openModal, setOpenModal] = useState<ModalId | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<{ visible: boolean; message: string }>({ visible: false, message: "Processing..." });
  const [notification, setNotification] = useState<{ visible: boolean; message: string; type: "success" | "error" | "warning" | "info" }>({ visible: false, message: "", type: "info" });

  const isCorrectNetwork = useCallback((cid: string | null) => cid === appData.creditcoinNetwork.chainId, []);
  const showNotification = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "info") => { setNotification({ visible: true, message, type }); }, []);
  const hideNotification = useCallback(() => setNotification((s) => ({ ...s, visible: false })), []);
  const showLoading = useCallback((msg?: string) => setLoading({ visible: true, message: msg ?? "Processing..." }), []);
  const hideLoading = useCallback(() => setLoading({ visible: false, message: "Processing..." }), []);
  const showPage = useCallback((p: PageId) => setCurrentPage(p), []);

  const detectWallets = useCallback(() => {
    const base: WalletProvider[] = [];
    if (typeof window !== "undefined" && "ethereum" in window) {
      base.push({ name: "MetaMask", type: "metamask", icon: "🦊", description: "Most popular Ethereum wallet", available: true });
    }
    appData.walletProviders.forEach((w) => { if (!base.find((b) => b.type === w.type)) base.push({ ...w, available: false }); });
    setAvailableWallets(base);
  }, []);

  useEffect(() => { setCurrentPage("landingPage"); detectWallets(); }, [detectWallets]);

  const navigateToPage = useCallback((page: PageId) => {
    if (!isWalletConnected && page !== "landingPage") { showNotification("Please connect your wallet first!", "warning"); return; }
    if (isWalletConnected && !isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); return; }
    showPage(page);
  }, [isWalletConnected, currentChainId, isCorrectNetwork, showNotification, showPage]);

  const handleGetStarted = useCallback(() => {
    if (!isWalletConnected) { showModal("walletSelectionModal"); }
    else if (!isCorrectNetwork(currentChainId)) { showModal("networkSwitchModal"); }
    else if (!currentUser.isRegistered) { showModal("registrationModal"); }
    else { showPage("dashboard"); }
  }, [isWalletConnected, currentChainId, currentUser.isRegistered, isCorrectNetwork, showPage]);

  const showModal = useCallback((id: ModalId) => setOpenModal(id), []);
  const closeModals = useCallback(() => setOpenModal(null), []);

  const connectToWallet = useCallback(async (wallet: WalletProvider) => {
    closeModals();
    showLoading("Connecting to wallet...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      const mock = "0x" + Math.random().toString(16).slice(2, 42);
      const short = `${mock.slice(0, 6)}...${mock.slice(-4)}`;
      setIsWalletConnected(true);
      setCurrentWalletType(wallet.type);
      setCurrentUser((u) => ({ ...u, address: short }));
      setCurrentChainId("0x1");
      hideLoading();
      showNotification(`${wallet.name} connected successfully! 🎉`, "success");
      setTimeout(() => showModal("networkSwitchModal"), 300);
    } catch {
      hideLoading();
      showNotification("Connection rejected - Please approve in your wallet", "error");
    }
  }, [closeModals, hideLoading, showLoading, showNotification, showModal]);

  const switchToCorrectNetwork = useCallback(async () => {
    showLoading("Switching network...");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setCurrentChainId(appData.creditcoinNetwork.chainId);
      hideLoading();
      showNotification("Successfully switched to Creditcoin Testnet! ⛓️", "success");
      closeModals();
      if (!currentUser.isRegistered) { setTimeout(() => showModal("registrationModal"), 200); }
      else { showPage("dashboard"); }
    } catch {
      hideLoading();
      showNotification("Network switch rejected - Please approve in your wallet", "error");
    }
  }, [closeModals, currentUser.isRegistered, hideLoading, showLoading, showNotification, showModal, showPage]);

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setCurrentWalletType(null);
    setCurrentChainId(null);
    setCurrentUser({ ...appData.sampleUser, isRegistered: false });
    showPage("landingPage");
    showNotification("Wallet disconnected", "info");
  }, [showNotification, showPage]);

  const handleRegistration = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); showModal("networkSwitchModal"); return; }
    showLoading("Registering on blockchain...");
    await new Promise((r) => setTimeout(r, 600));
    setCurrentUser((u) => ({ ...u, isRegistered: true, creditScore: 300, streakDays: 0, totalChallenges: 0, totalPointsEarned: 0 }));
    hideLoading();
    closeModals();
    showPage("dashboard");
    showNotification("Welcome to CreditBuild! Your journey begins now. 🎉", "success");
  }, [closeModals, currentChainId, hideLoading, isCorrectNetwork, showLoading, showModal, showNotification, showPage]);

  const openChallenge = useCallback((c: Challenge) => {
    if (!isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); showModal("networkSwitchModal"); return; }
    setCurrentChallenge(c);
    showModal("challengeModal");
  }, [currentChainId, isCorrectNetwork, showModal, showNotification]);

  const completeChallenge = useCallback(async (_amount: number) => {
    showLoading("Submitting challenge...");
    await new Promise((r) => setTimeout(r, 500));
    setCurrentUser((u) => ({
      ...u,
      creditScore: Math.min(850, u.creditScore + (currentChallenge?.creditImpact ?? 0)),
      totalPointsEarned: u.totalPointsEarned + (currentChallenge?.points ?? 0),
      totalChallenges: u.totalChallenges + 1,
      streakDays: Math.max(u.streakDays, 1),
    }));
    hideLoading();
    showNotification("Challenge Completed! 🎉", "success");
    closeModals();
  }, [currentChallenge, closeModals, hideLoading, showLoading, showNotification]);

  const creditPercentage = useMemo(() => Math.max(5, ((currentUser.creditScore - 300) / 550) * 100), [currentUser.creditScore]);

  const value: Ctx = {
    currentUser,
    isWalletConnected,
    currentWalletType,
    currentChainId,
    availableWallets,
    currentPage,
    openModal,
    currentChallenge,
    loading,
    notification,
    creditPercentage,
    challenges: appData.challenges,
    achievements: appData.achievements,
    educationalContent: appData.educationalContent,
    network: appData.creditcoinNetwork,
    detectWallets,
    connectToWallet,
    switchToCorrectNetwork,
    disconnectWallet,
    showPage,
    navigateToPage,
    handleGetStarted,
    showModal,
    closeModals,
    handleRegistration,
    openChallenge,
    completeChallenge,
    showNotification,
    hideNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
```

### src/hooks/useApp.ts

```typescript
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { appData } from "@/lib/appData";
import type { Achievement, Challenge, User, WalletProvider } from "@/lib/types";

type PageId = "landingPage" | "dashboard" | "achievementsPage" | "progressPage" | "educationPage";
type ModalId = "walletSelectionModal" | "networkSwitchModal" | "registrationModal" | "challengeModal";

export function useApp() {
  const [currentUser, setCurrentUser] = useState<User>({ ...appData.sampleUser, isRegistered: false });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWalletType, setCurrentWalletType] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);
  const [currentPage, setCurrentPage] = useState<PageId>("landingPage");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<{ visible: boolean; message: string }>({ visible: false, message: "Processing..." });
  const [notification, setNotification] = useState<{ visible: boolean; message: string; type: "success" | "error" | "warning" | "info" }>({ visible: false, message: "", type: "info" });

  const isCorrectNetwork = useCallback((cid: string | null) => cid === appData.creditcoinNetwork.chainId, []);
  const showNotification = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "info") => setNotification({ visible: true, message, type }), []);
  const hideNotification = useCallback(() => setNotification((s) => ({ ...s, visible: false })), []);
  const showLoading = useCallback((msg?: string) => setLoading({ visible: true, message: msg ?? "Processing..." }), []);
  const hideLoading = useCallback(() => setLoading({ visible: false, message: "Processing..." }), []);

  const detectWallets = useCallback(() => {
    const base: WalletProvider[] = [];
    if (typeof window !== "undefined") {
      const win = window as unknown as { ethereum?: unknown };
      if (win.ethereum) {
        base.push({ name: "MetaMask", type: "metamask", icon: "🦊", description: "Most popular Ethereum wallet", available: true });
      }
    }
    appData.walletProviders.forEach((w) => { const exists = base.find((b) => b.type === w.type); if (!exists) base.push({ ...w, available: false }); });
    setAvailableWallets(base);
  }, []);

  useEffect(() => { setTimeout(() => { setCurrentPage("landingPage"); detectWallets(); }, 100); }, [detectWallets]);

  const showPage = useCallback((page: PageId) => setCurrentPage(page), []);
  const navigateToPage = useCallback((page: PageId) => {
    if (!isWalletConnected && page !== "landingPage") { showNotification("Please connect your wallet first!", "warning"); return; }
    if (isWalletConnected && !isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); return; }
    showPage(page);
  }, [isWalletConnected, currentChainId, isCorrectNetwork, showPage, showNotification]);

  const handleGetStarted = useCallback(() => {
    if (!isWalletConnected) { showModal("walletSelectionModal"); }
    else if (!isCorrectNetwork(currentChainId)) { showModal("networkSwitchModal"); }
    else if (!currentUser.isRegistered) { showModal("registrationModal"); }
    else { showPage("dashboard"); }
  }, [isWalletConnected, currentChainId, currentUser.isRegistered, isCorrectNetwork, showPage]);

  const [openModal, setOpenModal] = useState<ModalId | null>(null);
  const showModal = useCallback((id: ModalId) => setOpenModal(id), []);
  const closeModals = useCallback(() => setOpenModal(null), []);

  const connectToWallet = useCallback(async (wallet: WalletProvider) => {
    closeModals();
    showLoading("Connecting to wallet...");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42);
      const short = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`;
      setIsWalletConnected(true);
      setCurrentWalletType(wallet.type);
      setCurrentUser((u) => ({ ...u, address: short }));
      setCurrentChainId("0x1");
      hideLoading();
      showNotification(`${wallet.name} connected successfully! 🎉`, "success");
      setTimeout(() => showModal("networkSwitchModal"), 600);
    } catch {
      hideLoading();
      showNotification("Connection rejected - Please approve the connection in your wallet", "error");
    }
  }, [closeModals, hideLoading, showLoading, showNotification, showModal]);

  const switchToCorrectNetwork = useCallback(async () => {
    showLoading("Switching network...");
    try {
      await new Promise((r) => setTimeout(r, 900));
      setCurrentChainId(appData.creditcoinNetwork.chainId);
      hideLoading();
      showNotification("Successfully switched to Creditcoin Testnet! ⛓️", "success");
      closeModals();
      if (!currentUser.isRegistered) { setTimeout(() => showModal("registrationModal"), 300); }
      else { showPage("dashboard"); }
    } catch {
      hideLoading();
      showNotification("Network switch rejected - Please approve in your wallet", "error");
    }
  }, [closeModals, currentUser.isRegistered, hideLoading, showLoading, showNotification, showModal, showPage]);

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setCurrentWalletType(null);
    setCurrentChainId(null);
    setCurrentUser({ ...appData.sampleUser, isRegistered: false });
    showPage("landingPage");
    showNotification("Wallet disconnected", "info");
  }, [showNotification, showPage]);

  const handleRegistration = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); showModal("networkSwitchModal"); return; }
    showLoading("Registering on blockchain...");
    await new Promise((r) => setTimeout(r, 1200));
    setCurrentUser((u) => ({ ...u, isRegistered: true, creditScore: 300, streakDays: 0, totalChallenges: 0, totalPointsEarned: 0 }));
    hideLoading();
    closeModals();
    showPage("dashboard");
    showNotification("Welcome to CreditBuild! Your journey begins now. 🎉", "success");
  }, [closeModals, currentChainId, hideLoading, isCorrectNetwork, showLoading, showModal, showNotification, showPage]);

  const creditPercentage = useMemo(() => Math.max(5, ((currentUser.creditScore - 300) / 550) * 100), [currentUser.creditScore]);

  const openChallenge = useCallback((c: Challenge) => {
    if (!isCorrectNetwork(currentChainId)) { showNotification("Please switch to Creditcoin Testnet first!", "warning"); showModal("networkSwitchModal"); return; }
    setCurrentChallenge(c);
    showModal("challengeModal");
  }, [currentChainId, isCorrectNetwork, showModal, showNotification]);

  const completeChallenge = useCallback(async (amount: number) => {
    showLoading("Submitting challenge...");
    await new Promise((r) => setTimeout(r, 800));
    setCurrentUser((u) => ({
      ...u,
      creditScore: Math.min(850, u.creditScore + (currentChallenge?.creditImpact ?? 0)),
      totalPointsEarned: u.totalPointsEarned + (currentChallenge?.points ?? 0),
      totalChallenges: u.totalChallenges + 1,
      streakDays: Math.max(u.streakDays, 1),
    }));
    hideLoading();
    showNotification("Challenge Completed! 🎉", "success");
    closeModals();
  }, [currentChallenge, closeModals, hideLoading, showLoading, showNotification]);

  return {
    currentUser,
    isWalletConnected,
    currentWalletType,
    currentChainId,
    availableWallets,
    currentPage,
    openModal,
    currentChallenge,
    loading,
    notification,
    creditPercentage,
    challenges: appData.challenges,
    achievements: appData.achievements,
    educationalContent: appData.educationalContent,
    network: appData.creditcoinNetwork,
    detectWallets,
    connectToWallet,
    switchToCorrectNetwork,
    disconnectWallet,
    showPage,
    navigateToPage,
    handleGetStarted,
    showModal,
    closeModals,
    handleRegistration,
    openChallenge,
    completeChallenge,
    showNotification,
    hideNotification,
  };
}
```

### src/lib/appData.ts

```typescript
import { AppData } from "./types";

export const appData: AppData = {
  sampleUser: {
    address: "0x1234...abcd",
    creditScore: 420,
    totalChallenges: 15,
    streakDays: 7,
    totalPointsEarned: 300,
    isRegistered: true,
  },
  challenges: [
    { type: "daily_save", name: "Daily Saver", description: "Save at least $5 today", points: 10, creditImpact: 5, category: "daily", icon: "💰" },
    { type: "bill_early", name: "Early Bird", description: "Pay a bill 3+ days early", points: 20, creditImpact: 10, category: "daily", icon: "⚡" },
    { type: "budget_check", name: "Budget Tracker", description: "Review and update your budget", points: 15, creditImpact: 8, category: "daily", icon: "📊" },
    { type: "weekly_goal", name: "Weekly Saver", description: "Save $50+ this week", points: 50, creditImpact: 25, category: "weekly", icon: "🎯" },
  ],
  achievements: [
    { id: "first_challenge", name: "First Steps", description: "Complete your first challenge", icon: "🏆", unlocked: true },
    { id: "week_streak", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true },
    { id: "month_streak", name: "Monthly Master", description: "Maintain a 30-day streak", icon: "💎", unlocked: false },
    { id: "good_credit", name: "Good Credit Club", description: "Reach 650 credit score", icon: "⭐", unlocked: false },
    { id: "savings_master", name: "Savings Master", description: "Complete 10 savings challenges", icon: "🏅", unlocked: false },
    { id: "perfect_score", name: "Perfect Credit", description: "Reach 850 credit score", icon: "👑", unlocked: false },
  ],
  walletProviders: [
    { name: "MetaMask", type: "metamask", icon: "🦊", description: "Most popular Ethereum wallet", downloadUrl: "https://metamask.io" },
    { name: "Coinbase Wallet", type: "coinbase", icon: "🔵", description: "User-friendly wallet by Coinbase", downloadUrl: "https://wallet.coinbase.com" },
    { name: "WalletConnect", type: "walletconnect", icon: "🔗", description: "Connect with mobile wallets", downloadUrl: "https://walletconnect.com" },
  ],
  creditcoinNetwork: {
    chainId: "0x18E9F",
    chainIdDecimal: 102031,
    chainName: "Creditcoin Testnet",
    rpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
    blockExplorer: "https://creditcoin-testnet.blockscout.com",
    nativeCurrency: { name: "Creditcoin", symbol: "CTC", decimals: 18 },
  },
  contractAddress: "0x1234567890123456789012345678901234567890",
  educationalContent: [
    { id: "credit_basics", title: "Credit Score Basics", description: "Learn what affects your credit score", duration: "5 min", points: 25 },
    { id: "budgeting_101", title: "Budgeting 101", description: "Create your first budget", duration: "10 min", points: 35 },
    { id: "debt_management", title: "Debt Management", description: "Strategies to pay off debt faster", duration: "8 min", points: 30 },
    { id: "investment_basics", title: "Investment Fundamentals", description: "Start building wealth with smart investments", duration: "12 min", points: 40 },
  ],
};
```

### src/lib/types.ts

```typescript
export type Challenge = {
  type: string;
  name: string;
  description: string;
  points: number;
  creditImpact: number;
  category: "daily" | "weekly";
  icon: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type WalletProvider = {
  name: string;
  type: "metamask" | "coinbase" | "walletconnect" | "generic";
  icon: string;
  description: string;
  downloadUrl?: string;
  available?: boolean;
};

export type User = {
  address: string;
  creditScore: number;
  totalChallenges: number;
  streakDays: number;
  totalPointsEarned: number;
  isRegistered: boolean;
};

export type Network = {
  chainId: string;
  chainIdDecimal: number;
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
};

export type AppData = {
  sampleUser: User;
  challenges: Challenge[];
  achievements: Achievement[];
  walletProviders: WalletProvider[];
  creditcoinNetwork: Network;
  contractAddress: string;
  educationalContent: { id: string; title: string; description: string; duration: string; points: number; }[];
};
```

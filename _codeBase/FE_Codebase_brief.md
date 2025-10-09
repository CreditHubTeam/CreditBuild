<!--
  FE_Codebase.md
  Consolidated frontend documentation (updated 2025-10-09)
  Focus: App Router (Next.js 15), wagmi multi-chain wallet flow, state, UI patterns, data layer, and extension points.
-->

# Frontend Codebase Overview (2025-10-09)

This document is the authoritative map of the current frontend implementation. It explains structure, core flows (wallet connect, network enforcement, registration, challenges), state management, API schema plumbing, and recommended next steps.

---

## 1. High-Level Architecture

Layers (outside → inside):

1. UI Shell & Routing (Next.js App Router: `src/app/*`, middleware gate)
2. Presentation Components (pure / minimal state) in `src/components/*`
3. App State (legacy monolithic context `AppContext` + emerging modular state slices in `src/state/*` and hook-based variant `hooks/useApp.ts` – duplication noted)
4. Data / API Layer (`lib/http.ts`, React Query integration, OpenAPI schema definitions via `zod` + `zod-openapi`)
5. Blockchain / Wallet Integration (`lib/wagmi.ts`, wagmi config + middleware + runtime wallet logic in contexts)
6. Domain Modules (`modules/*` — schemas, future repo/service separation groundwork)
7. Persistence & Infra (Prisma client `core/db.ts`, env validation `core/config.ts`)

Key Patterns:

- SSR + Hydration alignment for wagmi using `cookieToInitialState`.
- Network gating: soft gate in client (modal) + hard gate (partial) via `middleware.ts` cookie inspection.
- UI theme: custom pixel/Minecraft-inspired design—utility classes defined in Tailwind v4 + custom `@theme` tokens.
- OpenAPI doc generated server-side and exposed at `/api/openapi`.

---

## 2. Directory Structure (Frontend-Relevant)

```text
src/
  app/
    (route segments & pages)
    layout.tsx            # Root layout: font, Providers, wagmi SSR state
    providers.tsx         # Wagmi + React Query + AppProvider composition
    middleware.ts (root)  # Edge middleware (actually at src/middleware.ts)
    api/openapi/route.ts  # OpenAPI JSON endpoint
  components/
    AppLayout.tsx         # Global chrome + modals injection
    Dashboard/*           # Dashboard widgets
    Modals/*              # Modal components (wallet, network, registration, challenge)
    Pages/*               # Page-level wrappers mapping context state to UI
    UI/Notification.tsx
  context/
    AppContext.tsx        # Monolithic app state (wallet + ui + domain)
  hooks/
    useApp.ts             # Hook-based duplicate of context logic (refactor candidate)
  state/
    ui.tsx                # Modular UI slice (modal, loading, notices)
    wallet.tsx            # Advanced wallet/network tracking (real chain detection)
    data.tsx              # React Query data provider (API-driven challenges/education)
  core/
    config.ts             # Env schema (zod) validation
    db.ts                 # Prisma singleton
    logger.ts             # Simple console wrapper
  lib/
    wagmi.ts              # wagmi config + SSR cookie storage
    http.ts               # Minimal fetch wrapper
    appData.ts            # Static seed in-memory app data (challenge seeds, etc.)
    types.ts              # Shared types for static data model
  modules/
    challenges/schemas.ts # Zod input schema for challenge attempt
    users/schemas.ts      # User registration schema
  openapi/
    doc.ts                # Build OpenAPI spec from zod schemas
  ui/ (legacy minor components)
```

Duplication / Divergence Hotspots:

- `context/AppContext.tsx` vs `hooks/useApp.ts` vs modular slices in `state/` (three parallel state paradigms).
- `lib/appData.ts` vs duplicate earlier snapshot inside FE_Codebase (should consolidate to a single source of truth and domain stores).

---

## 3. Core Runtime Flows

### 3.1 Wallet Connection & Network Enforcement

Steps when user clicks "Connect Wallet":

1. `Header` / `LandingPage` triggers `handleGetStarted` → may open `walletSelectionModal`.
2. `WalletSelectionModal` lists connectors derived from wagmi (`useConnect`) + static providers in `appData` with availability flags (set in `detectWallets`).
3. On connect: temp mock address & chain set (currently mocking mainnet) → notification success → prompt network switch if chain mismatch.
4. Network switch simulated (no real RPC switch code yet in `AppContext`; `state/wallet.tsx` contains more robust detection & planned metamask chain switching).
5. After correct network + registration → navigate to dashboard.

SSR Considerations:

- `app/layout.tsx` uses `cookieToInitialState(getConfig(), headers().get('cookie'))` ensuring wagmi hydrates with prior connection state.
- Middleware (`src/middleware.ts`) inspects `wagmi.store` cookie for presence of any connections and optionally warns (but does not hard-block on wrong network: only wallet absence).

### 3.2 Registration Flow

- On first visit with connected wallet + correct network but `isRegistered === false` → `registrationModal` prompts for goal selection (currently client-only, no persistence).
- Submission sets baseline credit score (300) and resets counters.

### 3.3 Challenges & Achievements

- Static seed data from `appData.challenges` & `appData.achievements` (client state only) displayed in dashboard.
- Completing a challenge updates user metrics and shows notification. No backend call yet (the `state/data.tsx` provider is prepared for API-driven variant using `/api/challenges` endpoints—these are not fully implemented in repo).

### 3.4 Education Content

- Rendered from static `educationalContent`. Data provider path present to later swap to API.

### 3.5 Notifications & Loading

- Provided by `AppContext` (combined) or modular `UIProvider` (`state/ui.tsx`). Pixel-styled cards with context-managed dismiss.

---

## 4. State Management Strategy (Current vs Target)

Current fragmentation:

| Concern | Current Source | Notes |
|---------|----------------|-------|
| Global app (user, challenges, modals, notifications) | `AppContext.tsx` | Monolithic, mock blockchain ops |
| Alternative monolithic hook | `hooks/useApp.ts` | Largely duplicated logic; should be removed or refactored into slices |
| Wallet chain validation & robust listeners | `state/wallet.tsx` | More advanced detection than `AppContext` (real chain events) |
| UI slice (modal/loading/notice) | `state/ui.tsx` | Clean separation; candidate pattern for migration |
| Data (React Query) | `state/data.tsx` | Designed for real API consumption |

Recommended convergence plan:

1. Extract domain slices: `user`, `wallet`, `ui`, `challenge`.
2. Remove duplicated wallet detection from `AppContext` once `wallet.tsx` is authoritative.
3. Replace static `appData` usage with server-fetched queries (hydrate with `React Query` + `dehydratedState` if SSR needed).
4. Preserve wagmi SSR pattern; extend to include `persist` option for selected slice keys.

---

## 5. wagmi & Chain Configuration

File: `lib/wagmi.ts`
Highlights:

- Uses `cookieStorage` + `createStorage` enabling SSR-safe persistence.
- Currently only `mainnet` & `sepolia` included; TODO: add custom Creditcoin chain via `defineChain` then include in `chains` array.
- Connectors: `injected()`, `baseAccount()`, `walletConnect({ projectId })`.
- `ssr: true` ensures match between server & client.

Missing Implementation (to add):

```ts
// Example creditcoin chain
import { defineChain } from 'viem'
export const creditcoinTestnet = defineChain({
  id: 102031,
  name: 'Creditcoin Testnet',
  nativeCurrency: { name: 'Creditcoin', symbol: 'CTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' } },
})
```

Then update `chains: [creditcoinTestnet]` and network enforcement to use wagmi chain rather than manual hex in context.

---

## 6. Middleware Behavior

File: `src/middleware.ts`
Logic summary:

- For protected routes (`/dashboard`, `/education`, `/progress`, `/achievements`) if no `wagmi.store` cookie or no active connections → redirect to `/?blocked=wallet`.
- Logs chain id but does not enforce chain correctness (delegated to client modal flows).

Potential Enhancements:

1. Parse cookie safely with zod schema.
2. Add soft redirect param for wrong chain (`?blocked=network`).
3. Consider reading `state.chainId` to pre-hydrate a `x-network-mismatch` header for UX.

---

## 7. Styling & Theming

File: `app/globals.css`

- Tailwind v4 with `@theme` tokens for pixel aesthetic.
- Custom utilities via `@utility` for pixel components (`pixel-btn`, `pixel-card`, etc.).
- Duplicate utility definitions exist (both `@utility` and raw class definitions) → can be consolidated to reduce CSS size.

Suggested Cleanup:

- Remove redundant `.pixel-*` definitions outside `@utility` once all usages are validated.
- Extract semantic component classes (e.g., `btn-primary`, `badge-points`) mapping onto pixel atoms for more maintainable design tokens.

---

## 8. Data & API Layer

### 8.1 Static Data

`lib/appData.ts` seeds user, challenges, achievements, education content, wallet providers, and testnet network metadata.

### 8.2 HTTP Helper

`lib/http.ts` supplies minimal `api.get/post` wrappers; no retry, auth, or error normalization yet.

### 8.3 React Query Integration

`state/data.tsx` queries `/api/challenges` & `/api/education` (these endpoints are not yet implemented—future alignment needed). Mutation `submitChallenge` posts to `/api/challenges/:id/submit`.

### 8.4 OpenAPI & Schemas

`openapi/doc.ts` uses `zod-openapi` to expose registration endpoint schema. Challenge submit input defined in `modules/challenges/schemas.ts`. This can be extended to auto-generate client types (e.g., using `openapi-typescript`).

---

## 9. Domain Modules

Structure intention (partial today):

- `modules/<domain>/schemas.ts` define zod contracts.
- Future: add `repo.ts` (Prisma operations) & `service.ts` (business rules) – some placeholders exist under `modules/` (e.g., `challenges/service.ts` in repo tree if later added) but not yet fully implemented.

Recommended next step: formalize folder pattern:

```text
modules/<domain>/
  schemas.ts
  repo.ts        # data access (Prisma)
  service.ts     # orchestration / business logic
  mappers.ts     # (optional) transformation to DTOs
```

---

## 10. User Interface Components

Component Types:

| Category | Examples | Notes |
|----------|----------|-------|
| Layout | `AppLayout`, `Header`, `BottomNav` | Injects global modals & notifications |
| Dashboard Widgets | `CreditScore`, `ChallengesGrid`, `AchievementsPreview`, `ConnectionPanel` | Pull from `useApp` context |
| Modals | `WalletSelectionModal`, `NetworkSwitchModal`, `RegistrationModal`, `ChallengeModal`, `PixelModal` | PixelModal = headless container |
| Pages | Wrapper pages for achievements, education, progress | Could be reduced by server components + client sections |
| UI Atoms | `Notification`, `LoadingIndicator` | Should migrate to modular `ui` context |

Improvements:

- Convert repeated pixel-card structures into a `<Card variant="stone" />` primitive.
- Introduce a11y (focus trap in modals, ARIA labels for close buttons, keyboard navigation).

---

## 11. Performance & SSR Notes

- Current pages are all `"use client"`; consider hybrid: keep layout + data fetching server-side, mount interactive subsections as client components to reduce bundle size.
- Challenge & achievement lists are static now—mark as `export const dynamic = 'force-static'` in pages or fetch server-side for initial HTML.
- Middleware logs extensively; remove verbose console logs or behind `NODE_ENV !== 'production'` gate.

---

## 12. Security & Validation

Current:

- Input schemas: `RegisterInput`, `SubmitAttemptInput` (walletAddress regex, amount optional, proof flexible `any`).
- No CSRF/auth layer yet; dependence on wallet connection cookie only indicates presence of connection, not ownership proof.

Next Steps:

1. Implement signed message challenge on registration to bind wallet address.
2. Normalize network ID usage; avoid magic numbers (wrap in single source `creditcoinTestnet.id`).
3. Harden middleware parsing with safe schema & fallbacks.

---

## 13. Technical Debt / TODO Backlog

Priority (P1 highest):

| P | Item | Rationale |
|---|------|-----------|
| P1 | Unify state (remove duplicate `useApp.ts`) | Prevent divergence & bugs |
| P1 | Add real Creditcoin chain via `defineChain` | Needed for live network operations |
| P1 | Implement real wallet connect + network switch (remove mocks) | Core product integrity |
| P2 | Migrate static challenge data to API + React Query | Dynamic updates & persistence |
| P2 | Extract modal & notification to `state/ui` fully | Cleaner separation, testability |
| P2 | Add openapi generation for all endpoints + typed client | Developer velocity |
| P3 | Consolidate CSS utilities / remove duplicates | Bundle reduction |
| P3 | Add accessibility (focus traps, aria) | Inclusivity & compliance |
| P3 | Logging abstraction with levels | Production observability |

---

## 14. Quick Reference: Key Files (Annotated)

```ts
// app/layout.tsx
export default async function RootLayout({ children }) {
  const initialState = cookieToInitialState(getConfig(), (await headers()).get('cookie'))
  return <html><body><Providers initialState={initialState}><AppLayout>{children}</AppLayout></Providers></body></html>
}

// lib/wagmi.ts
export function getConfig() { return createConfig({ chains:[mainnet,sepolia /* + creditcoin */], connectors:[injected(), baseAccount(), walletConnect({ projectId })], storage: createStorage({ storage: cookieStorage }), ssr:true, transports:{ [mainnet.id]: http(), [sepolia.id]: http() } }) }

// context/AppContext.tsx (selected excerpt)
const connectToWallet = async (wallet) => { /* mock connect → set state → show network modal */ }
const switchToCorrectNetwork = async () => { /* mock network switch updates chainId */ }

// state/wallet.tsx highlights real chain detection
useEffect(() => { if (window.ethereum) ethereum.on('chainChanged', id => setRealChainId(parseInt(id,16))) })

// middleware.ts
if (PROTECTED_ROUTES.includes(path) && !hasConnections) redirect('/?blocked=wallet')
```

---

## 15. Extension Points (Planned)

| Extension | Proposed Location | Summary |
|-----------|-------------------|---------|
| Chain abstraction | `lib/chains.ts` | Centralize `creditcoinTestnet` + future chains |
| Wallet service | `services/wallet.ts` | Encapsulate connect / switch logic with error mapping |
| API client generation | `scripts/generate-api.ts` | Use OpenAPI JSON → typed fetch wrappers |
| Feature flags | `lib/flags.ts` | Gate experimental UI (e.g., new challenge types) |
| Analytics | `lib/analytics.ts` | Track challenge completions & retention |

---

## 16. How to Run (Frontend)

Prerequisites: Node 18+, pnpm or npm.

Local steps:

```bash
npm install
npm run db:push   # if backend DB schemas needed
npm run dev
```

Environment variables (required by `core/config.ts`):

```env
DATABASE_URL=postgres://...
RPC_URL=https://rpc.cc3-testnet.creditcoin.network
CHAIN_ID=102031
QUEST_ADDRESS=0xYourQuestContract
OPERATOR_PRIVATE_KEY=0xyourOperatorKey
MINT_MODE=backend
```

---

## 17. Summary

The frontend is functional for a mock / prototype flow but contains intentional scaffolding and duplicated state layers. Immediate value can be unlocked by consolidating state, formalizing the Creditcoin chain integration, and activating the data layer (React Query + actual API routes). This document should be updated after each structural refactor (target: automated generation script + lint to ensure freshness).

> Next Update Trigger: After integrating real chain switching & removing mock wallet logic.

---
End of FE_Codebase.md

# CreditBuild – Web3 Task-to-Earn on Creditcoin

CreditBuild is a Web3 application where users complete financial tasks and learning challenges to build healthy habits and earn token rewards on the Creditcoin EVM L1 testnet. The app provides a smooth wallet-onboarding flow, network gating to Creditcoin Testnet, a gamified dashboard (credit score, challenges, achievements), and a backend powered by Next.js Route Handlers with a PostgreSQL + Prisma database.

This repository contains the frontend (Next.js App Router) and server routes; smart contracts are built with Solidity + Hardhat and deployed to Creditcoin Testnet.

## Why CreditBuild?

- Turn personal finance micro-actions into daily/weekly quests
- Educate users while they stack points and on-chain rewards
- Build a verifiable on-chain track record on Creditcoin’s EVM L1

---

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, wagmi + viem for wallet connectivity and EVM interactions
- Backend: Next.js Route Handlers (server actions/APIs)
- Database: PostgreSQL + Prisma ORM
- Blockchain: Solidity + Hardhat, deployed to Creditcoin Testnet (EVM L1)
  - Chain: Creditcoin Testnet (chainId hex: 0x18E9F, decimal: 102031)
  - RPC: <https://rpc.cc3-testnet.creditcoin.network>
  - Explorer: <https://creditcoin-testnet.blockscout.com>
  - Wallet: MetaMask (add chain manually if needed)

---

## Architecture Overview

- Client (Next.js App Router, React/TypeScript)
  - Wallet connect (wagmi/viem), network guard (Creditcoin Testnet)
  - Pages: dashboard, achievements, progress, education
  - UI: responsive components, modals, notifications
- Server (Next.js Route Handlers)
  - REST-like endpoints for registration and task progress
  - Input validation and basic business logic
- Persistence (PostgreSQL + Prisma)
  - User profiles, achievements, progress, and off-chain metadata
- Smart Contracts (Solidity + Hardhat)
  - Token reward logic and on-chain challenge submissions
  - Deployment to Creditcoin Testnet

---

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- PostgreSQL 14+ running locally or in the cloud
- MetaMask or a compatible EVM wallet
- Optional (smart contracts): Hardhat and a Creditcoin Testnet account/private key

---

## Getting Started (App)

1. Install dependencies

```bash
npm install
```

1. Configure environment variables

Create a `.env` file at the project root and set at least:

```bash
# PostgreSQL (example)
DATABASE_URL="postgresql://USER:PASS@localhost:5432/creditbuild?schema=public"

# Optional: WalletConnect or other client keys if you integrate them
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id"
```

1. Initialize the database (Prisma)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

1. Run the development server

```bash
npm run dev
```

Then open <http://localhost:3000> in your browser.

---

## Wallet & Network

- The app connects with MetaMask (and other injected wallets via wagmi) and checks the active chain.
- If you’re not on Creditcoin Testnet, the UI will prompt you to switch.
- To add Creditcoin Testnet to MetaMask manually:

```text
Network Name: Creditcoin Testnet
RPC URL: https://rpc.cc3-testnet.creditcoin.network
Chain ID: 102031 (hex 0x18E9F)
Currency Symbol: CTC
Block Explorer: https://creditcoin-testnet.blockscout.com
```

---

## Backend (Route Handlers)

- Next.js Route Handlers handle server-side logic (registration, progress updates, etc.).
- They interact with the database via Prisma and can be extended for additional endpoints or server actions.

---

## Database (PostgreSQL + Prisma)

- Prisma provides type-safe queries, migrations, and a schema-first approach.
- Useful commands:

```bash
npx prisma generate         # generate Prisma Client
npx prisma migrate dev      # run dev migrations
npx prisma studio           # open Prisma Studio (GUI for DB)
```

---

## Smart Contracts (Solidity + Hardhat)

Smart contracts manage token rewards and on-chain challenge records. A typical Hardhat setup includes:

1. Install Hardhat (if not already installed)

```bash
npm install --save-dev hardhat
```

1. Configure Creditcoin Testnet in your Hardhat config

```ts
// Example (hardhat.config.ts)
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
 solidity: "0.8.24",
 networks: {
  creditcoinTestnet: {
   url: "https://rpc.cc3-testnet.creditcoin.network",
   chainId: 102031,
   accounts: [process.env.PRIVATE_KEY!],
  },
 },
};
export default config;
```

1. Compile and deploy

```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network creditcoinTestnet
```

4) Add contract addresses/ABIs to your app and wire wagmi/viem calls for reads/writes.

Note: Keep private keys out of the repo. Use environment variables or secure key management.

---

## Scripts

```bash
npm run dev     # start Next.js in development
npm run build   # build for production
npm run start   # start production server
npm run lint    # run ESLint
```

---

## Security & Best Practices

- Never expose private keys or secrets in the client.
- Validate and sanitize all inputs on the server.
- Gate protected pages behind wallet connection + correct network + registration checks.
- Use HTTPS in production and secure cookies/headers when applicable.

---

## Roadmap (High-level)

- Task definitions and dynamic rewards sourced from the backend
- On-chain reward claiming flows (mint/distribute)
- Enhanced analytics, anti-abuse checks, and observability
- Production CI/CD, e2e tests, and monitoring

---

## License

Proprietary – all rights reserved, unless otherwise specified by the project owner.

# 🧱 CreditBuild — Smart Contracts Deployment & Integration Guide

> **Maintainer:** Nhu Y  
> **Last Updated:** 2025-10-18  
> **Network:** Creditcoin Testnet (Chain ID: 102031)  
> **Compiler:** Solidity v0.8.27 (Optimizer Enabled)

---

## 1️⃣ Overview

This document provides a full guide for deploying, verifying, and testing CreditBuild’s smart contracts using **Remix IDE** and **MetaMask**.

### Contracts included:

| Contract | Description |
|-----------|--------------|
| `PointsToken.sol` | ERC20 token for CreditBuild Points (CBP). Supports mint, burn, pause, permit, and batch mint. |
| `QuestPlatform.sol` | Manages quest creation, completion, and rewards. Supports operator-initiated minting and user attestation claims. |
| `IPointsToken.sol` | Interface used by `QuestPlatform` to call `PointsToken.mint()`. |

All contracts follow **OpenZeppelin security standards**, including `AccessControl`, `Pausable`, and `ReentrancyGuard`.

---

## 2️⃣ Deployment Summary

| Contract | Address | Network | Verified | Notes |
|-----------|----------|----------|----------|--------|
| `PointsToken` | *(Deployed via Remix)* | Creditcoin Testnet | ✅ Verified on Blockscout | Admin: MetaMask wallet |
| `QuestPlatform` | *(Deployed via Remix)* | Creditcoin Testnet | ✅ Verified on Blockscout | Linked with PointsToken |

---

## 3️⃣ Deployment Steps (via Remix IDE)

### ⚙️ Step 1 — Compile Contracts
1. Open **Remix IDE** → tab **Solidity Compiler**  
2. Select version `0.8.27+commit.40a35a09`
3. Check ✅ **Auto compile**
4. Check ✅ **Enable optimization (200 runs)**  
5. Compile each file:
   - `IPointsToken.sol`
   - `PointsToken.sol`
   - `QuestPlatform.sol`

---

### 🪄 Step 2 — Deploy `PointsToken`
In **Deploy & Run Transactions**:
1. Environment:
   - 🧪 Test only → “Remix VM (London)”  
   - 🌐 Real testnet → “Injected Provider (MetaMask)”
2. Contract: `PointsToken`
3. Constructor parameters:
   ```solidity
   defaultAdmin = 0xB8Ee4C4e0D231B376067384F63721Cc46535c8F9
   minter       = 0x0000000000000000000000000000000000000000

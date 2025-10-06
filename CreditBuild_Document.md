# **CreditBuild — Product & Implementation Document**

## **1\) Product Features**

1. **Wallet connection & network enforcement** — connect/disconnect wallets, auto-connect saved wallet, detect injected providers, show network indicator and enforce the app's network.  

- Wallet connect must support EVM and Non-EVM extension (SUI & Aptos)

  refer to use: [https://docs.walletconnect.network/app-sdk/next/installation](https://docs.walletconnect.network/app-sdk/next/installation)

2. **Registration flow** — upon first connect, user registers with initial settings (goal, profile); this initializes on-profile metrics.

3. **Dashboard** — shows credit score, streaks, total points, and challenge counters.

4. **Challenges** — daily/weekly tasks with `points` and `creditImpact`. Users open a modal, submit proof/amount, and mark completion.

5. **Achievements** — unlockable badges for milestones (first challenge, streaks, credit milestones).

6. **Educational modules** — learning content that rewards points when completed.

7. **On-chain integration hooks** — frontend includes placeholders for `contractAddress` and RPC; current flow simulates blockchain actions.

8. **Notifications & UX** — transaction modal states, loading, and error handling.

---

## **2\) Entity Model (DB \+ On-chain)**

### **Core Entities**

- `User` — wallet address, credit score, streak, total points.

- `Challenge` — definition of a task (type, points, credit impact, rules).

- `UserChallenge` — attempts/completions, proofs, timestamps, txHash.

- `Achievement` — achievement definitions.

- `UserAchievement` — unlocked achievements.

- `EducationModule` — learning modules awarding points.

- `PointLedger` — immutable ledger of point events.

- `Quest` — higher-level grouped tasks.

- `ContractConfig` — chain settings and contract addresses.

### **SQL Table Definitions (simplified)**

\-- Users  
CREATE TABLE users (  
  id SERIAL PRIMARY KEY,  
  wallet\_address VARCHAR(66) UNIQUE NOT NULL,  
  username VARCHAR(64),  
  credit\_score INT DEFAULT 300,  
  streak\_days INT DEFAULT 0,  
  total\_challenges INT DEFAULT 0,  
  total\_points BIGINT DEFAULT 0,  
  registered\_at TIMESTAMP DEFAULT now()  
);

\-- Challenges  
CREATE TABLE challenges (  
  id SERIAL PRIMARY KEY,  
  type VARCHAR(64),  
  name VARCHAR(128),  
  description TEXT,  
  points INT,  
  credit\_impact INT,  
  category VARCHAR(64),  
  rules JSONB,  
  icon VARCHAR(8),  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- UserChallenge (attempts/completions)  
CREATE TABLE user\_challenges (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  challenge\_id INT REFERENCES challenges(id),  
  amount NUMERIC,  
  status VARCHAR(32),  
  proof JSONB,  
  points\_awarded INT,  
  credit\_change INT,  
  tx\_hash VARCHAR(128),  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- Achievements  
CREATE TABLE achievements (  
  id VARCHAR(64) PRIMARY KEY,  
  name VARCHAR(128),  
  description TEXT,  
  icon VARCHAR(8)  
);

\-- UserAchievement  
CREATE TABLE user\_achievements (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  achievement\_id VARCHAR(64) REFERENCES achievements(id),  
  unlocked\_at TIMESTAMP DEFAULT now()  
);

\-- PointLedger (immutable)  
CREATE TABLE point\_ledger (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  delta BIGINT NOT NULL,  
  reason VARCHAR(128),  
  source VARCHAR(64),  
  tx\_hash VARCHAR(128),  
  created\_at TIMESTAMP DEFAULT now()  
);

### **Mock JSON Examples**

**User example**

{  
  "wallet\_address":"0x1234...abcd",  
  "credit\_score":420,  
  "total\_challenges":15,  
  "streak\_days":7,  
  "total\_points\_earned":300,  
  "is\_registered": true  
}

**Challenge example**

{  
  "type":"daily\_save",  
  "name":"Daily Saver",  
  "description":"Save at least $5 today",  
  "points":10,  
  "creditImpact":5,  
  "category":"daily",  
  "icon":"💰"  
}

**Education module example**

{  
  "id":"budgeting\_101",  
  "title":"Budgeting 101",  
  "description":"Create your first budget",  
  "duration":"10 min",  
  "points":35  
}

---

## **3\) Solidity Implementation (EVM)**

### **PointsToken (ERC20) \+ QuestPlatform (mint logic)**

- `PointsToken` is a standard ERC20 token with restricted `mint` and `burn` functions to addresses holding `MINTER_ROLE`.

- `QuestPlatform` tracks `completed` map to prevent double claims. Two flows are provided:

  - `completeQuestForUser`: operator (trusted backend) directly calls the contract to mint points to a user.

  - `claimWithAttestation`: operator signs an off-chain attestation; the user submits it to the contract to claim points (user pays gas). Nonces and deadlines prevent replay.

---

## **4\) Move Implementation (Non-EVM)**

This Move module is a generic demonstration. Network-specific Table APIs and resource creation differ across Sui and Aptos; adapt imports accordingly.

---

## **5\) Frontend → Backend → Blockchain Flow**

1. **UI**: user completes a challenge and submits evidence (challengeId, amount, proof, timestamp) plus a user wallet signature of a digest.

2. **Backend**: validates proof (payment API, image verification), checks rules, stores `user_challenges` record, signs an attestation (operator signature) or directly calls the blockchain to mint points.

3. **Mint options**:

   - **Trusted backend**: backend calls `QuestPlatform.completeQuestForUser(user, questId, points)` with operator wallet that has minting privileges.

   - **Attestation path**: backend returns signed attestation; the user calls `QuestPlatform.claimWithAttestation(...)` to mint (user pays gas).

4. **Recordkeeping & Events**: write ledger entries in `point_ledger`, update `users` table for totals, check & unlock achievements.

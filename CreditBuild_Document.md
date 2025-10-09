# **CreditBuild — Product & Implementation Document**

## **1\) Product Features**

1. **Wallet connection & network enforcement** — connect/disconnect wallets, auto-connect saved wallet, detect injected providers, show network indicator and enforce the app's network.  

- Wallet connect must support EVM and Non-EVM extension (SUI & Aptos)

  refer to use: [https://docs.walletconnect.network/app-sdk/next/installation](https://docs.walletconnect.network/app-sdk/next/installation)

2. **Registration flow** — upon first connect, user registers with initial settings (goal, profile); this initializes on-profile metrics.

3. **Dashboard** — shows credit score, streaks, total points, and challenge counters.  
   **Advanced Dashboard:**  

* Real-time credit score tracking with detailed breakdown  
- Task completion streaks and momentum indicators  
- Multi-category point accumulation (financial, social, educational)  
- Achievement showcase with NFT badge integration  
- Fan club membership status and tier progression

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
  moca\_id VARCHAR(128) UNIQUE,  
  username VARCHAR(64),  
  credit\_score INT DEFAULT 300,  
  streak\_days INT DEFAULT 0,  
  total\_challenges INT DEFAULT 0,  
  total\_points BIGINT DEFAULT 0,  
  social\_points BIGINT DEFAULT 0,  
  financial\_points BIGINT DEFAULT 0,  
  education\_points BIGINT DEFAULT 0,  
  tier\_level VARCHAR(32) DEFAULT 'bronze',  
  reputation\_score INT DEFAULT 0,  
  referral\_code VARCHAR(16) UNIQUE,  
  kyc\_status VARCHAR(32) DEFAULT 'pending',  
  registered\_at TIMESTAMP DEFAULT now(),  
  last\_activity TIMESTAMP DEFAULT now()  
);

\-- KOLs/Influencers  
CREATE TABLE kols (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  kol\_name VARCHAR(128),  
  verification\_status VARCHAR(32) DEFAULT 'pending',  
  social\_followers JSONB, \-- {twitter: 1000, instagram: 500}  
  specialization VARCHAR(64), \-- finance, crypto, lifestyle  
  commission\_rate DECIMAL(5,2) DEFAULT 10.00,  
  total\_earnings BIGINT DEFAULT 0,  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- Fan Clubs  
CREATE TABLE fan\_clubs (  
  id SERIAL PRIMARY KEY,  
  kol\_id INT REFERENCES kols(id),  
  club\_name VARCHAR(128),  
  description TEXT,  
  entry\_requirements JSONB,  
  membership\_fee BIGINT DEFAULT 0,  
  max\_members INT,  
  current\_members INT DEFAULT 0,  
  club\_image VARCHAR(255),  
  contract\_address VARCHAR(66),  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- Fan Club Memberships  
CREATE TABLE fan\_club\_memberships (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  club\_id INT REFERENCES fan\_clubs(id),  
  membership\_tier VARCHAR(32) DEFAULT 'basic',  
  joined\_at TIMESTAMP DEFAULT now(),  
  last\_activity TIMESTAMP DEFAULT now(),  
  total\_tasks\_completed INT DEFAULT 0,  
  tier\_points BIGINT DEFAULT 0  
);

CREATE TABLE challenges (  
  id SERIAL PRIMARY KEY,  
  type VARCHAR(64), \-- financial, social, educational, kol\_exclusive  
  category VARCHAR(64), \-- saving, defi, content\_creation, etc.  
  name VARCHAR(128),  
  description TEXT,  
  points INT,  
  credit\_impact INT,  
  social\_impact INT DEFAULT 0,  
  rules JSONB,  
  verification\_method VARCHAR(64), \-- manual, automatic, smart\_contract  
  creator\_id INT REFERENCES users(id), \-- NULL for platform tasks  
  fan\_club\_id INT REFERENCES fan\_clubs(id), \-- NULL for public tasks  
  difficulty\_level VARCHAR(32) DEFAULT 'beginner',  
  estimated\_time\_minutes INT,  
  max\_completions INT, \-- NULL for unlimited  
  start\_date TIMESTAMP,  
  end\_date TIMESTAMP,  
  is\_recurring BOOLEAN DEFAULT false,  
  recurrence\_pattern VARCHAR(64), \-- daily, weekly, monthly  
  icon VARCHAR(8),  
  featured BOOLEAN DEFAULT false,  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- Social Task Definitions  
CREATE TABLE social\_tasks (  
  id SERIAL PRIMARY KEY,  
  challenge\_id INT REFERENCES challenges(id),  
  platform VARCHAR(32), \-- twitter, instagram, tiktok, youtube  
  action\_type VARCHAR(64), \-- post, share, comment, follow, create\_content  
  content\_requirements JSONB,  
  hashtags\_required TEXT\[\],  
  mention\_requirements TEXT\[\],  
  min\_engagement\_metrics JSONB, \-- {likes: 10, shares: 5, comments: 2}  
  verification\_webhook VARCHAR(255),  
  auto\_verification BOOLEAN DEFAULT false  
);

\-- Social Task Completions  
CREATE TABLE social\_task\_completions (  
  id SERIAL PRIMARY KEY,  
  user\_challenge\_id INT REFERENCES user\_challenges(id),  
  social\_task\_id INT REFERENCES social\_tasks(id),  
  platform\_post\_id VARCHAR(128),  
  post\_url VARCHAR(512),  
  engagement\_metrics JSONB,  
  verification\_status VARCHAR(32) DEFAULT 'pending',  
  verified\_at TIMESTAMP,  
  verified\_by INT REFERENCES users(id)  
);

\-- Multi-category point ledger  
CREATE TABLE enhanced\_point\_ledger (  
  id SERIAL PRIMARY KEY,  
  user\_id INT REFERENCES users(id),  
  points\_delta BIGINT NOT NULL,  
  point\_category VARCHAR(32), \-- financial, social, educational, bonus  
  reason VARCHAR(128),  
  source VARCHAR(64),  
  challenge\_id INT REFERENCES challenges(id),  
  fan\_club\_id INT REFERENCES fan\_clubs(id),  
  multiplier DECIMAL(5,2) DEFAULT 1.00,  
  tx\_hash VARCHAR(128),  
  moca\_token\_equivalent BIGINT,  
  created\_at TIMESTAMP DEFAULT now()  
);

\-- KOL Revenue Tracking  
CREATE TABLE kol\_earnings (  
  id SERIAL PRIMARY KEY,  
  kol\_id INT REFERENCES kols(id),  
  fan\_club\_id INT REFERENCES fan\_clubs(id),  
  revenue\_source VARCHAR(64), \-- membership\_fees, task\_completions, commissions  
  amount BIGINT,  
  currency VARCHAR(16), \-- MOCA, USDC, etc.  
  transaction\_hash VARCHAR(128),  
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

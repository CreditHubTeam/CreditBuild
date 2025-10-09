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
  fanClubs: [
    {
      id: 1,
      kolName: "Crypto Titan",
      kolVerified: true,
      kolSubtitle: "DeFi Trading",
      title: "Titan's DeFi Mastery Club",
      description:
        "Learn advanced DeFi strategies from a seasoned crypto investor with 5+ years experience.",
      members: 2847,
      challenges: 12,
      avgEarnings: 850,
      socials: {
        twitter: 125000,
        youtube: 89000,
        telegram: 45000,
      },
      priceLabel: "100 MOCA",
      image: "/images/fanclubs/titan-defi.png",
    },
    {
      id: 2,
      kolName: "NFT Sensei",
      kolVerified: false,
      kolSubtitle: "NFT Collecting",
      title: "NFT Alpha Hunters",
      description:
        "Daily NFT flips, rarity analysis, and alpha calls from experienced collectors.",
      members: 1520,
      challenges: 8,
      avgEarnings: 640,
      socials: {
        twitter: 72000,
        youtube: 23000,
        telegram: 15000,
      },
      priceLabel: "80 MOCA",
      image: "/images/fanclubs/nft-sensei.png",
    },
    {
      id: 3,
      kolName: "Yield Farmer X",
      kolVerified: true,
      kolSubtitle: "Liquidity Mining",
      title: "Farm to Earn Collective",
      description:
        "Join hands-on yield farming missions and auto-compounding strategies.",
      members: 4110,
      challenges: 15,
      avgEarnings: 1230,
      socials: {
        twitter: 98000,
        youtube: 56000,
        telegram: 32000,
      },
      priceLabel: "150 MOCA",
      image: "/images/fanclubs/yield-farmer-x.png",
    },
  ],
  challenges: [
    {
      type: "daily_save",
      name: "Daily Saver",
      description: "Save at least $5 today",
      points: 10,
      creditImpact: 5,
      category: "daily",
      icon: "💰",
    },
    {
      type: "bill_early",
      name: "Early Bird",
      description: "Pay a bill 3+ days early",
      points: 20,
      creditImpact: 10,
      category: "daily",
      icon: "⚡",
    },
    {
      type: "budget_check",
      name: "Budget Tracker",
      description: "Review and update your budget",
      points: 15,
      creditImpact: 8,
      category: "daily",
      icon: "📊",
    },
    {
      type: "weekly_goal",
      name: "Weekly Saver",
      description: "Save $50+ this week",
      points: 50,
      creditImpact: 25,
      category: "weekly",
      icon: "🎯",
    },
  ],
  achievements: [
    {
      id: "first_challenge",
      name: "First Steps",
      description: "Complete your first challenge",
      icon: "🏆",
      unlocked: true,
    },
    {
      id: "week_streak",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: "month_streak",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "💎",
      unlocked: false,
    },
    {
      id: "good_credit",
      name: "Good Credit Club",
      description: "Reach 650 credit score",
      icon: "⭐",
      unlocked: false,
    },
    {
      id: "savings_master",
      name: "Savings Master",
      description: "Complete 10 savings challenges",
      icon: "🏅",
      unlocked: false,
    },
    {
      id: "perfect_score",
      name: "Perfect Credit",
      description: "Reach 850 credit score",
      icon: "👑",
      unlocked: false,
    },
  ],
  walletProviders: [
    {
      name: "MetaMask",
      id: "io.metamask",
      icon: "🦊",
      description: "Most popular Ethereum wallet",
      downloadUrl: "https://metamask.io",
    },
    {
      name: "Coinbase Wallet",
      id: "baseAccount",
      icon: "🔵",
      description: "User-friendly wallet by Coinbase",
      downloadUrl: "https://wallet.coinbase.com",
    },
    {
      name: "WalletConnect",
      id: "walletConnect",
      icon: "🔗",
      description: "Connect with mobile wallets",
      downloadUrl: "https://walletconnect.com",
    },
    {
      name: "Sub Wallet",
      id: "app.subwallet",
      icon: "🦀",
      description: "Multi-chain wallet for Polkadot",
      downloadUrl: "https://subwallet.app",
    },
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
    {
      id: "credit_basics",
      title: "Credit Score Basics",
      description: "Learn what affects your credit score",
      duration: "5 min",
      points: 25,
    },
    {
      id: "budgeting_101",
      title: "Budgeting 101",
      description: "Create your first budget",
      duration: "10 min",
      points: 35,
    },
    {
      id: "debt_management",
      title: "Debt Management",
      description: "Strategies to pay off debt faster",
      duration: "8 min",
      points: 30,
    },
    {
      id: "investment_basics",
      title: "Investment Fundamentals",
      description: "Start building wealth with smart investments",
      duration: "12 min",
      points: 40,
    },
  ],
};

// EXAMPLE DATA structure

// -- Users
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   wallet_address VARCHAR(66) UNIQUE NOT NULL,
//   moca_id VARCHAR(128) UNIQUE,
//   username VARCHAR(64),
//   credit_score INT DEFAULT 300,
//   streak_days INT DEFAULT 0,
//   total_challenges INT DEFAULT 0,
//   total_points BIGINT DEFAULT 0,
//   social_points BIGINT DEFAULT 0,
//   financial_points BIGINT DEFAULT 0,
//   education_points BIGINT DEFAULT 0,
//   tier_level VARCHAR(32) DEFAULT 'bronze',
//   reputation_score INT DEFAULT 0,
//   referral_code VARCHAR(16) UNIQUE,
//   kyc_status VARCHAR(32) DEFAULT 'pending',
//   registered_at TIMESTAMP DEFAULT now(),
//   last_activity TIMESTAMP DEFAULT now()
// );

// -- KOLs/Influencers
// CREATE TABLE kols (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   kol_name VARCHAR(128),
//   verification_status VARCHAR(32) DEFAULT 'pending',
//   social_followers JSONB, -- {twitter: 1000, instagram: 500}
//   specialization VARCHAR(64), -- finance, crypto, lifestyle
//   commission_rate DECIMAL(5,2) DEFAULT 10.00,
//   total_earnings BIGINT DEFAULT 0,
//   created_at TIMESTAMP DEFAULT now()
// );

// -- Fan Clubs
// CREATE TABLE fan_clubs (
//   id SERIAL PRIMARY KEY,
//   kol_id INT REFERENCES kols(id),
//   club_name VARCHAR(128),
//   description TEXT,
//   entry_requirements JSONB,
//   membership_fee BIGINT DEFAULT 0,
//   max_members INT,
//   current_members INT DEFAULT 0,
//   club_image VARCHAR(255),
//   contract_address VARCHAR(66),
//   created_at TIMESTAMP DEFAULT now()
// );

// -- Fan Club Memberships
// CREATE TABLE fan_club_memberships (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   club_id INT REFERENCES fan_clubs(id),
//   membership_tier VARCHAR(32) DEFAULT 'basic',
//   joined_at TIMESTAMP DEFAULT now(),
//   last_activity TIMESTAMP DEFAULT now(),
//   total_tasks_completed INT DEFAULT 0,
//   tier_points BIGINT DEFAULT 0
// );

// CREATE TABLE challenges (
//   id SERIAL PRIMARY KEY,
//   type VARCHAR(64), -- financial, social, educational, kol_exclusive
//   category VARCHAR(64), -- saving, defi, content_creation, etc.
//   name VARCHAR(128),
//   description TEXT,
//   points INT,
//   credit_impact INT,
//   social_impact INT DEFAULT 0,
//   rules JSONB,
//   verification_method VARCHAR(64), -- manual, automatic, smart_contract
//   creator_id INT REFERENCES users(id), -- NULL for platform tasks
//   fan_club_id INT REFERENCES fan_clubs(id), -- NULL for public tasks
//   difficulty_level VARCHAR(32) DEFAULT 'beginner',
//   estimated_time_minutes INT,
//   max_completions INT, -- NULL for unlimited
//   start_date TIMESTAMP,
//   end_date TIMESTAMP,
//   is_recurring BOOLEAN DEFAULT false,
//   recurrence_pattern VARCHAR(64), -- daily, weekly, monthly
//   icon VARCHAR(8),
//   featured BOOLEAN DEFAULT false,
//   created_at TIMESTAMP DEFAULT now()
// );

// -- Social Task Definitions
// CREATE TABLE social_tasks (
//   id SERIAL PRIMARY KEY,
//   challenge_id INT REFERENCES challenges(id),
//   platform VARCHAR(32), -- twitter, instagram, tiktok, youtube
//   action_type VARCHAR(64), -- post, share, comment, follow, create_content
//   content_requirements JSONB,
//   hashtags_required TEXT[],
//   mention_requirements TEXT[],
//   min_engagement_metrics JSONB, -- {likes: 10, shares: 5, comments: 2}
//   verification_webhook VARCHAR(255),
//   auto_verification BOOLEAN DEFAULT false
// );

// -- Social Task Completions
// CREATE TABLE social_task_completions (
//   id SERIAL PRIMARY KEY,
//   user_challenge_id INT REFERENCES user_challenges(id),
//   social_task_id INT REFERENCES social_tasks(id),
//   platform_post_id VARCHAR(128),
//   post_url VARCHAR(512),
//   engagement_metrics JSONB,
//   verification_status VARCHAR(32) DEFAULT 'pending',
//   verified_at TIMESTAMP,
//   verified_by INT REFERENCES users(id)
// );

// -- Multi-category point ledger
// CREATE TABLE enhanced_point_ledger (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   points_delta BIGINT NOT NULL,
//   point_category VARCHAR(32), -- financial, social, educational, bonus
//   reason VARCHAR(128),
//   source VARCHAR(64),
//   challenge_id INT REFERENCES challenges(id),
//   fan_club_id INT REFERENCES fan_clubs(id),
//   multiplier DECIMAL(5,2) DEFAULT 1.00,
//   tx_hash VARCHAR(128),
//   moca_token_equivalent BIGINT,
//   created_at TIMESTAMP DEFAULT now()
// );

// -- KOL Revenue Tracking
// CREATE TABLE kol_earnings (
//   id SERIAL PRIMARY KEY,
//   kol_id INT REFERENCES kols(id),
//   fan_club_id INT REFERENCES fan_clubs(id),
//   revenue_source VARCHAR(64), -- membership_fees, task_completions, commissions
//   amount BIGINT,
//   currency VARCHAR(16), -- MOCA, USDC, etc.
//   transaction_hash VARCHAR(128),
//   created_at TIMESTAMP DEFAULT now()
// );

// -- UserChallenge (attempts/completions)
// CREATE TABLE user_challenges (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   challenge_id INT REFERENCES challenges(id),
//   amount NUMERIC,
//   status VARCHAR(32),
//   proof JSONB,
//   points_awarded INT,
//   credit_change INT,
//   tx_hash VARCHAR(128),
//   created_at TIMESTAMP DEFAULT now()
// );

// -- Achievements
// CREATE TABLE achievements (
//   id VARCHAR(64) PRIMARY KEY,
//   name VARCHAR(128),
//   description TEXT,
//   icon VARCHAR(8)
// );

// -- UserAchievement
// CREATE TABLE user_achievements (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   achievement_id VARCHAR(64) REFERENCES achievements(id),
//   unlocked_at TIMESTAMP DEFAULT now()
// );

// -- PointLedger (immutable)
// CREATE TABLE point_ledger (
//   id SERIAL PRIMARY KEY,
//   user_id INT REFERENCES users(id),
//   delta BIGINT NOT NULL,
//   reason VARCHAR(128),
//   source VARCHAR(64),
//   tx_hash VARCHAR(128),
//   created_at TIMESTAMP DEFAULT now()
// );

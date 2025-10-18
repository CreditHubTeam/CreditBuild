// Hãy xây dựng trang chi tiết câu lạc bộ fan clubs theo style 8bit mô tả sau:
// - Header: Hiển thị tên câu lạc bộ, mô tả ngắn, tên chủ sở hữu và lấy một vài thuộc tính cơ bản từ type có sẵn

// export interface ViewFanClubCard {
//   id: string;
//   kolName: string;
//   kolVerified: boolean;
//   kolSubtitle?: string; // specialization
//   title: string;
//   description?: string;
//   members: number;
//   challenges: number;
//   avgEarnings: number; // number hiển thị
//   socials: {
//     twitter?: number;
//     youtube?: number;
//     telegram?: number;
//   };
//   priceLabel: string; // "100 MOCA"
//   image?: string; // cover/thumb nếu có
//   isJoined: boolean;
// }

// - Body: Danh sách nhiệm vụ (tasks) của câu lạc bộ với khả năng CRUD (tạo, đọc, cập nhật, xóa) nếu người dùng là chủ sở hữu và thuộc tính của challenge type có sẵn như:
// export type Challenge = {
//   id: string;
//   type: string;
//   category: string;
//   name: string;
//   description?: string;
//   points: number;
//   creditImpact: number;
//   isCompleted: boolean;
//   icon?: string;
//   estimatedTimeMinutes?: number;
// };

// - Footer: Danh sách thành viên của câu lạc bộ và thông tin của user hiện tại như type có sẵn User:
// export type User = {
//   walletAddress: string;
//   creditScore: number;
//   totalChallenges: number;
//   streakDays: number;
//   totalPoints: number;
//   isRegistered: boolean;
//   bestStreak: number;
// };

"use client";
import { useApp } from "@/context/AppContext";
import { Challenge, User } from "@/lib/types";
import { ViewFanClubCard } from "@/lib/types/view";
import { useUI } from "@/state/ui";
import Image from "next/image";
import * as React from "react";

/* ----------------------------
   Mock types
----------------------------- */

type Props = { params: Promise<{ id: string }> };

export default function ClubDetailPage({ params }: Props) {
  const { id } = React.use(params);
  console.log("ClubDetailPage id:", id);

  const { handleNavigation } = useApp();

  const { open } = useUI();
  /* ----------------------------
     Mock data
  ----------------------------- */
  const club: ViewFanClubCard = {
    id: "1",
    kolName: "Sinoo",
    kolVerified: true,
    kolSubtitle: "DeFi Analyst",
    title: "Crypto Builders Club",
    description:
      "A place for DeFi enthusiasts and builders to share, learn, and earn together.",
    members: 128,
    challenges: 4,
    avgEarnings: 520,
    socials: { twitter: 1024, youtube: 480, telegram: 680 },
    priceLabel: "100 MOCA",
    image: "/club-cover.png",
    isJoined: true,
    isOwner: true,
  };

  const challenges: Challenge[] = [
    {
      id: "c1",
      type: "offchain",
      category: "Education",
      name: "Write an Article on Yield Farming",
      description: "Share your insights on DeFi yield strategies.",
      points: 100,
      creditImpact: 10,
      isCompleted: false,
      estimatedTimeMinutes: 30,
    },
    {
      id: "c2",
      type: "onchain",
      category: "Technical",
      name: "Deploy a Smart Contract",
      description: "Deploy your first verified contract on Base Sepolia.",
      points: 200,
      creditImpact: 25,
      isCompleted: true,
      estimatedTimeMinutes: 60,
    },
  ];

  const currentUser: User = {
    walletAddress: "0x1234...abcd",
    creditScore: 460,
    totalChallenges: 12,
    streakDays: 5,
    totalPoints: 840,
    isRegistered: true,
    bestStreak: 14,
  };

  const members = [
    { name: "0xF3a2...91bC", creditScore: 450 },
    { name: "0xC1B4...02Df", creditScore: 520 },
    { name: "0xE4C5...77a1", creditScore: 390 },
    { name: "0x99A2...A3CC", creditScore: 610 },
  ];

  const isOwner = true; // giả lập user là chủ club

  /* ----------------------------
     UI hiển thị
  ----------------------------- */
  return (
    <div className="bg-[#f6dca3] text-black min-h-screen pixel-font p-4 sm:p-6 border-[3px] border-black rounded-[8px] m-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-3xl font-bold pixel-font">🎮 My Fan Clubs</h1> */}
        <button
          onClick={() => handleNavigation("/fan-clubs/my-clubs")}
          className="pixel-btn pixel-btn--secondary"
        >
          ⬅ Back to Fan Clubs
        </button>
      </div>

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#ffeeb0] border-[3px] border-black rounded-[6px] overflow-hidden flex items-center justify-center">
          {club.image ? (
            <Image
              src={club.image}
              alt={club.title}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-xs text-gray-700">No Image</span>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            {club.title}
            {club.kolVerified && (
              <span className="text-blue-600 text-lg">✓</span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-700">{club.kolSubtitle}</p>
          <p className="text-sm sm:text-base mt-2">
            {club.description || "No description."}
          </p>
          <div className="text-xs sm:text-sm mt-1 flex flex-wrap gap-2">
            <span className="pixel-badge bg-mc-blue text-mc-gold">
              Owner: <strong>{club.kolName}</strong>
            </span>
            <span className="pixel-badge bg-mc-blue text-white">
              • Members: {club.members.toLocaleString()}
            </span>
            <span className="pixel-badge bg-mc-blue text-white">
              • Challenges: {club.challenges}
            </span>
            <span className="pixel-badge bg-mc-blue text-white">
              • Avg Earn: {club.avgEarnings} pts
            </span>
          </div>
        </div>

        {!club.isJoined && (
          <button className="pixel-btn pixel-btn--primary sm:ml-auto sm:mt-0 mt-2 px-3 py-2">
            Join Club ({club.priceLabel})
          </button>
        )}
      </header>

      {/* BODY - CHALLENGES */}
      <section className="border-t-[3px] border-black pt-4">
        <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center justify-between">
          Club Challenges
          {isOwner && (
            <button
              className="pixel-btn pixel-btn--primary text-xs sm:text-sm py-2 px-3"
              onClick={() => open("formClubChallenge", club.id)}
            >
              + Add Task
            </button>
          )}
        </h2>

        {challenges.length === 0 ? (
          <p className="text-sm">No challenges yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {challenges.map((task) => (
              <div
                key={task.id}
                // className="bg-[#ffeeb0] border-[3px] border-black rounded-[6px] p-3 shadow-[3px_3px_0_#000]"
                className="relative bg-[#f6dca3] text-black border-[3px] border-black rounded-[6px] p-4 shadow-[4px_4px_0_0_#000] pixel-card transition-transform hover:scale-[1.02] 
                
                "
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {task.name}
                  </h3>
                  {isOwner && (
                    <button className="pixel-btn pixel-btn--primary text-xs px-2 py-1">
                      Edit
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm mb-2 text-gray-800">
                  {task.description || "No description."}
                </p>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Points: {task.points}</span>
                  <span>Impact: +{task.creditImpact}</span>
                </div>
                <div className="mt-2 text-xs">
                  {task.isCompleted ? (
                    <span className="text-green-600">✅ Completed</span>
                  ) : (
                    <span className="text-gray-200">🕹 In progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER - MEMBERS */}
      <section className="border-t-[3px] border-black mt-6 pt-4">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Members</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {members.map((m, i) => (
            <div
              key={i}
              className="relative bg-[#f6dca3] text-black border-[3px] border-black rounded-[6px] p-4 shadow-[4px_4px_0_0_#000] pixel-card transition-transform hover:scale-[1.02]"
            >
              <div className="font-bold text-xs sm:text-sm truncate">
                {m.name}
              </div>
              <div className="text-[10px] text-gray-300">
                Score: {m.creditScore}
              </div>
            </div>
          ))}
        </div>

        {/* CURRENT USER */}
        <div className="bg-[#5b8731] border-[3px] border-black rounded-[4px] p-3 mt-6">
          <h3 className="font-bold text-base sm:text-lg mb-2 text-center text-mc-gold">
            Your Club Stats
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center text-mc-darkbrown">
            <div>
              <div className="text-lg font-bold">{currentUser.creditScore}</div>
              <div className="text-xs uppercase">Credit</div>
            </div>
            <div className="border-x-[3px] border-black">
              <div className="text-lg font-bold">
                {currentUser.totalChallenges}
              </div>
              <div className="text-xs uppercase">Challenges</div>
            </div>
            <div>
              <div className="text-lg font-bold">{currentUser.totalPoints}</div>
              <div className="text-xs uppercase">Points</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

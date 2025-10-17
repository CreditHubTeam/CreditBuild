// Hãy đọc mô tả này và sửa lại đúng type và đúng các trường được request cho modal tạo challenge này Create Challenge Page
// Core Function: To provide a comprehensive form for administrators or designated creators to define new challenges. The UI must adapt dynamically based on the type of challenge being created (On-Chain vs. Off-Chain).
// Key Components:
// Challenge Title: A standard text input for the name of the challenge.
// Challenge Description: A rich-text editor (textarea) to explain the task, its purpose, and instructions.
// Credit Points: A number input to define the reward value.
// Challenge Category: A dropdown or radio button set (On-Chain, Off-Chain, Community, Technical). The selection here will conditionally render the fields below.
// Conditional Fields for "Off-Chain":
// Acceptance Criteria: A text area where the creator can list the specific requirements for a valid submission (e.g., "Must include a screenshot," "Link must point to a live demo").
// Proof Type: A dropdown to specify how the user should submit proof (File Upload, Link, Text).
// Conditional Fields for "On-Chain":
// Target Contract Address: An input field for the smart contract address to be checked.
// Verification Logic: A dropdown with predefined rules (e.g., "Verify contract interaction (ABI + function name)", "Verify token ownership"). This simplifies the process for the creator.
// Visibility Control: Radio buttons to set the challenge as Public or Club-Exclusive. If Club-Exclusive is chosen, a dropdown appears to select the specific club.
// Submit Button: A "Create Challenge" button to finalize and publish.
// User Actions & Flows:
// The creator fills out the general information (Title, Points, etc.).
// They select a category, which updates the form to show relevant fields.
// They define the specific criteria for completion.
// They set the challenge's visibility.
// Upon submission, the challenge is added to the platform's catalog.
// Data Requirements (API Payload):
// title: string, description: string, points: number, category: string, acceptanceCriteria: string[] (for off-chain), verificationLogic: object (for on-chain), visibility: string, clubId?: string.

// request type:
// type CreateClubChallengeRequest = {
//   walletAddress: string;
//   icon?: string;
//   title: string;
//   description: string;
//   category: string;
//   points: number;
//   creditImpact: number;
//   estimatedTimeMinutes?: number;
// };

"use client";
import { useState } from "react";
import { useUI } from "@/state/ui";
import Modal from "@/ui/Modal";
import { useData } from "@/state/data";
import { CreateClubChallengeRequest } from "@/lib/api/challenges";

export default function FormClubChallengeModal() {
  const { modal, close, id } = useUI();
  const { currentUser, createClubChallenge } = useData();
  console.log("FormClubChallengeModal - clubId:", id); // Pass ID ok

  const [form, setForm] = useState<CreateClubChallengeRequest>({
    walletAddress: currentUser?.walletAddress || "",
    title: "",
    description: "",
    points: 0,
    category: "Community",
    creditImpact: 0,
    estimatedTimeMinutes: 0,
    icon: "",
    typeProof: "",
  });
  const [loading, setLoading] = useState(false);

  if (modal !== "formClubChallenge") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: CreateClubChallengeRequest = {
      ...form,
    };
    console.log("Create Challenge Payload:", payload);
    // createClubChallenge(id, payload);

    setTimeout(() => {
      setLoading(false);
      close();
    }, 500);
  };

  return (
    <Modal title="Create New Challenge" onClose={close}>
      <form
        onSubmit={handleSubmit}
        className="bg-[#f6dca3] border-[3px] border-black rounded-[6px] p-4 pixel-font text-black"
      >
        {/* HEADER */}
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Challenge Information
        </h2>

        <div className="grid grid-cols-4 gap-2">
          {/* ICON */}
          <div className="col-span-1">
            <label className="block mb-2 font-bold text-sm sm:text-base">
              Icon
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] mb-4"
              placeholder="e.g.🎯"
            />
          </div>

          {/* TITLE */}
          <div className="col-span-3">
            <label className="block mb-2 font-bold text-sm sm:text-base">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] mb-4"
              placeholder="Enter challenge title"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] h-24 resize-none mb-4"
          placeholder="Explain the task, purpose, and instructions"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          {/* POINTS */}
          <div>
            <label className="block mb-2 font-bold text-sm sm:text-base">
              Points
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) =>
                setForm({ ...form, points: Number(e.target.value) })
              }
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] mb-4"
              placeholder="Reward points"
            />
          </div>

          {/* CREDIT POINTS */}
          <div className="">
            <label className="block mb-2 font-bold text-sm sm:text-base text-nowrap">
              Credit Points
            </label>
            <input
              type="number"
              value={form.creditImpact}
              onChange={(e) =>
                setForm({ ...form, creditImpact: Number(e.target.value) })
              }
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] mb-4"
              placeholder="Reward points"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Category
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Community", "Technical"].map((cat) => (
            <label
              key={cat}
              className={`flex items-center gap-1 bg-[#ffeeb0] border-[3px] border-black rounded-[4px] px-3 py-1 cursor-pointer ${
                form.category === cat ? "bg-[#61dafb]" : ""
              }`}
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={form.category === cat}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* estimatedTimeMinutes */}
          <div className="col-span-2">
            <label className="block mb-2 font-bold text-sm sm:text-base text-nowrap">
              Estimated(mins)
            </label>
            <input
              type="number"
              value={form.estimatedTimeMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimatedTimeMinutes: Number(e.target.value),
                })
              }
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] mb-4"
              placeholder="Estimated time to complete"
            />
          </div>

          {/* TYPE PROOF */}
          <div className="col-span-2">
            <label className="block mb-2 font-bold text-sm sm:text-base">
              Proof Type
            </label>
            <select
              value={form.typeProof}
              onChange={(e) => setForm({ ...form, typeProof: e.target.value })}
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0]"
            >
              <option>File Upload</option>
              <option>Link</option>
              <option>Text</option>
            </select>
          </div>
        </div>

        {/* CONDITIONAL FIELDS */}
        {/* {form.category === "Off-Chain" && (
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm sm:text-base">
              Acceptance Criteria (each line = 1 rule)
            </label>
            <textarea
              value={criteriaText}
              onChange={(e) => setCriteriaText(e.target.value)}
              className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] h-24 resize-none mb-3"
              placeholder={`Example:\n- Must include screenshot\n- Provide live demo link`}
            />
          </div>
        )} */}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="pixel-btn pixel-btn--primary w-full sm:flex-1 py-2 sm:py-3"
          >
            {loading ? "Creating..." : "Create Challenge"}
          </button>
          <button
            type="button"
            onClick={close}
            className="pixel-btn pixel-btn--secondary w-full sm:flex-1 py-2 sm:py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

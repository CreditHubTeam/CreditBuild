"use client";
import { useState } from "react";
import { useUI } from "@/state/ui";
import { useData } from "@/state/data";
import Modal from "@/ui/Modal";
import Image from "next/image";

export default function FormFanClubModal() {
  const { modal, close } = useUI();
  const { createFanClub, currentUser } = useData();

  type FormState = {
    name: string;
    description: string;
    membershipType: "open" | "invite_only";
    tags: string;
    logoFile: File | null;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    membershipType: "open",
    tags: "",
    logoFile: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (modal !== "formFanClub") return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, logoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return alert("Please fill all fields");

    setLoading(true);
    try {
      const tagsArray = form.tags.split(",").map((t) => t.trim());
      await createFanClub({
        walletAddress: currentUser?.walletAddress as string,
        name: form.name,
        description: form.description,
        membershipType: form.membershipType,
        tags: tagsArray,
        logoFile: form.logoFile,
      });
      console.log("club", {
        name: form.name,
        description: form.description,
        membershipType: form.membershipType,
        tags: tagsArray,
        logoFile: form.logoFile,
      });
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create New Fan Club" onClose={close}>
      <form
        onSubmit={handleSubmit}
        className="bg-[#f6dca3] border-[3px] border-black rounded-[6px] p-4 pixel-font text-black"
      >
        {/* HEADER */}
        <h2 className="text-lg sm:text-xl font-bold mb-4">Club Information</h2>

        {/* LOGO UPLOAD */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="w-20 h-20 flex items-center justify-center bg-[#ffeeb0] border-[3px] border-black rounded-[4px] overflow-hidden">
            {preview ? (
              // <img
              //   src={preview}
              //   alt="Logo Preview"
              //   className="object-cover w-full h-full"
              // />
              // Image from nextjs
              <Image
                src={preview}
                alt="Logo Preview"
                className="object-cover w-full h-full"
                width={80}
                height={80}
              />
            ) : (
              <span className="text-sm text-gray-700 text-center">Logo</span>
            )}
          </div>
          <label className="pixel-btn pixel-btn--secondary px-3 py-2 text-sm cursor-pointer">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* NAME */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Club Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] focus:outline-none mb-4"
          placeholder="Enter club name"
        />

        {/* DESCRIPTION */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] h-24 resize-none focus:outline-none mb-4"
          placeholder="Describe your fan club..."
        />

        {/* MEMBERSHIP TYPE */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Membership Type
        </label>
        <div className="flex gap-3 mb-4">
          {["open", "invite_only"].map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                name="membershipType"
                value={type}
                checked={form.membershipType === type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    membershipType: e.target.value as "open" | "invite_only",
                  })
                }
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>

        {/* TAGS */}
        <label className="block mb-2 font-bold text-sm sm:text-base">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full border-[3px] border-black rounded-[4px] p-2 bg-[#ffeeb0] focus:outline-none mb-4"
          placeholder="e.g. DeFi, NFT, Community"
        />

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="pixel-btn pixel-btn--primary w-full sm:flex-1 py-2 sm:py-3"
          >
            {loading ? "Creating..." : "Create Club"}
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

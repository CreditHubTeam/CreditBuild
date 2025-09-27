"use client";
import { useApp } from "@/context/AppContext";
import PixelModal from "./PixelModal";

export default function RegistrationModal() {
  const { openModal, closeModals, handleRegistration } = useApp();
  return (
    <PixelModal
      open={openModal === "registrationModal"}
      title="Welcome to CreditBuild!"
      onClose={closeModals}
    >
      <p className="mb-4 text-[12px]">
        Ready to start building your credit score? Let&apos;s set up your
        profile!
      </p>
      <form onSubmit={handleRegistration} className="grid gap-3">
        <label className="text-[10px]">Choose your starting goal:</label>
        <select className="text-black p-2 rounded border-2 border-black">
          <option value="improve">Improve existing credit</option>
          <option value="build">Build from scratch</option>
          <option value="maintain">Maintain good credit</option>
        </select>
        <button className="pixel-btn pixel-btn--primary w-full">
          Start Building!
        </button>
      </form>
    </PixelModal>
  );
}

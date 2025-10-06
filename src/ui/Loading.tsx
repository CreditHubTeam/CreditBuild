"use client";
import { useUI } from "@/state/ui";

export default function LoadingGlobal() {
  const { loading } = useUI();
  if (!loading.visible) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative pixel-card bg-mc-stone p-5 text-center text-white">
        <div className="text-3xl mb-3 animate-pulse2">⛏️</div>
        <p className="text-sm">{loading.message}</p>
      </div>
    </div>
  );
}

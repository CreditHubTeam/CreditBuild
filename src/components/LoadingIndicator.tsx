"use client";
import { useApp } from "@/context/AppContext";

export default function LoadingIndicator() {
  const { loading } = useApp();
  if (!loading.visible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="pixel-card bg-mc-stone p-6 text-center">
        <div className="text-3xl mb-3 animate-pulse2">⛏️</div>
        <p className="text-sm">{loading.message}</p>
      </div>
    </div>
  );
}

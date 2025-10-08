"use client";
import { useUI } from "@/state/ui";

export default function Notification() {
  const { notice, clearNotice } = useUI();
  if (!notice.visible) return null;

  const bgColorClass = {
    success: "bg-mc-green",
    error: "bg-mc-red",
    warning: "bg-mc-gold",
    info: "bg-mc-blue",
  }[notice.type];

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`pixel-card p-3 text-white ${bgColorClass} min-w-[300px] text-center`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm flex-1">{notice.message}</span>
          <button
            onClick={clearNotice}
            className="pixel-btn pixel-btn--secondary text-[10px] ml-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useApp } from "@/context/AppContext";

export default function Notification() {
  const { notification, hideNotification } = useApp();
  if (!notification.visible) return null;
  const color = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[notification.type];

  return (
    <div className="fixed top-3 inset-x-3">
      <div className={`pixel-card p-3 text-center ${color}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm">{notification.message}</span>
          <button
            className="pixel-btn pixel-btn--secondary text-[10px]"
            onClick={hideNotification}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

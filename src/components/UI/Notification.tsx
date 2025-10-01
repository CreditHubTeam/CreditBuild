"use client";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";

export default function Notification() {
  const { notification, hideNotification } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tự động ẩn notification sau 3 giây
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000); // 3 giây

      // Cleanup timer khi component unmount hoặc notification thay đổi
      return () => clearTimeout(timer);
    }
  }, [notification.visible, hideNotification]);


  // Không hiển thị khi chưa mount hoặc visible = false
  if (!mounted || !notification.visible) return null;
  const color = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[notification.type];

  return (
    <div id="notification" className="fixed top-3 inset-x-3 z-[9999]">
      <div className={`pixel-card p-3 text-center ${color}`}>
        <div className="flex items-center justify-between">
          <span id="notificationMessage" className="text-sm">
            {notification.message}
          </span>
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

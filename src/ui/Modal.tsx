"use client";
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative pixel-card bg-mc-stone w-[92%] max-w-md p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn--secondary text-[10px] px-2 py-1"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative pixel-card bg-mc-stone w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl p-3 sm:p-4 md:p-6 text-white my-auto max-h-[90vh] overflow-y-auto">
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

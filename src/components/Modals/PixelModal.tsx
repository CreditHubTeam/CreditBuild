"use client";
export default function PixelModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="pixel-card bg-mc-stone w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-2 sm:p-4 border-b-3 border-black bg-mc-oak text-black">
          <h2 className="text-sm sm:text-base truncate flex-1 mr-2">{title}</h2>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn--secondary text-[8px] sm:text-[10px] px-2 py-1 flex-shrink-0"
          >
            <span className="hidden sm:inline">&times;</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
        <div className="p-2 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

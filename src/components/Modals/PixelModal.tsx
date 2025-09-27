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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="pixel-card bg-mc-stone w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-3 border-black bg-mc-oak text-black">
          <h2 className="text-base">{title}</h2>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn--secondary text-[10px]"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

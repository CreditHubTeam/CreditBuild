"use client";
import { useApp } from "@/context/AppContext";
type PageId =
  | "landingPage"
  | "dashboard"
  | "achievementsPage"
  | "progressPage"
  | "educationPage";
export default function BottomNav() {
  const { currentPage, navigateToPage } = useApp();
  const Item = ({
    page,
    icon,
    label,
  }: {
    page: PageId;
    icon: string;
    label: string;
  }) => (
    <button
      onClick={() => navigateToPage(page)}
      className={`flex flex-col items-center justify-center px-4 py-2 ${
        currentPage === page ? "bg-mc-gold text-black" : "bg-mc-oak text-black"
      } border-3 border-black rounded-pixel`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-3 inset-x-3 grid grid-cols-4 gap-2">
      <Item page="dashboard" icon="🏠" label="Home" />
      <Item page="achievementsPage" icon="🏆" label="Achievements" />
      <Item page="progressPage" icon="📈" label="Progress" />
      <Item page="educationPage" icon="📚" label="Learn" />
    </nav>
  );
}

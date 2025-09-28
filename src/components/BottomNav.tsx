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
      className={`flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 transition-all duration-150 ${
        currentPage === page ? "bg-mc-gold text-black" : "bg-mc-oak text-black"
      } border-3 border-black rounded-pixel shadow-pixel hover:shadow-none active:translate-y-[1px] min-h-[50px] sm:min-h-[65px] lg:min-h-[75px]`}
    >
      <span className="text-sm sm:text-lg lg:text-xl mb-1">{icon}</span>
      <span className="text-[8px] sm:text-[10px] lg:text-[12px] leading-tight text-center font-bold">
        {label}
      </span>
    </button>
  );

  return (
    <nav className="fixed bottom-2 sm:bottom-3 left-2 right-2 sm:left-4 sm:right-4 lg:left-8 lg:right-8 z-40">
      <div className="grid grid-cols-4 gap-1 sm:gap-3 lg:gap-4">
        <Item page="dashboard" icon="🏠" label="Home" />
        <Item page="achievementsPage" icon="🏆" label="Achievements" />
        <Item page="progressPage" icon="📈" label="Progress" />
        <Item page="educationPage" icon="📚" label="Learn" />
      </div>
    </nav>
  );
}

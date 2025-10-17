"use client";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

type NavItem = {
  path: string;
  icon: string;
  label: string;
};

const navItems: NavItem[] = [
  { path: "/dashboard", icon: "🏠", label: "Home" },
  { path: "/achievements", icon: "🏆", label: "Achievements" },
  { path: "/progress", icon: "📈", label: "Progress" },
  { path: "/education", icon: "📚", label: "Learn" },
  { path: "/fan-clubs", icon: "🎉", label: "Fan Clubs" },
];

export default function BottomNav() {
  const { handleNavigation } = useApp();
  const pathname = usePathname();

  const Item = ({ path, icon, label }: NavItem) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);

    return (
      <button
        onClick={() => handleNavigation(path)}
        className={`flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 transition-all duration-300 ease-out ${
          isActive
            ? "bg-mc-gold text-black transform scale-105 shadow-pixel"
            : "bg-mc-oak text-black hover:bg-mc-brown hover:text-white"
        } border-3 border-black rounded-pixel shadow-pixel hover:shadow-none active:translate-y-[1px] active:scale-100 min-h-[50px] sm:min-h-[65px] lg:min-h-[75px]`}
      >
        <span className="w-full h-full flex-1 flex items-center justify-center text-[32px] sm:text-[40px] lg:text-[52px] leading-none">
          {icon}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-2 sm:bottom-3 left-2 right-2 sm:left-4 sm:right-4 lg:left-8 lg:right-8 z-40">
      <div className="grid grid-cols-5 gap-1 sm:gap-3 lg:gap-4">
        {navItems.map((item) => (
          <Item key={item.path} {...item} />
        ))}
      </div>
    </nav>
  );
}

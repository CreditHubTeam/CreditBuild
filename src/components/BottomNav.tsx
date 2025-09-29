"use client";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

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
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isWalletConnected, showNotification } = useApp();

  const handleNavigation = (path: string) => {
    if (!isWalletConnected && path !== "/") {
      showNotification("Please connect your wallet first!", "warning");
      return;
    }
    router.push(path);
  };

  const Item = ({
    path,
    icon,
    label,
  }: {
    path: string;
    icon: string;
    label: string;
  }) => (
    <button
      onClick={() => handleNavigation(path)}
      className={`flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 transition-all duration-300 ease-out ${
        pathname === path
          ? "bg-mc-gold text-black transform scale-105 shadow-pixel"
          : "bg-mc-oak text-black hover:bg-mc-brown hover:text-white"
      } border-3 border-black rounded-pixel shadow-pixel hover:shadow-none active:translate-y-[1px] active:scale-100 min-h-[50px] sm:min-h-[65px] lg:min-h-[75px]`}
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
        {navItems.map((item) => (
          <Item
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </nav>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import Providers from "./providers";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "CreditBuild - Gamified Credit Builder",
  description: "Build your credit like Minecraft!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pressStart.variable}>
      <body className="font-pixel text-[12px] leading-6 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

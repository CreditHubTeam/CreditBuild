import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

import AppLayout from "@/components/AppLayout";
import { getConfig } from "@/lib/wagmi";
import { Providers } from "./providers";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "CreditBuild - Gamified Credit Builder",
  description: "Build your credit like Minecraft!",
};

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(), //Quan trọng vì config phải đồng bộ giữa server (SSR) và client (hydration).
    (await headers()).get("cookie") //Dùng wagmi util để chuyển cookie → initial wagmi state. Nếu không có → mỗi lần refresh SSR sẽ “mất connect state”, user phải reconnect.
  );
  return (
    <html lang="en" className={pressStart.variable}>
      <body className={pressStart.className}>
        <Providers initialState={initialState}>
          <AppLayout>{props.children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
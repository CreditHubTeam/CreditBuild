"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "@/lib/wagmi";
import { UIProvider } from "@/state/ui";
import { WalletProvider } from "@/state/wallet";
import { DataProvider } from "@/state/data";
import { AppProvider } from "@/context/AppContext";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <UIProvider>
            <WalletProvider>
              <DataProvider>{children}</DataProvider>
            </WalletProvider>
          </UIProvider>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
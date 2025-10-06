// "use client";
// import { AppProvider } from "@/context/AppContext";

// export default function Providers({ children }: { children: React.ReactNode }) {
//   return <AppProvider>{children}</AppProvider>;
// }

//app/provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { AppProvider } from '@/context/AppContext'
import { getConfig } from '@/lib/wagmi'

export function Providers(props: {
  children: ReactNode
  initialState?: State
}) {
  const [config] = useState(() => getConfig()) //Tạo config 1 lần duy nhất khi component mount.
  const [queryClient] = useState(() => new QueryClient()) //Dùng useState để tránh bị tạo lại khi re-render (giữ client stable).

  return (
	  //config: chính là wagmi config bạn định nghĩa (chain, connector, storage)

      <WagmiProvider config={config} initialState={props.initialState}>      

          <QueryClientProvider client={queryClient}>
              <AppProvider>{props.children}</AppProvider>
          </QueryClientProvider>

      </WagmiProvider>
 )
}

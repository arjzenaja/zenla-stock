'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

// Watcher: clear semua cache jika user ID berubah (ganti akun)
function SessionWatcher({ queryClient }: { queryClient: QueryClient }) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const prevUserId = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Kalau sebelumnya ada user dan sekarang user-nya beda → clear cache
    if (prevUserId.current !== undefined && prevUserId.current !== userId) {
      queryClient.clear()
    }
    prevUserId.current = userId
  }, [userId, queryClient])

  return null
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <SessionWatcher queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  )
}

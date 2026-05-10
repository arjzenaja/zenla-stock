import { useQuery } from '@tanstack/react-query'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats')
      if (!res.ok) throw new Error('Gagal mengambil data statistik')
      return res.json()
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/activity')
      if (!res.ok) throw new Error('Gagal mengambil data aktivitas')
      return res.json()
    },
    staleTime: 10_000,
  })
}

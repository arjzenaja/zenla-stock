import { useQuery } from '@tanstack/react-query'

export function useProducts(filters: { search?: string; categoryId?: string; page?: number; limit?: number }) {
  const queryParams = new URLSearchParams()
  if (filters.search) queryParams.set('search', filters.search)
  if (filters.categoryId && filters.categoryId !== 'all') queryParams.set('categoryId', filters.categoryId)
  if (filters.page) queryParams.set('page', filters.page.toString())
  if (filters.limit) queryParams.set('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryParams.toString()}`)
      if (!res.ok) throw new Error('Gagal mengambil data produk')
      return res.json()
    },
    staleTime: 30_000,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) throw new Error('Gagal mengambil data produk')
      return res.json()
    },
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Gagal mengambil data kategori')
      return res.json()
    }
  })
}

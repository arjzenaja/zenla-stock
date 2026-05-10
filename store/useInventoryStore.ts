import { create } from 'zustand'

interface InventoryState {
  searchQuery: string
  selectedCategoryId: string
  setSearch: (q: string) => void
  setCategory: (id: string) => void
  reset: () => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
  searchQuery: '',
  selectedCategoryId: 'all',
  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (id) => set({ selectedCategoryId: id }),
  reset: () => set({ searchQuery: '', selectedCategoryId: 'all' }),
}))

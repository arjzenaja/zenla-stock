import { create } from 'zustand'

// Deprecated in favor of server-side data fetching
interface StockState {
  // Empty
}

export const useStockStore = create<StockState>(() => ({
  // Empty
}))

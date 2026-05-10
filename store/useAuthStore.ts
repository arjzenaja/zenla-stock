import { create } from 'zustand'

// Deprecated in favor of NextAuth
interface AuthState {
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>(() => ({
  isAuthenticated: false,
}))

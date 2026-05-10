import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublic = ['/login', '/register'].some(p =>
        nextUrl.pathname.startsWith(p)
      )

      if (!isLoggedIn && !isPublic) {
        return false // Redirect to login
      }
      if (isLoggedIn && isPublic) {
        return Response.redirect(new URL('/', nextUrl))
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.plan = (user as any).plan || 'free'
        token.storeName = (user as any).storeName || null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = token.plan as string
        session.user.storeName = token.storeName as string
      }
      return session
    },
  },
  providers: [], // Empty array, we'll add them in lib/auth.ts
} satisfies NextAuthConfig

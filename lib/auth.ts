import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        
        if (!email || !password) return null

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          storeName: user.storeName
        }
      },
    }),
  ],
  callbacks: {
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
})

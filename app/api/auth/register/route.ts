import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const DEFAULT_CATEGORIES = [
  { name: 'General', slug: 'general', color: '#1A6B3C', description: 'General products' },
  { name: 'Electronics', slug: 'electronics', color: '#3B82F6', description: 'Electronic items' },
  { name: 'Food & Beverage', slug: 'food-beverage', color: '#F59E0B', description: 'Food and drink products' },
  { name: 'Clothing', slug: 'clothing', color: '#8B5CF6', description: 'Apparel and accessories' },
  { name: 'Others', slug: 'others', color: '#6B7280', description: 'Other products' },
]

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing email or password' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat user + kategori default dalam satu transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      // Auto-create kategori default untuk user baru
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          userId: newUser.id,
        }))
      })

      return newUser
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}


import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const DEFAULT_CATEGORIES = [
  { name: 'General', slug: 'general', color: '#1A6B3C', description: 'General products' },
  { name: 'Electronics', slug: 'electronics', color: '#3B82F6', description: 'Electronic items' },
  { name: 'Food & Beverage', slug: 'food-beverage', color: '#F59E0B', description: 'Food and drink products' },
  { name: 'Clothing', slug: 'clothing', color: '#8B5CF6', description: 'Apparel and accessories' },
  { name: 'Others', slug: 'others', color: '#6B7280', description: 'Other products' },
]

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    let categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Safety net: jika user belum punya kategori sama sekali, auto-seed kategori default
    if (categories.length === 0) {
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({ ...cat, userId })),
      })

      categories = await prisma.category.findMany({
        include: {
          _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
      })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('[CATEGORIES_GET]', error)
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, color, description } = body

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-')

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        color: color || '#1A6B3C',
        description,
        userId: session.user.id
      }
    })

    return NextResponse.json(category)
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { message: 'User not found in database. Please log out and register again.' },
        { status: 401 }
      )
    }
    console.error('[CATEGORIES_POST]', error)
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 })
  }
}



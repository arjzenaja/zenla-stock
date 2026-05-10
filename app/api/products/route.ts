import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      products,
      total: products.length,
      totalPages: 1,
      currentPage: 1
    })
  } catch (error) {
    console.error('[PRODUCTS_GET]', error)
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
    const { name, sku, categoryId, currentStock, reorderPoint, purchasePrice, sellingPrice, unit, image, supplier } = body

    if (!name || !sku || !categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const stockQuantity = Number(currentStock) || 0

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          sku,
          categoryId,
          currentStock: stockQuantity,
          reorderPoint: Number(reorderPoint) || 0,
          purchasePrice: Number(purchasePrice),
          sellingPrice: Number(sellingPrice),
          unit: unit || 'pcs',
          image: image || null,
          supplier: supplier || null,
          userId: session.user.id,
        }
      })

      if (stockQuantity > 0) {
        await tx.stockMovement.create({
          data: {
            productId: newProduct.id,
            type: 'stock_in',
            quantity: stockQuantity,
            reason: 'Initial Stock',
            stockBefore: 0,
            stockAfter: stockQuantity
          }
        })
      }

      return newProduct
    })

    return NextResponse.json(product)
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { message: 'User not found in database. Please log out and register again.' },
        { status: 401 }
      )
    }
    console.error('[PRODUCTS_POST]', error)
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 })
  }
}



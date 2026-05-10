import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { productId, quantity, reason } = body

    if (!productId || !quantity) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId }
      })

      if (!product) throw new Error('Product not found')

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            increment: Number(quantity)
          }
        }
      })

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type: 'stock_in',
          quantity: Number(quantity),
          reason: reason || 'Stock In',
          stockBefore: product.currentStock,
          stockAfter: product.currentStock + Number(quantity)
        }
      })

      return { product: updatedProduct, movement }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[STOCK_IN_POST]', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Error', { status: 500 })
  }
}

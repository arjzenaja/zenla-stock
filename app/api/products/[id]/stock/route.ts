import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { type, quantity, reason, additionalNotes } = body

    if (!type || !quantity || quantity <= 0) {
      return new NextResponse('Invalid request data', { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id, userId: session.user.id }
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    let newStock = product.currentStock
    if (type === 'stock_in') {
      newStock += quantity
    } else if (type === 'stock_out') {
      if (product.currentStock < quantity) {
        return NextResponse.json({ message: 'Stok tidak mencukupi' }, { status: 400 })
      }
      newStock -= quantity
    } else {
      return new NextResponse('Invalid movement type', { status: 400 })
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: product.id },
        data: { 
          currentStock: newStock,
          status: newStock > product.reorderPoint ? 'safe' : newStock > 0 ? 'low' : 'out_of_stock'
        }
      })

      await tx.stockMovement.create({
        data: {
          productId: product.id,
          type,
          quantity,
          reason: reason || (type === 'stock_in' ? 'Restock' : 'Stock Out'),
          performedBy: session.user?.name || 'Unknown',
          stockBefore: product.currentStock,
          stockAfter: newStock
        }
      })

      return updated
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('[STOCK_MOVEMENT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

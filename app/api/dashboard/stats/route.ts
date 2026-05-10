import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    const [totalProducts, allProducts] = await Promise.all([
      prisma.product.count({ where: { userId } }),
      prisma.product.findMany({
        where: { userId },
        select: {
          currentStock: true,
          reorderPoint: true
        }
      })
    ])

    const lowStockCount = allProducts.filter(p => p.currentStock <= p.reorderPoint).length

    // Mocking in/out today for now as we might not have a full sales/restock model yet
    // but pulling from stock movements if they exist
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stockMovements = await prisma.stockMovement.findMany({
      where: {
        timestamp: { gte: today }
      }
    })

    const inToday = stockMovements
      .filter(m => m.type === 'stock_in')
      .reduce((sum, m) => sum + m.quantity, 0)
    
    const outToday = Math.abs(stockMovements
      .filter(m => m.type === 'stock_out')
      .reduce((sum, m) => sum + m.quantity, 0))

    return NextResponse.json({
      totalProducts,
      lowStockCount,
      inToday,
      outToday
    })
  } catch (error) {
    console.error('[STATS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

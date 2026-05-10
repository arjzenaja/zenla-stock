import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    const products = await prisma.product.findMany({
      where: { userId }
    })

    const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0)
    const lowStockItems = products.filter(p => p.currentStock <= p.reorderPoint).length

    // turnoverRate and stockValueChange are complex to calculate without historical data
    // so we'll provide placeholders or simplified versions for now
    
    return NextResponse.json({
      totalStockValue,
      lowStockItems,
      turnoverRate: '0.0', // Requires historical sales data
      stockValueChange: 0.0
    })
  } catch (error) {
    console.error('[REPORTS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

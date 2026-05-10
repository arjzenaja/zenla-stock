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

    const activities = await prisma.stockMovement.findMany({
      where: {
        product: {
          userId: session.user.id
        }
      },
      include: {
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    })

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      productName: activity.product.name,
      type: activity.type,
      quantity: activity.quantity,
      detail: `${Math.abs(activity.quantity)} units • ${activity.reason || 'Manual Update'}`,
      timestamp: activity.timestamp
    }))

    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error('[ACTIVITY_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

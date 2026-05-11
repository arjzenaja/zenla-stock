import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, sku, categoryId, currentStock, reorderPoint, purchasePrice, sellingPrice, unit, image, supplier } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        sku,
        categoryId,
        currentStock: Number(currentStock) || 0,
        reorderPoint: Number(reorderPoint) || 0,
        purchasePrice: Number(purchasePrice) || 0,
        sellingPrice: Number(sellingPrice) || 0,
        unit,
        image: image || null,
        supplier: supplier || null,
      }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    console.error('[PRODUCT_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.product.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

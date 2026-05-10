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

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('[CATEGORY_GET]', error)
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
    const { name, color, description } = body

    const category = await prisma.category.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        name,
        color,
        description
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('[CATEGORY_PUT]', error)
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

    await prisma.category.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CATEGORY_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

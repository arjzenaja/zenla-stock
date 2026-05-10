import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Redirect to new endpoints or return combined data
  return NextResponse.json({
    message: 'Please use /api/dashboard/stats and /api/dashboard/activity instead'
  })
}

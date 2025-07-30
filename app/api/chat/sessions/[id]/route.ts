import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify session belongs to user and delete in one operation
    try {
      await prisma.chatSession.deleteMany({
        where: { 
          id: params.id, 
          userId: user.id 
        }
      })
      return NextResponse.json({ success: true })
    } catch (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Session not found or already deleted' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to delete chat session:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.chatSession.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Failed to fetch chat session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
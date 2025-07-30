import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, duration, startTime, endTime, subject, topic, subtopic } = body

    const timeEntry = await prisma.timeEntry.create({
      data: {
        taskId: taskId || null,
        userId: user.id,
        duration,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subject,
        topic,
        subtopic
      },
      include: {
        task: true
      }
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: { userId: user.id },
      include: {
        task: {
          select: {
            title: true,
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Create default user if not exists
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        name: 'Default User',
        email: 'user@example.com',
        password: 'defaultpassword',
        avatar: null
      }
    })

    return NextResponse.json({ user, message: 'Database initialized' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
}
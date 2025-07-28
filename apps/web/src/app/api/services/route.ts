import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

export async function GET() {
  // Temporarily return empty array for build testing
  return NextResponse.json([])
}

export async function POST() {
  // Temporarily return placeholder for build testing
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}

export async function PUT() {
  // Temporarily return placeholder for build testing
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}

export async function DELETE() {
  // Temporarily return placeholder for build testing
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
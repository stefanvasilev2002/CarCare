import { NextResponse } from 'next/server'

// Mock data for development (replace with Prisma when database is set up)
const mockVehicles = [
  {
    id: '1',
    userId: 'demo-user',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 45000,
    color: 'Blue',
    plateNumber: 'ABC-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    services: [],
    reminders: []
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Return mock data for demo
    return NextResponse.json(mockVehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, make, model, year, vin, mileage, color, plateNumber } = body

    if (!userId || !make || !model || !year || !mileage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create mock vehicle
    const newVehicle = {
      id: Date.now().toString(),
      userId,
      make,
      model,
      year: parseInt(year),
      vin,
      mileage: parseInt(mileage),
      color,
      plateNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      services: [],
      reminders: []
    }

    mockVehicles.push(newVehicle)
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
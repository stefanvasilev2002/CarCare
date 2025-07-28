import { NextResponse } from 'next/server'

// Mock data for development
const mockServices = [
  {
    id: '1',
    vehicleId: '1',
    userId: 'demo-user',
    type: 'OIL_CHANGE',
    description: 'Oil change with synthetic oil',
    cost: 65.99,
    mileage: 44500,
    serviceDate: new Date('2024-01-15'),
    provider: "Joe's Auto Shop",
    location: '123 Main St, City, State',
    photos: [],
    notes: 'Used full synthetic oil',
    createdAt: new Date(),
    updatedAt: new Date()
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
    return NextResponse.json(mockServices)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      userId,
      type,
      description,
      cost,
      mileage,
      serviceDate,
      provider,
      location,
      notes
    } = body

    if (!vehicleId || !userId || !type || !description || !cost || !mileage || !serviceDate || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create mock service
    const newService = {
      id: Date.now().toString(),
      vehicleId,
      userId,
      type,
      description,
      cost: parseFloat(cost),
      mileage: parseInt(mileage),
      serviceDate: new Date(serviceDate),
      provider,
      location,
      photos: [],
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockServices.push(newService)
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
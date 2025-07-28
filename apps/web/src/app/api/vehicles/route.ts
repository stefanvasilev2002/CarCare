import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: userId
      },
      include: {
        services: {
          orderBy: {
            serviceDate: 'desc'
          }
        },
        reminders: {
          where: {
            isCompleted: false
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, make, model, year, vin, mileage, color, plateNumber } = body

    if (!userId || !make || !model || !year || mileage === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        make,
        model,
        year: parseInt(year),
        vin: vin || null,
        mileage: parseInt(mileage),
        color: color || null,
        plateNumber: plateNumber || null,
      },
      include: {
        services: true,
        reminders: true
      }
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, userId, make, model, year, vin, mileage, color, plateNumber } = body

    if (!id || !userId) {
      return NextResponse.json({ error: 'Vehicle ID and User ID are required' }, { status: 400 })
    }

    // Verify the vehicle belongs to the user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const vehicle = await prisma.vehicle.update({
      where: {
        id: id
      },
      data: {
        make: make || existingVehicle.make,
        model: model || existingVehicle.model,
        year: year ? parseInt(year) : existingVehicle.year,
        vin: vin !== undefined ? vin : existingVehicle.vin,
        mileage: mileage !== undefined ? parseInt(mileage) : existingVehicle.mileage,
        color: color !== undefined ? color : existingVehicle.color,
        plateNumber: plateNumber !== undefined ? plateNumber : existingVehicle.plateNumber,
      },
      include: {
        services: true,
        reminders: true
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json({ error: 'Vehicle ID and User ID are required' }, { status: 400 })
    }

    // Verify the vehicle belongs to the user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    await prisma.vehicle.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
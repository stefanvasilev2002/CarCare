import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const vehicleId = searchParams.get('vehicleId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const whereClause: { userId: string; vehicleId?: string } = {
      userId: userId
    }

    if (vehicleId) {
      whereClause.vehicleId = vehicleId
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            plateNumber: true
          }
        }
      },
      orderBy: {
        serviceDate: 'desc'
      }
    })

    return NextResponse.json(services)
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

    if (!vehicleId || !userId || !type || !description || cost === undefined || mileage === undefined || !serviceDate || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the vehicle belongs to the user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: userId
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const service = await prisma.service.create({
      data: {
        vehicleId,
        userId,
        type,
        description,
        cost: parseFloat(cost),
        mileage: parseInt(mileage),
        serviceDate: new Date(serviceDate),
        provider,
        location: location || null,
        photos: null, // Will implement photo upload later
        notes: notes || null,
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            plateNumber: true
          }
        }
      }
    })

    // Update vehicle mileage if this service has higher mileage
    if (parseInt(mileage) > vehicle.mileage) {
      await prisma.vehicle.update({
        where: {
          id: vehicleId
        },
        data: {
          mileage: parseInt(mileage)
        }
      })
    }

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      userId,
      vehicleId,
      type,
      description,
      cost,
      mileage,
      serviceDate,
      provider,
      location,
      notes
    } = body

    if (!id || !userId) {
      return NextResponse.json({ error: 'Service ID and User ID are required' }, { status: 400 })
    }

    // Verify the service belongs to the user
    const existingService = await prisma.service.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const service = await prisma.service.update({
      where: {
        id: id
      },
      data: {
        vehicleId: vehicleId || existingService.vehicleId,
        type: type || existingService.type,
        description: description || existingService.description,
        cost: cost !== undefined ? parseFloat(cost) : existingService.cost,
        mileage: mileage !== undefined ? parseInt(mileage) : existingService.mileage,
        serviceDate: serviceDate ? new Date(serviceDate) : existingService.serviceDate,
        provider: provider || existingService.provider,
        location: location !== undefined ? location : existingService.location,
        notes: notes !== undefined ? notes : existingService.notes,
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            plateNumber: true
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json({ error: 'Service ID and User ID are required' }, { status: 400 })
    }

    // Verify the service belongs to the user
    const existingService = await prisma.service.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await prisma.service.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
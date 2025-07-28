import { prisma } from './prisma'

export async function seedDatabase(userId: string) {
  try {
    // Check if user already has data
    const existingVehicles = await prisma.vehicle.findMany({
      where: { userId }
    })

    if (existingVehicles.length > 0) {
      console.log('User already has vehicles, skipping seed')
      return
    }

    // Create sample vehicles
    const vehicle1 = await prisma.vehicle.create({
      data: {
        userId,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
        color: 'Blue',
        plateNumber: 'ABC-123',
        vin: '1N4AL3AP9DC123456'
      }
    })

    const vehicle2 = await prisma.vehicle.create({
      data: {
        userId,
        make: 'Honda',
        model: 'Civic',
        year: 2018,
        mileage: 62000,
        color: 'Red',
        plateNumber: 'XYZ-789',
        vin: '2HGFC2F59JH567890'
      }
    })

    // Create sample services for vehicle 1
    await prisma.service.create({
      data: {
        vehicleId: vehicle1.id,
        userId,
        type: 'OIL_CHANGE',
        description: 'Oil change with synthetic oil',
        cost: 65.99,
        mileage: 44500,
        serviceDate: new Date('2024-01-15'),
        provider: "Joe's Auto Shop",
        location: '123 Main St, City, State',
        notes: 'Used full synthetic oil'
      }
    })

    await prisma.service.create({
      data: {
        vehicleId: vehicle1.id,
        userId,
        type: 'TIRE_ROTATION',
        description: 'Tire rotation and balancing',
        cost: 45.00,
        mileage: 43000,
        serviceDate: new Date('2023-11-20'),
        provider: "Quick Tire",
        location: '456 Oak Ave, City, State',
        notes: 'All tires in good condition'
      }
    })

    await prisma.service.create({
      data: {
        vehicleId: vehicle1.id,
        userId,
        type: 'BRAKE_SERVICE',
        description: 'Front brake pad replacement',
        cost: 275.50,
        mileage: 42000,
        serviceDate: new Date('2023-09-10'),
        provider: "City Auto Repair",
        location: '789 Pine St, City, State',
        notes: 'Front pads were worn, rear still good'
      }
    })

    // Create sample services for vehicle 2
    await prisma.service.create({
      data: {
        vehicleId: vehicle2.id,
        userId,
        type: 'OIL_CHANGE',
        description: 'Regular oil change',
        cost: 45.99,
        mileage: 61500,
        serviceDate: new Date('2024-01-05'),
        provider: "Express Lube",
        location: '321 Elm St, City, State',
        notes: 'Conventional oil used'
      }
    })

    await prisma.service.create({
      data: {
        vehicleId: vehicle2.id,
        userId,
        type: 'INSPECTION',
        description: 'Annual state inspection',
        cost: 25.00,
        mileage: 60000,
        serviceDate: new Date('2023-12-01'),
        provider: "State Inspection Center",
        location: '654 Cherry Ln, City, State',
        notes: 'Passed inspection'
      }
    })

    // Create sample reminders
    await prisma.reminder.create({
      data: {
        vehicleId: vehicle1.id,
        type: 'OIL_CHANGE',
        description: 'Next oil change due',
        dueMileage: 48000,
        isCompleted: false
      }
    })

    await prisma.reminder.create({
      data: {
        vehicleId: vehicle1.id,
        type: 'INSPECTION',
        description: 'Annual inspection due',
        dueDate: new Date('2024-12-01'),
        isCompleted: false
      }
    })

    await prisma.reminder.create({
      data: {
        vehicleId: vehicle2.id,
        type: 'OIL_CHANGE',
        description: 'Oil change recommended',
        dueMileage: 65000,
        isCompleted: false
      }
    })

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}
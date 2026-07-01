import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    const distributor = await prisma.distributor.create({
      data: {
        name: 'Ravi Distributors',
        email: 'distributor@trackify.test',
        password: 'distributorpass',
        company: 'Ravi Supply Chain',
        phone: '+91-9876543210',
        address: 'Mumbai, India',
        status: 'active',
      },
    });
    console.log('Distributor seeded:', distributor.email);
  } catch (e) {
    console.error('Seed failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
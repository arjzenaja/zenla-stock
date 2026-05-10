import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@zenla.com' },
    update: {},
    create: {
      email: 'demo@zenla.com',
      name: 'Demo Owner',
      password: hashedPassword,
      storeName: 'Zenla Demo Store',
      categories: {
        create: [
          { name: 'Electronics', slug: 'electronics', color: '#3B82F6', icon: 'Cpu' },
          { name: 'Food', slug: 'food', color: '#10B981', icon: 'Coffee' },
          { name: 'Apparel', slug: 'apparel', color: '#8B5CF6', icon: 'Shirt' },
        ]
      }
    },
    include: { categories: true }
  })

  console.log('Seed completed: Created demo user and categories.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

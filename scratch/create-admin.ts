import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_CATEGORIES = [
  { name: 'General', slug: 'general', color: '#1A6B3C', description: 'General products' },
  { name: 'Electronics', slug: 'electronics', color: '#3B82F6', description: 'Electronic items' },
  { name: 'Food & Beverage', slug: 'food-beverage', color: '#F59E0B', description: 'Food and drink products' },
  { name: 'Clothing', slug: 'clothing', color: '#8B5CF6', description: 'Apparel and accessories' },
  { name: 'Others', slug: 'others', color: '#6B7280', description: 'Other products' },
]

async function main() {
  const email = 'zenlaadmin123@gmail.com'
  const password = 'password123'
  const name = 'Zenla Admin'

  console.log(`Checking user: ${email}...`)
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log(`User ${email} already exists.`)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        storeName: 'Zenla Stock',
        ownerName: 'Admin',
        plan: 'free'
      }
    })

    await tx.category.createMany({
      data: DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        userId: newUser.id,
      }))
    })

    return newUser
  })

  console.log(`User ${email} created successfully with password: ${password}`)
}

main()
  .catch((e) => {
    console.error('Error creating user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

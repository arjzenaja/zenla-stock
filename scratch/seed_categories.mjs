import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_CATEGORIES = [
  { name: 'General', slug: 'general', color: '#1A6B3C', description: 'General products' },
  { name: 'Electronics', slug: 'electronics', color: '#3B82F6', description: 'Electronic items' },
  { name: 'Food & Beverage', slug: 'food-beverage', color: '#F59E0B', description: 'Food and drink products' },
  { name: 'Clothing', slug: 'clothing', color: '#8B5CF6', description: 'Apparel and accessories' },
  { name: 'Others', slug: 'others', color: '#6B7280', description: 'Other products' },
]

async function main() {
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    const count = await prisma.category.count({ where: { userId: user.id } })
    if (count === 0) {
      console.log(`Seeding categories for user: ${user.email}`)
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({ ...cat, userId: user.id }))
      })
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

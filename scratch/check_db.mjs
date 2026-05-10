import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true }
})
console.log('=== USERS ===')
console.table(users)

const products = await prisma.product.findMany({
  select: { id: true, name: true, userId: true, categoryId: true }
})
console.log('\n=== PRODUCTS ===')
console.table(products)

const categories = await prisma.category.findMany({
  select: { id: true, name: true, userId: true }
})
console.log('\n=== CATEGORIES ===')
console.table(categories)

await prisma.$disconnect()

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: 'You must accept the Terms of Service',
  }),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const addProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Please select a category'),
  supplier: z.string().optional(),
  purchasePrice: z.number().min(0, 'Price cannot be negative'),
  sellingPrice: z.number().min(0, 'Price cannot be negative'),
  initialStock: z.number().int().min(0, 'Stock cannot be negative'),
  unit: z.string().min(1, 'Please select a unit'),
  image: z.string().optional(),
})

export type AddProductFormValues = z.infer<typeof addProductSchema>

export const stockInSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  referenceNote: z.string().optional(),
})

export type StockInFormValues = z.infer<typeof stockInSchema>

export const stockOutSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.enum(['customer_sale', 'damage', 'internal_use', 'return', 'other']),
  additionalNotes: z.string().optional(),
})

export type StockOutFormValues = z.infer<typeof stockOutSchema>

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna tidak valid'),
  icon: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

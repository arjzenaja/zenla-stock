'use client'

import React from 'react'
import { EditProductForm } from '@/components/forms/EditProductForm'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProduct } from '@/hooks/useProducts'

export default function EditProductPage() {
  const { id } = useParams()
  const { data: product, isLoading } = useProduct(id as string)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
        <p className="text-slate-500">Loading produk...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Produk tidak ditemukan</h2>
        <Link href="/inventory" className="text-brand hover:underline mt-4 inline-block">Kembali ke Inventaris</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href={`/inventory/${id}`} className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Product
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Product</h1>
        <p className="text-sm text-slate-500">Update item details in your inventory system.</p>
      </div>

      <EditProductForm product={product} />
    </div>
  )
}

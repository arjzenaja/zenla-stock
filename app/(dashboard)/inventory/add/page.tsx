import React from 'react'
import { AddProductForm } from '@/components/forms/AddProductForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/inventory" className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
        <p className="text-sm text-slate-500">Register a new item in your inventory system.</p>
      </div>

      <AddProductForm />
    </div>
  )
}

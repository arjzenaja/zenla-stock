'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { CategoryModal } from '@/components/categories/CategoryModal'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Gagal mengambil data kategori')
      return res.json()
    }
  })

  const openAddModal = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const openEditModal = (category: any) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
        <p className="text-slate-500">Memuat kategori...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Kategori</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola kategori produk untuk pengorganisasian yang lebih baik.</p>
        </div>
        <Button onClick={openAddModal} className="bg-brand hover:bg-brand-light text-white rounded-xl h-11 px-6 shadow-lg shadow-brand/10">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {categories?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 flex flex-col items-center text-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-6">
            <Tag className="w-8 h-8 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada kategori</h3>
          <p className="text-slate-500 max-w-xs mb-8">Buat kategori pertama Anda untuk mulai mengatur produk inventaris Anda.</p>
          <Button onClick={openAddModal} variant="outline" className="border-brand text-brand hover:bg-brand-bg rounded-xl px-8">
            Buat Kategori Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category: any) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onEdit={() => openEditModal(category)}
            />
          ))}
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCategory}
      />
    </div>
  )
}

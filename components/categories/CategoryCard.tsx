'use client'

import React from 'react'
import { MoreVertical, Edit2, Trash2, Tag } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CategoryCardProps {
  category: any
  onEdit: () => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal menghapus kategori')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Kategori berhasil dihapus')
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const productCount = category._count?.products || 0
  const progressValue = Math.min((productCount / 50) * 100, 100) // Dummy logic: target 50 products per category

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-md transition-all animate-fade-in group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{category.name}</h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-card-md">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2 py-2.5">
              <Edit2 className="w-4 h-4" />
              <span>Edit Kategori</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer gap-2 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Kategori</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 h-10 overflow-hidden">
        <p className="text-xs text-slate-500 line-clamp-2">
          {category.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{productCount} Produk</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(progressValue)}%</span>
      </div>
      
      <Progress 
        value={progressValue} 
        className="h-1.5 bg-slate-100 rounded-full"
        indicatorClassName="transition-all duration-500"
        style={{ '--progress-color': category.color } as any}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {productCount > 0 
                ? `Tidak bisa dihapus — ${productCount} produk masih menggunakan kategori ini. Silakan pindahkan produk ke kategori lain terlebih dahulu.`
                : `Apakah Anda yakin ingin menghapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200">Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={productCount > 0 || deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault()
                deleteMutation.mutate()
              }}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

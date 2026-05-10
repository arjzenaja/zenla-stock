'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, CategoryFormValues } from '@/lib/validations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  Package, Cpu, Shirt, ShoppingBag, 
  Coffee, Laptop, Smartphone, Home, 
  Watch, Book, Gift, Scissors, 
  Check, Loader2 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

const PRESET_COLORS = [
  '#1A6B3C', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899', '#EAB308',
  '#14B8A6', '#06B6D4', '#6366F1', '#F43F5E', '#84CC16', '#6B7280'
]

const ICONS = [
  { id: 'Package', icon: Package },
  { id: 'Cpu', icon: Cpu },
  { id: 'Shirt', icon: Shirt },
  { id: 'ShoppingBag', icon: ShoppingBag },
  { id: 'Coffee', icon: Coffee },
  { id: 'Laptop', icon: Laptop },
  { id: 'Smartphone', icon: Smartphone },
  { id: 'Home', icon: Home },
  { id: 'Watch', icon: Watch },
  { id: 'Book', icon: Book },
  { id: 'Gift', icon: Gift },
  { id: 'Scissors', icon: Scissors },
]

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, initialData }) => {
  const queryClient = useQueryClient()
  const isEditing = !!initialData

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#1A6B3C',
      icon: 'Package',
    }
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        color: initialData.color,
        icon: initialData.icon || 'Package',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        color: '#1A6B3C',
        icon: 'Package',
      })
    }
  }, [initialData, form, isOpen])

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const url = isEditing ? `/api/categories/${initialData.id}` : '/api/categories'
      const method = isEditing ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal menyimpan kategori')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(isEditing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil dibuat')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const onSubmit = (values: CategoryFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Nama Kategori</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Elektronik" 
                      className="h-12 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Penjelasan singkat kategori ini..." 
                      className="bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-brand min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Pilih Warna</FormLabel>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => form.setValue('color', color)}
                    className={cn(
                      "h-8 w-full rounded-lg transition-all border-2 border-transparent relative",
                      form.watch('color') === color && "scale-110 border-white shadow-md ring-2 ring-slate-200"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {form.watch('color') === color && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-xl border border-slate-100 shrink-0" style={{ backgroundColor: form.watch('color') }} />
                <Input 
                  value={form.watch('color')}
                  onChange={(e) => form.setValue('color', e.target.value)}
                  className="h-10 bg-slate-50 border-slate-100 rounded-xl text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Pilih Icon</FormLabel>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => form.setValue('icon', id)}
                    className={cn(
                      "h-10 w-full rounded-xl transition-all border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50",
                      form.watch('icon') === id && "bg-brand-bg border-brand text-brand shadow-sm"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-12 rounded-xl text-slate-500 hover:bg-slate-50"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="flex-[2] h-12 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/10"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>MENYIMPAN...</span>
                  </div>
                ) : (
                  <span>{isEditing ? 'SIMPAN PERUBAHAN' : 'BUAT KATEGORI'}</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

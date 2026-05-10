'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProductSchema, AddProductFormValues } from '@/lib/validations'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Camera, X, Banknote, Package, Loader2 } from 'lucide-react'
import { useCategories } from '@/hooks/useProducts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface EditProductFormProps {
  product: any
}

function resizeImage(file: File, maxSize = 600): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: product?.name || '',
      category: product?.categoryId || '',
      supplier: product?.supplier || '',
      purchasePrice: product?.purchasePrice || 0,
      sellingPrice: product?.sellingPrice || 0,
      initialStock: product?.currentStock || 0,
      unit: product?.unit || 'pcs',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: AddProductFormValues) => {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          sku: product.sku,
          categoryId: values.category,
          currentStock: values.initialStock,
          image: imagePreview,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal mengubah produk')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', product.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      toast.success('Produk berhasil diubah!')
      router.push(`/inventory/${product.id}`)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const onSubmit = (data: AddProductFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-slate-900">Informasi Dasar</h3>
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Nama Produk</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Zenith Smart Watch" 
                      className="h-12 bg-slate-50 border-slate-100 focus-visible:ring-brand rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-100 focus:ring-brand rounded-xl">
                          <SelectValue placeholder={categoriesLoading ? "Memuat kategori..." : "Pilih kategori"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100">
                        {categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Supplier (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Zenith Global Ltd." 
                        className="h-12 bg-slate-50 border-slate-100 focus-visible:ring-brand rounded-xl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <Banknote className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-slate-900">Harga</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Harga Beli</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                      <Input 
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 bg-slate-50 border-slate-100 focus-visible:ring-brand rounded-xl font-mono"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Harga Jual</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                      <Input 
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 bg-slate-50 border-slate-100 focus-visible:ring-brand rounded-xl font-mono"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Inventory Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-slate-900">Stok</h3>
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="initialStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Stok</FormLabel>
                  <FormControl>
                    <QuantityStepper 
                      value={field.value} 
                      onChange={field.onChange}
                      className="bg-slate-50 border-slate-100"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Satuan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-100 focus:ring-brand rounded-xl">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="liters">Liters (l)</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-50">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-brand transition-colors cursor-pointer group relative overflow-hidden">
            {imagePreview ? (
              <div className="relative w-full aspect-video">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                <button 
                  type="button" 
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-brand" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Upload Foto Produk</h4>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const resized = await resizeImage(file)
                      setImagePreview(resized)
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 h-14 text-slate-500 font-bold rounded-xl"
          >
            BATAL
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="flex-[2] h-14 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all"
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>MENYIMPAN...</span>
              </div>
            ) : (
               <span>SIMPAN PERUBAHAN</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

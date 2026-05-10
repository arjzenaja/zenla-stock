'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stockInSchema, StockInFormValues } from '@/lib/validations'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { useInventoryStore } from '@/store/useInventoryStore'
import { useStockStore } from '@/store/useStockStore'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShieldCheck, Info, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Product } from '@/types/models'

export const StockInForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: productsData, isLoading: productsLoading } = useProducts({})
  const products = productsData?.products || []
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<StockInFormValues>({
    resolver: zodResolver(stockInSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      referenceNote: '',
    },
  })

  const selectedProductId = form.watch('productId')
  const selectedProduct = (products as Product[]).find((p: Product) => p.id === selectedProductId)

  const onSubmit = async (data: StockInFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stock/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update stock')
      }

      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['product', data.productId] })

      toast.success('Stock updated successfully!')
      router.push('/inventory')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update stock.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-slate-50 space-y-6">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Select Product</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-[#F5FAF7] border-[#C8E6D4] focus:ring-brand rounded-xl">
                      <SelectValue placeholder={productsLoading ? "Loading products..." : "Choose an existing product..."} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-100">
                    {products.map((p: Product) => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {selectedProduct && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Balance</p>
                <p className="text-lg font-bold text-slate-900">{selectedProduct.currentStock} {selectedProduct.unit}</p>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Quantity</FormLabel>
                <FormControl>
                  <QuantityStepper 
                    value={field.value} 
                    onChange={field.onChange}
                    min={1}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Reference Note</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add details about this shipment..." 
                    className="bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand rounded-xl min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-brand-muted border border-brand-border rounded-2xl p-5 flex gap-4">
          <ShieldCheck className="w-6 h-6 text-brand shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-brand">Inventory Validation</h4>
            <p className="text-xs text-brand-light leading-relaxed">
              Submitting this form will immediately update the global stock levels. This action will be logged in the system audit trail.
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || productsLoading}
          className="w-full h-14 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PROCESSING...</span>
            </div>
          ) : 'CONFIRM STOCK IN'}
        </Button>
      </form>
    </Form>
  )
}

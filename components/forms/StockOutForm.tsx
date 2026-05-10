'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stockOutSchema, StockOutFormValues } from '@/lib/validations'
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
import { AlertTriangle, TrendingDown, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Product } from '@/types/models'

export const StockOutForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: productsData, isLoading: productsLoading } = useProducts({})
  const products = productsData?.products || []
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<StockOutFormValues>({
    resolver: zodResolver(stockOutSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      reason: 'customer_sale',
      additionalNotes: '',
    },
  })

  const selectedProductId = form.watch('productId')
  const quantity = form.watch('quantity')
  const selectedProduct = (products as Product[]).find((p: Product) => p.id === selectedProductId)
  const insufficientStock = selectedProduct ? quantity > selectedProduct.currentStock : false

  const onSubmit = async (data: StockOutFormValues) => {
    if (insufficientStock) {
      toast.error('Insufficient stock available!')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/stock/out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to process request')
      }

      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['product', data.productId] })
      
      toast.success('Stock removed successfully!')
      router.push('/inventory')
    } catch (err: any) {
      toast.error(err.message || 'Failed to process request.')
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
            <div className={`rounded-xl p-4 flex items-center gap-3 animate-fade-in transition-colors ${insufficientStock ? 'bg-red-50 border border-red-100' : 'bg-slate-50 border border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${insufficientStock ? 'bg-white text-red-500' : 'bg-white text-slate-400'}`}>
                {insufficientStock ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                <p className={`text-lg font-bold ${insufficientStock ? 'text-red-600' : 'text-slate-900'}`}>{selectedProduct.currentStock} {selectedProduct.unit}</p>
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
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Reason for Stock Out</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-[#F5FAF7] border-[#C8E6D4] focus:ring-brand rounded-xl">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="customer_sale">Customer Sale</SelectItem>
                    <SelectItem value="damage">Damage / Waste</SelectItem>
                    <SelectItem value="internal_use">Internal Use</SelectItem>
                    <SelectItem value="return">Return to Supplier</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-widest text-slate-400 uppercase">Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide context for this adjustment..." 
                    className="bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand rounded-xl min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || productsLoading || insufficientStock}
          variant={insufficientStock ? 'secondary' : 'default'}
          className={`w-full h-14 font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all ${insufficientStock ? '' : 'bg-brand hover:bg-brand-light text-white shadow-brand/20'}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PROCESSING...</span>
            </div>
          ) : insufficientStock ? 'INSUFFICIENT STOCK' : 'CONFIRM STOCK OUT'}
        </Button>
      </form>
    </Form>
  )
}

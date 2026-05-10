'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface StockMovementModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  type: 'stock_in' | 'stock_out'
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({ isOpen, onClose, product, type }) => {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState(type === 'stock_out' ? 'customer_sale' : 'Restock')
  const queryClient = useQueryClient()

  const isStockIn = type === 'stock_in'

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, quantity, reason })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal mengubah stok')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', product.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      toast.success(isStockIn ? 'Stok berhasil ditambahkan!' : 'Stok berhasil dikurangi!')
      onClose()
      setQuantity(1)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-black text-slate-900">
            {isStockIn ? 'Stock In' : 'Stock Out'}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {isStockIn 
              ? `Tambah stok untuk ${product?.name}.` 
              : `Kurangi stok untuk ${product?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">Kuantitas</label>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-l-xl rounded-r-none border-r-0 h-12 w-12"
              >
                -
              </Button>
              <Input 
                type="number" 
                min={1} 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-12 rounded-none text-center font-mono focus-visible:ring-0 border-slate-200"
              />
              <Button 
                variant="outline" 
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-r-xl rounded-l-none border-l-0 h-12 w-12"
              >
                +
              </Button>
            </div>
            {!isStockIn && (
              <p className="text-xs text-slate-400 mt-2">Current stock: <span className="font-bold text-slate-900">{product?.currentStock}</span></p>
            )}
          </div>

          {!isStockIn && (
            <div>
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">Alasan</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-12 rounded-xl focus:ring-brand">
                  <SelectValue placeholder="Pilih alasan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="customer_sale">Penjualan</SelectItem>
                  <SelectItem value="damage">Barang Rusak</SelectItem>
                  <SelectItem value="internal_use">Penggunaan Internal</SelectItem>
                  <SelectItem value="return">Retur ke Supplier</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isStockIn && (
            <div>
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">Catatan / Referensi</label>
              <Input 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="e.g. PO-2026-001"
                className="h-12 rounded-xl focus-visible:ring-brand"
              />
            </div>
          )}

          <Button 
            onClick={() => mutation.mutate()} 
            disabled={mutation.isPending || (!isStockIn && quantity > (product?.currentStock || 0))}
            className="w-full h-14 mt-4 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all"
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'SIMPAN PERUBAHAN'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

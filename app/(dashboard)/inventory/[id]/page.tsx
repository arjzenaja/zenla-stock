'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Pencil, 
  Trash2, 
  Package, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Truck,
  History,
  ShieldCheck,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StockStatusBadge } from '@/components/inventory/StockStatusBadge'
import { MovementHistoryList } from '@/components/inventory/MovementHistoryList'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { InfoRow } from '@/components/shared/InfoRow'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { useProduct } from '@/hooks/useProducts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: product, isLoading } = useProduct(id as string)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Gagal menghapus produk')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produk berhasil dihapus.')
      router.push('/inventory')
    },
    onError: () => {
      toast.error('Gagal menghapus produk. Silakan coba lagi.')
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
        <p className="text-slate-500">Loading detail produk...</p>
      </div>
    )
  }

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-slate-900">Produk tidak ditemukan</h2>
      <Link href="/inventory" className="text-brand hover:underline mt-4 inline-block">Kembali ke Inventaris</Link>
    </div>
  )

  const movements = product.stockMovements || []

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500 animate-fade-in">
        <Link href="/inventory" className="hover:text-brand flex items-center gap-1 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-1 space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-slate-50 aspect-square relative group">
            <div className="absolute top-4 left-4 z-10">
              <StockStatusBadge status={product.status} currentStock={product.currentStock} reorderPoint={product.reorderPoint} className="shadow-lg" />
            </div>
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <Package className="w-20 h-20 text-slate-200" />
              </div>
            )}
          </div>

          <div className="bg-brand-muted/40 border border-brand-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-brand" />
              <h3 className="text-xs font-bold text-brand uppercase tracking-widest">Supplier Info</h3>
            </div>
            <p className="text-lg font-bold text-slate-900">{product.supplier || 'Not specified'}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>Lead time: {product.supplierLeadTime || 0} days</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in [animation-delay:100ms]">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand uppercase tracking-[0.2em] pt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.category?.color || '#ccc' }} />
              <span>{product.category?.name || 'Uncategorized'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Stock Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
              <p className="text-2xl font-black text-brand font-mono">{product.currentStock} {product.unit}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reorder Point</p>
              <p className="text-2xl font-black text-slate-900 font-mono">{product.reorderPoint} {product.unit}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/inventory/${product.id}/edit`} className="flex-1">
              <Button className="w-full h-14 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            </Link>
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="flex-1 h-14 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </Button>
              }
              title="Delete Product?"
              description="This action cannot be undone. All stock history for this product will be permanently removed from our servers."
              confirmLabel="Delete Permanently"
              variant="destructive"
              onConfirm={() => deleteMutation.mutate()}
            />
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-50 space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-brand" />
              <h3 className="font-bold text-slate-900">Stock Health & Value</h3>
            </div>
            <InfoRow label="Status" value={<StockStatusBadge status={product.status} currentStock={product.currentStock} reorderPoint={product.reorderPoint} />} />
            <InfoRow label="Stock Health" value={<Badge variant="outline" className="bg-brand-muted/30 text-brand border-brand/20 uppercase font-bold text-[10px]">{product.stockHealth || 'Unknown'}</Badge>} />
            <InfoRow label="Last Audited" value={product.lastAudited ? formatDate(product.lastAudited) : 'Never'} />
            <InfoRow label="Total Asset Value" value={formatCurrency(product.currentStock * product.sellingPrice)} valueBold />
            <InfoRow label="Purchase Price" value={formatCurrency(product.purchasePrice)} />
            <InfoRow label="Selling Price" value={formatCurrency(product.sellingPrice)} />
          </div>

          {/* Movement History */}
          <div className="space-y-4 pt-4">
            <SectionHeader 
              title="Movement History" 
              actionLabel="View All" 
              actionHref="/reports" 
            />
            <div className="bg-white rounded-2xl shadow-card p-2 border border-slate-50 min-h-[200px] flex flex-col">
              {movements.length > 0 ? (
                <MovementHistoryList movements={movements} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <History className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-slate-400 text-sm">No history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { X, Package, Tag, TrendingUp, TrendingDown, BarChart2, Hash, Layers } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StockStatusBadge } from './StockStatusBadge'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface ProductPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  product: any | null
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null

  const margin = product.sellingPrice && product.purchasePrice
    ? (((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100).toFixed(1)
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-brand/10 to-brand/5 px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-md bg-slate-50">
                <AvatarImage src={product.image} className="object-cover" />
                <AvatarFallback className="text-lg font-bold text-brand bg-brand-muted">
                  {product.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900 leading-tight">{product.name}</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono mt-0.5">
                  SKU: {product.sku}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.category?.color || '#cbd5e1' }} />
                  <span className="text-xs text-slate-500 font-medium">{product.category?.name || 'Uncategorized'}</span>
                </div>
              </div>

              <div className="shrink-0">
                <StockStatusBadge
                  status={product.status}
                  currentStock={product.currentStock}
                  reorderPoint={product.reorderPoint}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 p-5">
            {/* Current Stock */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stok</span>
              </div>
              <p className="text-xl font-bold text-slate-900 font-mono">{product.currentStock}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{product.unit}</p>
            </div>

            {/* Reorder Point */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Min. Stok</span>
              </div>
              <p className="text-xl font-bold text-slate-900 font-mono">{product.reorderPoint}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{product.unit}</p>
            </div>

            {/* Selling Price */}
            <div className="bg-brand/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-brand/15 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 text-brand" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Harga Jual</span>
              </div>
              <p className="text-lg font-bold text-brand font-mono leading-tight">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>

            {/* Cost Price */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-slate-200 rounded-lg">
                  <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Harga Beli</span>
              </div>
              <p className="text-lg font-bold text-slate-700 font-mono leading-tight">
                {product.purchasePrice ? formatCurrency(product.purchasePrice) : '—'}
              </p>
            </div>
          </div>

          {/* Extra Info */}
          <div className="px-5 pb-4 space-y-2">
            {product.description && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{product.description}</p>
              </div>
            )}

            {margin && (
              <div className="flex items-center justify-between bg-green-50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-semibold text-green-700">Margin Keuntungan</span>
                </div>
                <span className="text-sm font-bold text-green-600 font-mono">{margin}%</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <Link
              href={`/inventory/${product.id}`}
              onClick={onClose}
              className="flex items-center justify-center w-full py-3 bg-brand text-white text-sm font-semibold rounded-2xl hover:bg-brand/90 transition-colors gap-2"
            >
              <Package className="w-4 h-4" />
              Lihat Detail Lengkap
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

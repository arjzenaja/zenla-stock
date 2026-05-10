'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StockStatusBadge } from './StockStatusBadge'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface ProductCardProps {
  product: any
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/inventory/${product.id}`} className="block animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card p-4 border border-slate-50 flex items-center gap-4 hover:shadow-card-md active:scale-[0.98] transition-all">
        <Avatar className="w-16 h-16 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
          <AvatarImage src={product.image} className="object-cover" />
          <AvatarFallback className="text-sm font-bold text-brand bg-brand-muted">
            {product.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{product.name}</h3>
            <StockStatusBadge status={product.status} currentStock={product.currentStock} reorderPoint={product.reorderPoint} className="scale-90 origin-right" />
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.category?.color || '#cbd5e1' }} />
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
              {product.category?.name || 'Uncategorized'} • <span className="font-mono">{product.sku}</span>
            </p>
          </div>
          
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Stok</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{product.currentStock} {product.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Harga</p>
              <p className="text-sm font-bold text-brand font-mono">{formatCurrency(product.sellingPrice)}</p>
            </div>
          </div>
        </div>
        
        <div className="text-slate-300 ml-1">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}

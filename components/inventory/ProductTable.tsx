'use client'

import React from 'react'
import { 
  MoreVertical, 
  Pencil, 
  Plus, 
  Minus, 
  Trash2,
  ExternalLink,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { StockMovementModal } from './StockMovementModal'
import { ProductPreviewModal } from './ProductPreviewModal'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StockStatusBadge } from './StockStatusBadge'
import { formatCurrency } from '@/lib/utils'

interface ProductTableProps {
  products: any[]
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [movementModal, setMovementModal] = useState<{ isOpen: boolean; type: 'stock_in' | 'stock_out'; product: any | null }>({
    isOpen: false,
    type: 'stock_in',
    product: null
  })

  const [previewProduct, setPreviewProduct] = useState<any | null>(null)

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4 pl-6">Product</TableHead>
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4">Category</TableHead>
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4 text-center">Stock Level</TableHead>
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4">Unit Price</TableHead>
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4 text-center">Status</TableHead>
            <TableHead className="text-2xs font-bold tracking-wider uppercase text-slate-400 py-4 pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
              <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                    <AvatarImage src={product.image} className="object-cover" />
                    <AvatarFallback className="text-xs font-bold text-brand bg-brand-muted">
                      {product.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono">SKU: {product.sku}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.category?.color || '#cbd5e1' }} />
                  <span className="text-xs font-medium text-slate-600">{product.category?.name || 'Uncategorized'}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-900 font-mono">{product.currentStock} {product.unit}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Min: {product.reorderPoint}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-bold text-slate-900 font-mono">{formatCurrency(product.sellingPrice)}</TableCell>
              <TableCell className="text-center">
                <StockStatusBadge status={product.status} currentStock={product.currentStock} reorderPoint={product.reorderPoint} />
              </TableCell>
              <TableCell className="py-4 pr-6 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-brand hover:bg-brand-muted rounded-xl transition-all"
                    onClick={() => setPreviewProduct(product)}
                    title="Lihat Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-brand hover:bg-brand-muted rounded-xl transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 shadow-xl border-slate-100">
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer focus:bg-brand-muted focus:text-brand">
                      <Link href={`/inventory/${product.id}`} className="flex items-center w-full">
                        <ExternalLink className="mr-3 h-4 w-4" />
                        <span className="font-medium text-sm">Lihat Detail</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer focus:bg-brand-muted focus:text-brand">
                      <Link href={`/inventory/${product.id}/edit`} className="flex items-center w-full">
                        <Pencil className="mr-3 h-4 w-4" />
                        <span className="font-medium text-sm">Edit Produk</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setMovementModal({ isOpen: true, type: 'stock_in', product })}
                      className="rounded-xl py-2.5 cursor-pointer focus:bg-brand-muted focus:text-brand"
                    >
                      <Plus className="mr-3 h-4 w-4" />
                      <span className="font-medium text-sm">Stock In</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setMovementModal({ isOpen: true, type: 'stock_out', product })}
                      className="rounded-xl py-2.5 cursor-pointer focus:bg-brand-muted focus:text-brand"
                    >
                      <Minus className="mr-3 h-4 w-4" />
                      <span className="font-medium text-sm">Stock Out</span>
                    </DropdownMenuItem>
                    <div className="my-1 border-t border-slate-100" />
                    <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500">
                      <Trash2 className="mr-3 h-4 w-4" />
                      <span className="font-medium text-sm">Hapus</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {movementModal.product && (
        <StockMovementModal 
          isOpen={movementModal.isOpen} 
          onClose={() => setMovementModal({ ...movementModal, isOpen: false })} 
          product={movementModal.product} 
          type={movementModal.type} 
        />
      )}

      <ProductPreviewModal
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        product={previewProduct}
      />
    </div>
  )
}

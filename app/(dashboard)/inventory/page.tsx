'use client'

import React, { useState } from 'react'
import { Plus, PackageSearch, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/inventory/SearchBar'
import { CategoryTabs } from '@/components/inventory/CategoryTabs'
import { ProductTable } from '@/components/inventory/ProductTable'
import { ProductCard } from '@/components/inventory/ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [page, setPage] = useState(1)
  
  const isMobile = useIsMobile()
  const { data, isLoading } = useProducts({ search, categoryId, page })

  const products = data?.products || []
  const total = data?.total || 0

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Inventory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track your products across all categories.</p>
        </div>
        <Link href="/inventory/add">
          <Button className="bg-brand hover:bg-brand-light text-white rounded-xl h-11 px-6 shadow-lg shadow-brand/20 hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4 animate-fade-in [animation-delay:100ms]">
        <SearchBar 
          placeholder="Search inventory by name or SKU..." 
          onSearch={(val) => { setSearch(val); setPage(1); }} 
        />
        <CategoryTabs 
          activeCategoryId={categoryId} 
          onSelect={(id) => { setCategoryId(id); setPage(1); }} 
        />
      </div>

      {/* Product List */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
            <p className="text-slate-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="animate-fade-in [animation-delay:200ms]">
            {isMobile ? (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ProductTable products={products} />
            )}
            
            <div className="flex items-center justify-between pt-8 text-slate-500 text-sm">
              <p>Showing {products.length} of {total} products</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl h-9"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl h-9"
                  disabled={page >= (data?.totalPages || 1)}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-slate-50 py-20 animate-fade-in">
            <EmptyState 
              icon={PackageSearch}
              title="No products found"
              description={search 
                ? `We couldn't find anything matching "${search}" in this category.`
                : "Your inventory is currently empty. Start by adding your first product."}
              ctaLabel={!search ? "Add Product" : "Clear Search"}
              onCta={() => {
                if (!search) {
                  // Direct to add product
                } else {
                  setSearch('')
                  setCategoryId('all')
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <Link href="/inventory/add" className="fixed bottom-6 right-6 sm:hidden z-40">
        <Button size="icon" className="h-14 w-14 rounded-full bg-brand hover:bg-brand-light shadow-2xl shadow-brand/40 text-white">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  )
}

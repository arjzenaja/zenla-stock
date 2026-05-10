import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#F0F7F2]/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-50 flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-muted rounded-full"></div>
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-sm font-black text-brand uppercase tracking-[0.3em] animate-pulse">Syncing Inventory</p>
      </div>
    </div>
  )
}

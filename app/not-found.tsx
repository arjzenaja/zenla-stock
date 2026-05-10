import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0F7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-card-md border border-slate-50 max-w-md w-full animate-fade-in">
        <div className="w-20 h-20 bg-brand-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-brand" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">404 - Lost in Inventory</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another warehouse.
        </p>
        <Link href="/">
          <Button className="w-full h-12 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20">
            RETURN TO DASHBOARD
          </Button>
        </Link>
      </div>
    </div>
  )
}

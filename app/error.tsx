'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F0F7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-card-md border border-slate-50 max-w-md w-full animate-fade-in">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">System Glitch</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Something went wrong while processing your request. Our technical team has been notified.
        </p>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full h-12 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            TRY AGAIN
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="w-full h-12 text-slate-400 font-bold hover:text-brand"
          >
            RETURN TO SAFETY
          </Button>
        </div>
      </div>
    </div>
  )
}

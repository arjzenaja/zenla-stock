import React from 'react'
import { CriticalAlert } from '@/types/models'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface CriticalAlertCardProps {
  alerts: CriticalAlert[]
}

export const CriticalAlertCard: React.FC<CriticalAlertCardProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 border border-slate-50">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-slate-900">Critical Alerts</h3>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100 group transition-all hover:bg-red-100/50">
            <Avatar className="w-10 h-10 rounded-lg border border-red-200">
              <AvatarImage src={alert.imageUrl} className="object-cover" />
              <AvatarFallback className="bg-red-200 text-red-600 text-xs font-bold">
                {alert.productName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{alert.productName}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{alert.sku}</p>
            </div>
            
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-sm font-bold text-red-600">{alert.stockLeft} left</span>
              <Badge variant="destructive" className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-widest border-none">
                {alert.alertType.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-brand hover:bg-brand-muted uppercase tracking-widest group">
        Resolve All Alerts
        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}

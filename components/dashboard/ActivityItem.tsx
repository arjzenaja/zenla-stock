import React from 'react'
import { RecentActivity } from '@/types/models'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  activity: RecentActivity
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
        <AvatarImage src={activity.productImageUrl} />
        <AvatarFallback className="bg-brand-muted text-brand text-xs font-bold">
          {activity.productName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand transition-colors">
            {activity.productName}
          </p>
          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{activity.time}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.action} • {activity.detail}</p>
        
        <div className="mt-2 flex items-center justify-between sm:hidden">
           <Badge 
            variant="secondary" 
            className={cn(
              'text-[10px] font-bold px-2 py-0 h-4 border-none uppercase tracking-wider',
              activity.status === 'completed' ? 'bg-[#E8F5EC] text-[#1A6B3C]' : 'bg-slate-100 text-slate-500'
            )}
          >
            {activity.status}
          </Badge>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-col items-end gap-1">
        <Badge 
          variant="secondary" 
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 h-4 border-none uppercase tracking-wider',
            activity.status === 'completed' ? 'bg-[#E8F5EC] text-[#1A6B3C]' : 'bg-slate-100 text-slate-500'
          )}
        >
          {activity.status}
        </Badge>
      </div>
    </div>
  )
}

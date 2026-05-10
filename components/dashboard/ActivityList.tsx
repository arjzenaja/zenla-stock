import React from 'react'
import { ActivityItem } from './ActivityItem'
import { RecentActivity } from '@/types/models'

interface ActivityListProps {
  activities: RecentActivity[]
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

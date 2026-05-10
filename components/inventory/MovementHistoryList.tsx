import React from 'react'
import { StockMovement } from '@/types/models'
import { MovementHistoryItem } from './MovementHistoryItem'

interface MovementHistoryListProps {
  movements: StockMovement[]
}

export const MovementHistoryList: React.FC<MovementHistoryListProps> = ({ movements }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-2 md:p-4 border border-slate-50">
      {movements.length > 0 ? (
        <div className="divide-y divide-slate-50">
          {movements.map((movement) => (
            <MovementHistoryItem key={movement.id} movement={movement} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-slate-400 text-sm font-medium">No movement history available.</p>
        </div>
      )}
    </div>
  )
}

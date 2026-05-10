'use client'

import React from 'react'
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis 
} from 'recharts'
import { ChartDataPoint } from '@/types/models'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StockMovementChartProps {
  data: ChartDataPoint[]
}

export const StockMovementChart: React.FC<StockMovementChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 border border-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-900">Stock Movement</h3>
        <Select defaultValue="30">
          <SelectTrigger className="w-[140px] h-9 text-xs border-slate-100 rounded-lg focus:ring-brand">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100">
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A6B3C" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1A6B3C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              ticks={['Day 1','Day 10','Day 20','Day 30']}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12, 
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#64748B', fontWeight: 600, fontSize: 12, marginBottom: 4 }}
              itemStyle={{ color: '#1A6B3C', fontWeight: 700, fontSize: 14 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1A6B3C" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGreen)" 
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#1A6B3C' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

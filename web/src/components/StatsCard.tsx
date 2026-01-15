import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  className?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatsCard({ title, value, description, icon: Icon, className, trend }: StatsCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-xl bg-white transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 relative", 
      className
    )}>
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-full blur-2xl opacity-70 pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          "bg-indigo-50 text-indigo-600"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
        {description && (
          <div className="flex items-center mt-2 space-x-2">
            {trend === 'up' && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                +12%
              </span>
            )}
            <p className="text-xs text-slate-400 font-medium">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

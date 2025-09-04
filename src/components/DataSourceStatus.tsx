import React from 'react'
import { AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { useHotlist } from '../hooks/useHotlist'
import { cn } from '../lib/utils'

interface DataSourceStatusProps {
  className?: string
}

export const DataSourceStatus: React.FC<DataSourceStatusProps> = ({ className }) => {
  const { source, apiError, timestamp } = useHotlist()
  
  const isRealData = source === 'real'
  const lastUpdateTime = timestamp ? new Date(timestamp).toLocaleTimeString() : ''

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
      isRealData 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
      className
    )}>
      {isRealData ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>实时数据</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>演示数据</span>
        </>
      )}
      
      {lastUpdateTime && (
        <span className="opacity-75">·</span>
      )}
      
      {lastUpdateTime && (
        <span className="opacity-75">{lastUpdateTime}</span>
      )}
      
      {apiError && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span className="hidden sm:inline" title={apiError}>连接异常</span>
        </>
      )}
    </div>
  )
}

export default DataSourceStatus
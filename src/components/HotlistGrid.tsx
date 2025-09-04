import { HotlistItem } from '../types'
import { HotlistCard, HotlistCardSkeleton } from './HotlistCard'
import { cn } from '../lib/utils'

interface HotlistGridProps {
  items: HotlistItem[]
  isLoading?: boolean
  error?: string | null
  className?: string
  onItemClick?: (item: HotlistItem) => void
}

export const HotlistGrid = ({ 
  items, 
  isLoading = false, 
  error = null, 
  className,
  onItemClick 
}: HotlistGridProps) => {
  // 加载状态
  if (isLoading) {
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )}>
        {Array.from({ length: 12 }).map((_, index) => (
          <HotlistCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 dark:text-red-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          加载失败
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新加载
        </button>
      </div>
    )
  }

  // 空状态
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          暂无数据
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          当前筛选条件下没有找到热榜内容
        </p>
      </div>
    )
  }

  // 正常状态
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
      className
    )}>
      {items.map((item, index) => (
        <HotlistCard
          key={item.id}
          item={item}
          index={index}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  )
}

// 响应式网格容器
export const ResponsiveGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(
      'container mx-auto px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  )
}

// 网格统计信息
export const GridStats = ({ totalItems, filteredItems }: { totalItems: number, filteredItems: number }) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
      <span>
        显示 {filteredItems} 条，共 {totalItems} 条热榜内容
      </span>
      {filteredItems !== totalItems && (
        <span className="text-blue-600 dark:text-blue-400">
          已筛选
        </span>
      )}
    </div>
  )
}
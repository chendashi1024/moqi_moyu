import { useMemo } from 'react'
import { HotlistItem, Platform } from '../types'
import { PlatformCard, PlatformCardSkeleton } from './PlatformCard'
import { PLATFORMS } from '../lib/api'
import { cn } from '../lib/utils'

interface PlatformGridProps {
  items: HotlistItem[]
  isLoading?: boolean
  error?: string | null
  className?: string
  maxItemsPerPlatform?: number
  selectedPlatforms?: string[]
}

export const PlatformGrid = ({ 
  items = [], 
  isLoading = false, 
  error = null, 
  className,
  maxItemsPerPlatform = 50,
  selectedPlatforms = []
}: PlatformGridProps) => {
  // 按平台分组数据
  const platformData = useMemo(() => {
    const grouped = new Map<string, HotlistItem[]>()
    
    // 初始化所有平台
    PLATFORMS.forEach(platform => {
      grouped.set(platform.id, [])
    })
    
    // 分组数据 - 添加空值检查
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const platformItems = grouped.get(item.platform) || []
        platformItems.push(item)
        grouped.set(item.platform, platformItems)
      })
    }
    
    // 按热度排序每个平台的数据
    grouped.forEach((platformItems, platformId) => {
      platformItems.sort((a, b) => (b.hot || 0) - (a.hot || 0))
    })
    
    return grouped
  }, [items])

  // 过滤要显示的平台
  const visiblePlatforms = useMemo(() => {
    // 总是显示所有平台
    return PLATFORMS
  }, [])

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6',
        className
      )}>
        {Array.from({ length: 6 }).map((_, index) => (
          <PlatformCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 dark:text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          加载失败
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          重新加载
        </button>
      </div>
    )
  }



  // 正常状态
  return (
    <div className="h-full">
      <div className={cn(
        'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 h-full',
        className
      )}>
        {visiblePlatforms.map(platform => {
          const platformItems = platformData.get(platform.id) || []
          return (
            <PlatformCard
              key={platform.id}
              platform={platform}
              items={platformItems}
              maxItems={maxItemsPerPlatform}
            />
          )
        })}
      </div>
    </div>
  )
}

// 网格统计信息
export const PlatformGridStats = ({ 
  totalItems, 
  visiblePlatforms,
  selectedPlatforms 
}: { 
  totalItems: number
  visiblePlatforms: number
  selectedPlatforms: string[]
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="font-medium">
          显示 {visiblePlatforms} 个平台，共 {totalItems} 条热榜内容
        </span>
        {selectedPlatforms.length > 0 && selectedPlatforms.length < 6 && (
          <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
            已筛选 {selectedPlatforms.length} 个平台
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>实时更新</span>
      </div>
    </div>
  )
}
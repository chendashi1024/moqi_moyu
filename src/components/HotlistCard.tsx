import { ExternalLink, TrendingUp, Clock } from 'lucide-react'
import { HotlistItem } from '../types'
import { formatHotScore } from '../lib/api'
import { formatTime } from '../lib/utils'
import { cn } from '../lib/utils'

interface HotlistCardProps {
  item: HotlistItem
  index?: number
  className?: string
  onClick?: () => void
}

export const HotlistCard = ({ item, index, className, onClick }: HotlistCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-red-500 font-bold'
    if (rank <= 10) return 'text-orange-500 font-semibold'
    return 'text-gray-500'
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      zhihu: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      weibo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      bilibili: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      douyin: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      baidu: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      toutiao: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return colors[platform] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        'hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200',
        'cursor-pointer overflow-hidden',
        className
      )}
      onClick={handleClick}
    >
      {/* 排名标识 */}
      {typeof index === 'number' && (
        <div className="absolute top-3 left-3 z-10">
          <span className={cn('text-sm font-mono', getRankColor(index + 1))}>
            #{index + 1}
          </span>
        </div>
      )}

      {/* 外链图标 */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="p-4 pt-8">
        {/* 平台标签 */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getPlatformColor(item.platform)
          )}>
            {item.platformName}
          </span>
          
          {/* 热度值 */}
          {item.hot > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{formatHotScore(item.hot)}</span>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-5 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>刚刚更新</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              查看详情
            </span>
          </div>
        </div>
      </div>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

// 卡片骨架屏
export const HotlistCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  )
}
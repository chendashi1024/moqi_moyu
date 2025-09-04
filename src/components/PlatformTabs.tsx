import { Check, X } from 'lucide-react'
import { Platform } from '../types'
import { PLATFORMS } from '../lib/api'
import { cn } from '../lib/utils'
import { useAppStore } from '../stores/appStore'

interface PlatformTabsProps {
  className?: string
}

export const PlatformTabs = ({ className }: PlatformTabsProps) => {
  const { 
    selectedPlatforms, 
    togglePlatform, 
    selectAllPlatforms, 
    clearPlatformSelection 
  } = useAppStore()

  const isAllSelected = selectedPlatforms.length === PLATFORMS.length
  const isNoneSelected = selectedPlatforms.length === 0

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearPlatformSelection()
    } else {
      selectAllPlatforms()
    }
  }

  const getPlatformColor = (platform: Platform, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
    }
    
    const colors: Record<string, string> = {
      zhihu: 'bg-blue-500 text-white hover:bg-blue-600',
      weibo: 'bg-orange-500 text-white hover:bg-orange-600',
      bilibili: 'bg-pink-500 text-white hover:bg-pink-600',
      douyin: 'bg-gray-900 text-white hover:bg-gray-800',
      baidu: 'bg-blue-600 text-white hover:bg-blue-700',
      toutiao: 'bg-red-500 text-white hover:bg-red-600',
    }
    return colors[platform.id] || 'bg-blue-500 text-white hover:bg-blue-600'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 全选/取消全选 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          选择平台
        </h3>
        <button
          onClick={handleSelectAll}
          className={cn(
            'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            isAllSelected
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
          )}
        >
          {isAllSelected ? (
            <>
              <X className="w-3 h-3 mr-1" />
              取消全选
            </>
          ) : (
            <>
              <Check className="w-3 h-3 mr-1" />
              全选
            </>
          )}
        </button>
      </div>

      {/* 平台标签 */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id)
          
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                'border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                getPlatformColor(platform, isSelected),
                isSelected && 'shadow-sm'
              )}
            >
              <span className="relative">
                {platform.name}
                {isSelected && (
                  <Check className="w-3 h-3 ml-2 inline-block" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* 选择状态提示 */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {isNoneSelected ? (
          <span className="text-orange-600 dark:text-orange-400">
            请至少选择一个平台
          </span>
        ) : (
          <span>
            已选择 {selectedPlatforms.length} 个平台
          </span>
        )}
      </div>
    </div>
  )
}

// 紧凑版平台标签（用于顶部导航）
export const CompactPlatformTabs = ({ className }: PlatformTabsProps) => {
  const { selectedPlatforms, togglePlatform } = useAppStore()

  return (
    <div className={cn('flex items-center space-x-2 overflow-x-auto pb-2', className)}>
      {PLATFORMS.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.id)
        
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
              'border border-gray-200 dark:border-gray-700',
              isSelected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {platform.name}
          </button>
        )
      })}
    </div>
  )
}
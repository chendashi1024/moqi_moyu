import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { debounce } from '../lib/utils'
import { useAppStore } from '../stores/appStore'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export const SearchBar = ({ 
  placeholder = '搜索热榜内容...', 
  className,
  onSearch 
}: SearchBarProps) => {
  const { searchQuery, setSearchQuery } = useAppStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)

  // 防抖搜索
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }, 300)

  useEffect(() => {
    debouncedSearch(localQuery)
  }, [localQuery, debouncedSearch])

  // 同步外部状态
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleClear = () => {
    setLocalQuery('')
    setSearchQuery('')
    onSearch?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'relative flex items-center',
        'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
        'transition-all duration-200',
        isFocused 
          ? 'ring-2 ring-blue-500 border-blue-500 dark:border-blue-500' 
          : 'hover:border-gray-400 dark:hover:border-gray-500'
      )}>
        {/* 搜索图标 */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Search className={cn(
            'w-4 h-4 transition-colors',
            isFocused 
              ? 'text-blue-500' 
              : 'text-gray-400 dark:text-gray-500'
          )} />
        </div>

        {/* 输入框 */}
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2.5 text-sm',
            'bg-transparent border-0 outline-none',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-500 dark:placeholder-gray-400'
          )}
        />

        {/* 清除按钮 */}
        {localQuery && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 flex items-center justify-center',
              'w-5 h-5 rounded-full',
              'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors'
            )}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 搜索建议（可选） */}
      {isFocused && localQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="p-3 text-xs text-gray-500 dark:text-gray-400">
              按 Enter 搜索 "{localQuery}"
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 搜索结果统计
export const SearchStats = ({ 
  query, 
  totalResults, 
  totalItems 
}: { 
  query: string
  totalResults: number
  totalItems: number 
}) => {
  if (!query.trim()) return null

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
      <span>
        搜索 "{query}" 找到 {totalResults} 条结果
      </span>
      {totalResults !== totalItems && (
        <span className="text-blue-600 dark:text-blue-400">
          共 {totalItems} 条
        </span>
      )}
    </div>
  )
}

// 搜索快捷键提示
export const SearchShortcuts = () => {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      <span className="inline-flex items-center">
        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
          Esc
        </kbd>
        <span className="ml-1">清除搜索</span>
      </span>
    </div>
  )
}
import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore, applyTheme } from '../stores/themeStore'
import { Theme } from '../types'
import { cn } from '../lib/utils'
import { useEffect } from 'react'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export const ThemeToggle = ({ className, showLabel = false }: ThemeToggleProps) => {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore()
  const effectiveTheme = getEffectiveTheme()

  useEffect(() => {
    applyTheme()
  }, [theme])

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '浅色', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: '深色', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: '跟随系统', icon: <Monitor className="w-4 h-4" /> },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  return (
    <div className={cn('relative', className)}>
      {/* 简单切换按钮 */}
      <button
        onClick={() => {
          const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
          setTheme(nextTheme)
        }}
        className={cn(
          'inline-flex items-center justify-center',
          'w-9 h-9 rounded-lg',
          'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
          'text-gray-700 dark:text-gray-300',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900'
        )}
        title={`当前主题: ${currentTheme.label}`}
      >
        {currentTheme.icon}
      </button>

      {showLabel && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {currentTheme.label}
        </span>
      )}
    </div>
  )
}

// 下拉菜单版本的主题切换
export const ThemeDropdown = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme } = useThemeStore()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '浅色模式', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: '深色模式', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: '跟随系统', icon: <Monitor className="w-4 h-4" /> },
  ]

  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        主题设置
      </label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={cn(
              'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              theme === themeOption.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            )}
          >
            {themeOption.icon}
            <span className="mt-1 text-xs font-medium">
              {themeOption.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// 主题状态指示器
export const ThemeIndicator = () => {
  const { getEffectiveTheme } = useThemeStore()
  const effectiveTheme = getEffectiveTheme()

  return (
    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
      <div className={cn(
        'w-2 h-2 rounded-full mr-2',
        effectiveTheme === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'
      )} />
      <span>{effectiveTheme === 'dark' ? '深色模式' : '浅色模式'}</span>
    </div>
  )
}
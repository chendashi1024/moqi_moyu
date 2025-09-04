import React from 'react'
import { Search, Settings, TrendingUp, Clock, Bookmark } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { DataSourceStatus } from './DataSourceStatus'
import { useThemeStore } from '../stores/themeStore'
import { cn } from '../lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { isStealthMode } = useThemeStore()

  const navItems = [
    {
      path: '/',
      icon: TrendingUp,
      label: '热榜聚合',
      description: '实时热门内容'
    },
    {
      path: '/subscription',
      icon: Bookmark,
      label: '我的订阅',
      description: '个性化设置'
    },
    {
      path: '/history',
      icon: Clock,
      label: '历史榜单',
      description: '往期热榜'
    }
  ]

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isStealthMode ? 'Excel Dashboard' : 'mo契摸鱼热榜'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isStealthMode ? 'Data Analytics' : '多平台热榜聚合'}
                  </p>
                </div>
              </div>
              
              {/* 移动端关闭按钮 */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <SearchBar />
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  )} />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* 底部控制区 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* 数据来源状态 */}
            <DataSourceStatus />
            
            {/* 主题切换 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  主题设置
                </span>
              </div>
              <ThemeToggle />
            </div>
            
            {/* 版本信息 */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              v1.0.0 · 实时更新
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
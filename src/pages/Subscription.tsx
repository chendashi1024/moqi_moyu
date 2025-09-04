import { useEffect } from 'react'
import { User, Settings, LogOut, Github, Mail } from 'lucide-react'
import { ResponsiveGrid } from '../components/HotlistGrid'
import { ThemeDropdown } from '../components/ThemeToggle'
import { PlatformTabs } from '../components/PlatformTabs'
import { useThemeStore } from '../stores/themeStore'
import { useAppStore } from '../stores/appStore'
import { cn } from '../lib/utils'

export const Subscription = () => {
  const { user, subscriptions } = useAppStore()
  const { isStealthMode, toggleStealthMode } = useThemeStore()

  useEffect(() => {
    document.title = '我的订阅 - mo契摸鱼热榜'
  }, [])

  // 模拟登录状态（实际应该从Supabase获取）
  const isLoggedIn = false // 暂时设为false，后续集成Supabase Auth

  const handleLogin = () => {
    // TODO: 实现Supabase登录
    console.log('Login clicked')
  }

  const handleLogout = () => {
    // TODO: 实现Supabase登出
    console.log('Logout clicked')
  }

  const handleGithubLogin = () => {
    // TODO: 实现GitHub登录
    console.log('GitHub login clicked')
  }

  const handleEmailLogin = () => {
    // TODO: 实现邮箱登录
    console.log('Email login clicked')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveGrid>
        <div className="py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              我的订阅
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              管理您的平台订阅和个人设置
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：用户信息和登录 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                {isLoggedIn ? (
                  /* 已登录状态 */
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {user?.name || '用户'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">订阅平台：</span>
                        <span className="ml-1">{subscriptions.length} 个</span>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 未登录状态 */
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        登录账户
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        登录后可保存您的订阅偏好
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleGithubLogin}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        使用 GitHub 登录
                      </button>
                      
                      <button
                        onClick={handleEmailLogin}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        使用邮箱登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：订阅管理和设置 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 平台订阅 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    平台订阅
                  </h2>
                </div>
                
                {!isLoggedIn && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      登录后可保存您的订阅设置，否则设置仅在当前会话有效
                    </p>
                  </div>
                )}
                
                <PlatformTabs />
              </div>

              {/* 主题设置 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  外观设置
                </h2>
                
                <div className="space-y-6">
                  <ThemeDropdown />
                  
                  {/* 偷摸模式 */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      偷摸模式
                    </label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          启用伪装模式
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          将界面伪装成工作界面
                        </p>
                      </div>
                      <button
                        onClick={toggleStealthMode}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          isStealthMode
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            isStealthMode ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  使用说明
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 选择您感兴趣的平台，首页将只显示订阅内容</li>
                  <li>• 登录后您的订阅设置将自动保存</li>
                  <li>• 偷摸模式可以让界面看起来像工作软件</li>
                  <li>• 支持深色模式，保护您的眼睛</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveGrid>
    </div>
  )
}
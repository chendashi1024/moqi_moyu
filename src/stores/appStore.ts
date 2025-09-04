import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HotlistItem, User, UserSubscription } from '../types'
import { PLATFORMS } from '../lib/api'

interface AppState {
  // 热榜数据
  hotlistItems: HotlistItem[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  
  // 筛选和搜索
  selectedPlatforms: string[]
  searchQuery: string
  
  // 用户相关
  user: User | null
  subscriptions: UserSubscription[]
  
  // Actions
  setHotlistItems: (items: HotlistItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedPlatforms: (platforms: string[]) => void
  setSearchQuery: (query: string) => void
  setUser: (user: User | null) => void
  setSubscriptions: (subscriptions: UserSubscription[]) => void
  
  // 筛选方法
  getFilteredItems: () => HotlistItem[]
  togglePlatform: (platformId: string) => void
  selectAllPlatforms: () => void
  clearPlatformSelection: () => void
  
  // 重置方法
  reset: () => void
}

const initialState = {
  hotlistItems: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedPlatforms: PLATFORMS.map(p => p.id), // 默认选择所有平台
  searchQuery: '',
  user: null,
  subscriptions: [],
}

export const useAppStore = create<AppState>()(persist(
    (set, get) => ({
      ...initialState,
      
      setHotlistItems: (items: HotlistItem[]) => {
        set({ 
          hotlistItems: items, 
          lastUpdated: new Date(),
          error: null 
        })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },
      
      setSelectedPlatforms: (platforms: string[]) => {
        set({ selectedPlatforms: platforms })
      },
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },
      
      setUser: (user: User | null) => {
        set({ user })
      },
      
      setSubscriptions: (subscriptions: UserSubscription[]) => {
        set({ subscriptions })
      },
      
      getFilteredItems: () => {
        const { hotlistItems, searchQuery, user, subscriptions } = get()
        
        let filtered = hotlistItems
        
        // 如果用户已登录且有订阅，只显示订阅的平台
        if (user && subscriptions.length > 0) {
          const subscribedPlatforms = subscriptions.map(sub => sub.platform_key)
          filtered = filtered.filter(item => subscribedPlatforms.includes(item.platform))
        }
        // 否则显示所有平台数据
        
        // 搜索筛选
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim()
          filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.platformName.toLowerCase().includes(query)
          )
        }
        
        return filtered
      },
      
      togglePlatform: (platformId: string) => {
        set((state) => {
          const isSelected = state.selectedPlatforms.includes(platformId)
          const newSelection = isSelected
            ? state.selectedPlatforms.filter(id => id !== platformId)
            : [...state.selectedPlatforms, platformId]
          
          return { selectedPlatforms: newSelection }
        })
      },
      
      selectAllPlatforms: () => {
        set({ selectedPlatforms: PLATFORMS.map(p => p.id) })
      },
      
      clearPlatformSelection: () => {
        set({ selectedPlatforms: [] })
      },
      
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        selectedPlatforms: state.selectedPlatforms,
        searchQuery: state.searchQuery,
      }),
    }
  ))
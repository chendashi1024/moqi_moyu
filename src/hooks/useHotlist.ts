import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MomoyuApiService } from '../lib/api'
import { HotlistItem, ApiResponse } from '../types'
import { useAppStore } from '../stores/appStore'
import { useEffect } from 'react'

const HOTLIST_QUERY_KEY = ['hotlist']
const REFETCH_INTERVAL = 5 * 60 * 1000 // 5分钟

export const useHotlist = () => {
  const { setHotlistItems, setLoading, setError } = useAppStore()
  const queryClient = useQueryClient()

  const query = useQuery<ApiResponse>({
    queryKey: HOTLIST_QUERY_KEY,
    queryFn: MomoyuApiService.fetchHotlist,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: 2 * 60 * 1000, // 2分钟内认为数据是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
    retry: false, // 禁用React Query的重试，因为API服务内部已经有重试机制
  })

  // 同步数据到store
  useEffect(() => {
    if (query.data) {
      setHotlistItems(query.data.data)
    }
    setLoading(query.isLoading)
    setError(query.error?.message || query.data?.error || null)
  }, [query.data, query.isLoading, query.error, setHotlistItems, setLoading, setError])

  const refetch = () => {
    return queryClient.invalidateQueries({ queryKey: HOTLIST_QUERY_KEY })
  }

  const prefetch = () => {
    return queryClient.prefetchQuery({
      queryKey: HOTLIST_QUERY_KEY,
      queryFn: MomoyuApiService.fetchHotlist,
      staleTime: 2 * 60 * 1000,
    })
  }

  return {
    data: query.data?.data || [],
    source: query.data?.source || 'real',
    timestamp: query.data?.timestamp,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch,
    prefetch,
    lastUpdated: query.dataUpdatedAt,
    apiError: query.data?.error,
  }
}

// 获取特定平台的热榜数据
export const usePlatformHotlist = (platformId: string) => {
  const { data } = useHotlist()
  
  return {
    data: data.filter(item => item.platform === platformId),
    isEmpty: data.filter(item => item.platform === platformId).length === 0,
  }
}

// 搜索热榜数据
export const useSearchHotlist = (searchQuery: string) => {
  const { data } = useHotlist()
  
  const searchResults = searchQuery.trim() 
    ? data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platformName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data
  
  return {
    data: searchResults,
    isEmpty: searchResults.length === 0,
    hasQuery: searchQuery.trim().length > 0,
  }
}
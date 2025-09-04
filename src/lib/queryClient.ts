import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 默认缓存时间
      staleTime: 1000 * 60 * 5, // 5分钟
      gcTime: 1000 * 60 * 10, // 10分钟
      // 重试配置
      retry: (failureCount, error) => {
        // 最多重试2次
        if (failureCount >= 2) return false
        // 只对网络错误重试
        return error.message.includes('fetch') || error.message.includes('network')
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口聚焦时重新获取
      refetchOnWindowFocus: false,
      // 网络重连时重新获取
      refetchOnReconnect: true,
    },
    mutations: {
      // 突变重试配置
      retry: 1,
      retryDelay: 1000,
    },
  },
})

// 错误处理
queryClient.setMutationDefaults(['hotlist'], {
  mutationFn: async () => {
    throw new Error('Mutations not implemented for hotlist')
  },
})

// 全局错误处理
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
    throwOnError: false,
  },
  mutations: {
    ...queryClient.getDefaultOptions().mutations,
    throwOnError: false,
  },
})
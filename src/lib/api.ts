import { MomoyuApiResponse, HotlistItem, Platform, ApiResponse } from '../types'
import { getAllMockData } from './mockData'

// 平台配置 - 动态更新
export let PLATFORMS: Platform[] = [
  { id: 'zhihu', name: '知乎热榜', key: 'zhihu', color: '#0066ff' },
  { id: 'weibo', name: '微博热搜', key: 'weibo', color: '#ff6b35' },
  { id: 'bilibili', name: 'B站热榜', key: 'bilibili', color: '#fb7299' },
  { id: 'douyin', name: '抖音热榜', key: 'douyin', color: '#000000' },
  { id: 'baidu', name: '百度热搜', key: 'baidu', color: '#2932e1' },
  { id: 'toutiao', name: '头条热榜', key: 'toutiao', color: '#ff4757' },
]

// 更新平台配置
export const updatePlatformsFromApi = (apiPlatforms: any[]) => {
  const newPlatforms: Platform[] = apiPlatforms.map(platform => ({
    id: platform.source_key || platform.name,
    name: platform.name,
    key: platform.source_key || platform.name,
    color: platform.icon_color || '#666666',
  }))
  
  PLATFORMS = newPlatforms
  return newPlatforms
}

// Momoyu API 服务
export class MomoyuApiService {
  private static readonly API_URL = import.meta.env.VITE_MOMOYU_API_URL || 'https://momoyu.cc/api/hot/list?type=0'
  private static readonly MAX_RETRIES = 2
  private static readonly RETRY_DELAY = 1000

  static async fetchHotlist(): Promise<ApiResponse> {
    // 首先尝试获取真实API数据
    for (let attempt = 0; attempt <= MomoyuApiService.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(MomoyuApiService.API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 添加超时控制
          signal: AbortSignal.timeout(5000),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: MomoyuApiResponse = await response.json()

        if (data.status !== 100000) {
          throw new Error(`API returned error: ${data.message}`)
        }

        // 更新平台配置
        updatePlatformsFromApi(data.data)
        
        const transformedData = this.transformApiData(data.data)
        console.log('✅ 成功获取实时热榜数据')
        
        return {
          data: transformedData,
          source: 'real',
          timestamp: Date.now(),
        }
      } catch (error) {
        console.warn(`API请求失败 (尝试 ${attempt + 1}/${MomoyuApiService.MAX_RETRIES + 1}):`, error)
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < MomoyuApiService.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, MomoyuApiService.RETRY_DELAY))
          continue
        }
      }
    }

    // 所有重试都失败，使用模拟数据
    console.warn('⚠️ API连接失败，使用演示数据')
    return {
      data: getAllMockData(),
      source: 'mock',
      timestamp: Date.now(),
      error: 'API连接失败，当前显示演示数据',
    }
  }

  private static transformApiData(platforms: any[]): HotlistItem[] {
    const items: HotlistItem[] = []
    
    platforms.forEach((platformData) => {
      if (!platformData || !platformData.data || !Array.isArray(platformData.data)) return

      const platformId = platformData.source_key || platformData.name
      const platformName = platformData.name
      
      platformData.data.forEach((item: any, index: number) => {
        if (item && typeof item === 'object' && item.title && item.link) {
          // 解析热度值
          let hotValue = 0
          if (item.extra) {
            const hotStr = item.extra.toString().replace(/[^0-9.]/g, '')
            hotValue = parseFloat(hotStr) || 0
            if (item.extra.includes('万')) {
              hotValue *= 10000
            }
          }

          items.push({
            id: `${platformId}-${item.id || index}`,
            title: item.title,
            url: item.link,
            hot: hotValue,
            platform: platformId,
            platformName: platformName,
          })
        }
      })
    })

    return items
  }

  static getPlatformById(id: string): Platform | undefined {
    return PLATFORMS.find(p => p.id === id)
  }

  static getAllPlatforms(): Platform[] {
    return PLATFORMS
  }
}

// 工具函数
export const formatHotScore = (score: number): string => {
  if (score >= 10000) {
    return `${(score / 10000).toFixed(1)}万`
  }
  return score.toString()
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 导出fetchHotlist函数供外部使用
export const fetchHotlist = () => MomoyuApiService.fetchHotlist()
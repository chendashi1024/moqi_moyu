import {
  MomoyuApiResponse,
  MomoyuPlatform,
  MomoyuHotlistItem,
  HotlistItem,
  Platform,
  ApiResponse,
} from "../types";

// 平台配置 - 动态更新
export let PLATFORMS: Platform[] = [
  { id: "zhihu", name: "知乎热榜", key: "zhihu", color: "#0066ff" },
  { id: "weibo", name: "微博热搜", key: "weibo", color: "#ff6b35" },
  { id: "bilibili", name: "B站热榜", key: "bilibili", color: "#fb7299" },
  { id: "douyin", name: "抖音热榜", key: "douyin", color: "#000000" },
  { id: "baidu", name: "百度热搜", key: "baidu", color: "#2932e1" },
  { id: "toutiao", name: "头条热榜", key: "toutiao", color: "#ff4757" },
];

// 更新平台配置
export const updatePlatformsFromApi = (apiPlatforms: MomoyuPlatform[]) => {
  const newPlatforms: Platform[] = apiPlatforms.map((platform) => ({
    id: platform.source_key || platform.name,
    name: platform.name,
    key: platform.source_key || platform.name,
    color: platform.icon_color || "#666666",
  }));

  PLATFORMS = newPlatforms;
  return newPlatforms;
};

// Supabase 热榜 API 服务
export class MomoyuApiService {
  // 开发环境使用代理，生产环境直接访问 Supabase
  private static readonly API_URL = import.meta.env.DEV
    ? "/api/hot_list"
    : import.meta.env.VITE_SUPABASE_HOTLIST_URL ||
      "https://qguuzxljrertmjypatge.supabase.co/functions/v1/hot_list";
  private static readonly MAX_RETRIES = 2;
  private static readonly RETRY_DELAY = 1000;

  static async fetchHotlist(): Promise<ApiResponse> {
    const apiUrl = MomoyuApiService.API_URL;
    const apiType = import.meta.env.DEV ? "Supabase代理" : "Supabase直连";
    console.log(`🔄 开始获取热榜数据 [${apiType}]: ${apiUrl}`);

    for (let attempt = 0; attempt <= MomoyuApiService.MAX_RETRIES; attempt++) {
      const startTime = Date.now();
      try {
        console.log(
          `⏱️  开始请求 [${apiType}] 尝试 ${attempt + 1}/${
            MomoyuApiService.MAX_RETRIES + 1
          }`
        );

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // 添加超时控制
          signal: AbortSignal.timeout(15000),
        });

        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(
          `✅ 请求完成 [${apiType}] 耗时: ${duration}ms, 状态: ${response.status}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MomoyuApiResponse = await response.json();

        if (data.status !== 100000) {
          throw new Error(`API returned error: ${data.message}`);
        }

        // 更新平台配置
        updatePlatformsFromApi(data.data);

        const transformedData = MomoyuApiService.transformApiData(data.data);
        console.log(
          `🎉 成功获取热榜数据 [${apiType}] 平台数: ${data.data.length}, 条目数: ${transformedData.length}`
        );
        console.log(
          "📋 数据来源确认: 100% Supabase 实时数据，已移除所有 Mock 数据"
        );

        return {
          data: transformedData,
          source: "supabase",
          timestamp: Date.now(),
        };
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const errorType = error instanceof Error ? error.name : "UnknownError";
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.warn(
          `❌ [${apiType}] 请求失败 (尝试 ${attempt + 1}/${
            MomoyuApiService.MAX_RETRIES + 1
          }) 耗时: ${duration}ms`,
          `错误类型: ${errorType}`,
          `错误信息: ${errorMessage}`
        );

        // 如果不是最后一次尝试，等待后重试
        if (attempt < MomoyuApiService.MAX_RETRIES) {
          console.log(`⏳ 等待 ${MomoyuApiService.RETRY_DELAY}ms 后重试...`);
          await new Promise((resolve) =>
            setTimeout(resolve, MomoyuApiService.RETRY_DELAY)
          );
          continue;
        }
      }
    }

    // Supabase 接口失败，抛出错误
    const errorMsg = "⚠️ Supabase 接口连接失败，无法获取热榜数据";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  private static transformApiData(platforms: MomoyuPlatform[]): HotlistItem[] {
    const items: HotlistItem[] = [];

    platforms.forEach((platformData) => {
      if (
        !platformData ||
        !platformData.data ||
        !Array.isArray(platformData.data)
      )
        return;

      const platformId = platformData.source_key || platformData.name;
      const platformName = platformData.name;

      platformData.data.forEach((item: MomoyuHotlistItem, index: number) => {
        if (item && typeof item === "object" && item.title && item.link) {
          // 解析热度值
          let hotValue = 0;
          if (item.extra) {
            const hotStr = item.extra.toString().replace(/[^0-9.]/g, "");
            hotValue = parseFloat(hotStr) || 0;
            if (item.extra.includes("万")) {
              hotValue *= 10000;
            }
          }

          items.push({
            id: `${platformId}-${item.id || index}`,
            title: item.title,
            url: item.link,
            hot: hotValue,
            platform: platformId,
            platformName: platformName,
          });
        }
      });
    });

    return items;
  }

  static getPlatformById(id: string): Platform | undefined {
    return PLATFORMS.find((p) => p.id === id);
  }

  static getAllPlatforms(): Platform[] {
    return PLATFORMS;
  }
}

// 工具函数
export const formatHotScore = (score: number): string => {
  if (score >= 10000) {
    return `${(score / 10000).toFixed(1)}万`;
  }
  return score.toString();
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 导出fetchHotlist函数供外部使用
export const fetchHotlist = () => MomoyuApiService.fetchHotlist();

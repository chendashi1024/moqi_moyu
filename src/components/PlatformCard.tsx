import { Maximize2 } from "lucide-react";
import { HotlistItem, Platform } from "../types";
import { formatHotScore } from "../lib/api";
import { cn } from "../lib/utils";

interface PlatformCardProps {
  platform: Platform;
  items: HotlistItem[];
  className?: string;
  maxItems?: number;
  onFullscreen?: () => void;
}

export const PlatformCard = ({
  platform,
  items,
  onFullscreen,
}: PlatformCardProps) => {
  const getPlatformIcon = (platformId: string) => {
    const iconMap: Record<string, string> = {
      zhihu: "知",
      weibo: "微",
      bilibili: "B",
      douyin: "抖",
      baidu: "百",
      toutiao: "头",
    };

    return (
      <div
        className="w-18 h-18 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm"
        style={{ backgroundColor: platform.color }}
      >
        {iconMap[platformId] || platform.name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="cosmic-card mb-5 rounded-xl overflow-hidden animate-card-glow flex flex-col h-[400px]">
      {/* 平台头部 */}
      <div
        className="p-2 border-b flex-shrink-0"
        style={{
          backgroundColor: `${platform.color}10`,
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: platform.color }}
            >
              {getPlatformIcon(platform.id)}
            </div>
            <div>
              <h3 className="font-medium cosmic-text-primary text-xs cosmic-glow">
                {platform.name}
              </h3>
              <p className="text-xs cosmic-text-muted">{items.length} 条</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onFullscreen && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFullscreen();
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="全屏显示"
              >
                <Maximize2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            <div className="text-xs cosmic-text-muted">实时</div>
          </div>
        </div>
      </div>

      {/* 热榜列表 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full cosmic-text-muted">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 opacity-50">
                {getPlatformIcon(platform.id)}
              </div>
              <p className="text-sm">暂无数据</p>
            </div>
          </div>
        ) : (
          <div className="p-1">
            {items.map((item, index) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-1.5 rounded transition-all duration-300 group hover:backdrop-blur-sm"
                style={{
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-start space-x-1.5">
                  {/* 排名 */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold",
                      index < 3
                        ? "bg-red-500 text-white"
                        : index < 10
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0 flex items-center justify-between space-x-2">
                    <h4
                      className="text-xs font-medium cosmic-text-primary whitespace-nowrap overflow-hidden text-ellipsis transition-colors flex-1 group-hover:cosmic-glow"
                      style={{ color: "var(--text-white)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--light-purple)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-white)";
                      }}
                    >
                      {item.title}
                    </h4>

                    {/* 热度 */}
                    {item.extra && (
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <div className="flex items-center text-xs cosmic-text-muted">
                          {/* <TrendingUp className="w-2 h-2 mr-0.5" /> */}
                          <span className="text-xs">
                            {item.extra || formatHotScore(item.hot)}
                          </span>
                        </div>

                        {/* <ExternalLink className="w-2 h-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 平台卡片骨架屏
export const PlatformCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse h-[400px] flex flex-col">
      {/* 头部骨架 */}
      <div className="p-2 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
          </div>
        </div>
      </div>

      {/* 列表骨架 */}
      <div className="flex-1 p-1 space-y-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-start space-x-1.5 p-1.5">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-0.5">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from "react";
import { X, TrendingUp } from "lucide-react";
import { HotlistItem, Platform } from "../types";
import { cn } from "../lib/utils";

interface FullscreenHotlistProps {
  platform: Platform;
  items: HotlistItem[];
  onClose: () => void;
}

export const FullscreenHotlist: React.FC<FullscreenHotlistProps> = ({
  platform,
  items,
  onClose,
}) => {
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
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm"
        style={{ backgroundColor: platform.color }}
      >
        {iconMap[platformId] || platform.name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 animate-scale-up">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlatformIcon(platform.id)}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {platform.name} 热榜
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                共 {items.length} 条热榜内容
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="退出全屏"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* 热榜列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                  {getPlatformIcon(platform.id)}
                </div>
                <p className="text-lg">暂无热榜数据</p>
              </div>
            </div>
          ) : (
            items.map((item, index) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  {/* 排名 */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
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
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-relaxed">
                      {item.title}
                    </h3>

                    {/* 热度信息 */}
                    {item.extra && (
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>{item.extra}</span>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

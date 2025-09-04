import React from "react";
import { PlatformGrid } from "../components/PlatformGrid";
import { useHotlist } from "../hooks/useHotlist";
import { useAppStore } from "../stores/appStore";
import { useThemeStore } from "../stores/themeStore";

export const Home: React.FC = () => {
  const { data: hotlistData, isLoading, error } = useHotlist();
  const { searchQuery } = useAppStore();
  const { isStealthMode } = useThemeStore();

  // 过滤数据
  const filteredData = React.useMemo(() => {
    if (!hotlistData) return [];

    let filtered = hotlistData;

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [hotlistData, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isStealthMode ? "正在加载数据..." : "正在加载热榜数据..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            加载失败
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 页面标题 - 仅在有搜索结果时显示 */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            搜索结果: "{searchQuery}"
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            找到 {filteredData.length} 条相关内容
          </p>
        </div>
      )}

      {/* 热榜网格 */}
      <PlatformGrid
        items={filteredData}
        isLoading={isLoading}
        error={error?.message || null}
      />
    </div>
  );
};

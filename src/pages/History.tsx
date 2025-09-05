import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { ResponsiveGrid } from "../components/HotlistGrid";
import { HotlistCard } from "../components/HotlistCard";
import { cn } from "../lib/utils";
import { HotlistItem } from "../types";

export const History = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [historyData, setHistoryData] = useState<HotlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "历史榜单 - mo契摸鱼吧";
  }, []);

  // 模拟获取历史数据
  const fetchHistoryData = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 实际应该从Supabase获取历史数据
      // 这里模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟数据
      const mockData: HotlistItem[] = [
        {
          id: `history-1-${date}`,
          title: `${date} 的热门话题示例`,
          url: "https://example.com",
          hot: 12345,
          platform: "zhihu",
          platformName: "知乎热榜",
        },
        {
          id: `history-2-${date}`,
          title: `${date} 的另一个热门话题`,
          url: "https://example.com",
          hot: 9876,
          platform: "weibo",
          platformName: "微博热搜",
        },
      ];

      setHistoryData(mockData);
    } catch (err) {
      setError("获取历史数据失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData(selectedDate);
  }, [selectedDate]);

  // 生成最近7天的日期选项
  const getRecentDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label:
          i === 0
            ? "今天"
            : i === 1
            ? "昨天"
            : date.toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
              }),
        fullLabel: date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  const recentDates = getRecentDates();
  const selectedDateInfo = recentDates.find((d) => d.value === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveGrid>
        <div className="py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              历史榜单
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看往日的热门内容存档
            </p>
          </div>

          {/* 功能提示 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  功能说明
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  历史榜单功能需要后台定时任务支持，目前显示的是模拟数据。实际部署时会通过
                  Supabase Edge Functions 定时保存热榜数据。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧：日期选择 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    选择日期
                  </h2>
                </div>

                {/* 快速日期选择 */}
                <div className="space-y-2 mb-6">
                  {recentDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedDate === date.value
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <div className="font-medium">{date.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {date.fullLabel}
                      </div>
                    </button>
                  ))}
                </div>

                {/* 自定义日期选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    自定义日期
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 右侧：历史数据 */}
            <div className="lg:col-span-3">
              {/* 当前选择的日期信息 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {selectedDateInfo?.fullLabel || selectedDate}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{historyData.length} 条记录</span>
                  </div>
                </div>
              </div>

              {/* 历史数据展示 */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 dark:text-red-400 mb-4">
                    <AlertCircle className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    加载失败
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => fetchHistoryData(selectedDate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    重新加载
                  </button>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Calendar className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    暂无数据
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    该日期没有保存的热榜数据
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {historyData.map((item, index) => (
                    <HotlistCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveGrid>
    </div>
  );
};

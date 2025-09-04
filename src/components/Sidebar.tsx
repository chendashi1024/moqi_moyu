import React from "react";
import {
  Settings,
  TrendingUp,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { DataSourceStatus } from "./DataSourceStatus";
import { useThemeStore } from "../stores/themeStore";
import { cn } from "../lib/utils";
import Logo from "/logo.jpg";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { isStealthMode } = useThemeStore();

  const navItems = [
    {
      path: "/",
      icon: TrendingUp,
      label: "热榜聚合",
      description: "实时热门内容",
    },
    {
      path: "/subscription",
      icon: Bookmark,
      label: "我的订阅",
      description: "个性化设置",
    },
    {
      path: "/history",
      icon: Clock,
      label: "历史榜单",
      description: "往期热榜",
    },
  ];

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          "cosmic-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
          // 移动端：固定定位，可滑动显示/隐藏
          "fixed left-0 top-0 h-full z-50 transform w-80",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // 桌面端：静态定位，固定高度，可收起/展开
          "lg:static lg:translate-x-0 lg:z-auto lg:h-screen lg:overflow-hidden",
          isCollapsed ? "lg:w-16" : "lg:w-80"
        )}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div
            className={cn(
              "border-b",
              "border-purple-500/30",
              isCollapsed ? "p-3" : "p-6"
            )}
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center w-full" : "space-x-3"
                )}
              >
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div> */}
                <img src={Logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                {!isCollapsed && (
                  <div>
                    <h1 className="text-xl font-bold cosmic-title animate-star-glow">
                      {isStealthMode ? "Excel Dashboard" : "mo契摸鱼热榜"}
                    </h1>
                    {/* <p className="text-sm cosmic-text-secondary">
                      {isStealthMode ? "Data Analytics" : "多平台热榜聚合"}
                    </p> */}
                  </div>
                )}
              </div>

              {/* 桌面端收起按钮 */}
              {!isCollapsed && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:block p-2 rounded-lg transition-all duration-300"
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--text-gray)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--card-bg-hover)";
                    e.currentTarget.style.color = "var(--text-white)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--card-bg)";
                    e.currentTarget.style.color = "var(--text-gray)";
                  }}
                  title="收起侧边栏"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* 移动端关闭按钮 */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg transition-all duration-300"
                style={{
                  background: "var(--card-bg)",
                  color: "var(--text-gray)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-bg-hover)";
                  e.currentTarget.style.color = "var(--text-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.color = "var(--text-gray)";
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 搜索栏 */}
          {/* {!isCollapsed && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <SearchBar />
            </div>
          )} */}

          {/* 导航菜单 */}
          <nav className={cn("flex-1 space-y-2", isCollapsed ? "p-2" : "p-4")}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "cosmic-nav-item rounded-lg",
                    isCollapsed ? "p-2 justify-center" : "space-x-3 p-3",
                    isActive && "active"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 cosmic-glow",
                      isActive ? "text-current" : "text-current"
                    )}
                  />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium cosmic-text-primary">
                        {item.label}
                      </div>
                      <div className="text-xs cosmic-text-muted">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 底部控制区 */}
          <div
            className={cn(
              "border-t",
              isCollapsed ? "p-2 space-y-2" : "p-4 space-y-4"
            )}
            style={{ borderColor: "var(--border-color)" }}
          >
            {/* 收起状态下的展开按钮 */}
            {isCollapsed && (
              <button
                onClick={onToggleCollapse}
                className="w-full p-2 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: "var(--card-bg)",
                  color: "var(--text-gray)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-bg-hover)";
                  e.currentTarget.style.color = "var(--text-white)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card-bg)";
                  e.currentTarget.style.color = "var(--text-gray)";
                }}
                title="展开侧边栏"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* 数据来源状态 */}
            {!isCollapsed && <DataSourceStatus />}

            {/* 主题切换 */}
            <div
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <Settings
                    className="w-4 h-4 cosmic-glow"
                    style={{ color: "var(--text-gray)" }}
                  />
                  <span className="text-sm font-medium cosmic-text-secondary">
                    主题设置
                  </span>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* 版本信息 */}
            {!isCollapsed && (
              <div className="text-xs cosmic-text-muted text-center">
                v1.0.0 · 实时更新
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

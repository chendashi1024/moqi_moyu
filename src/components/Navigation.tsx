import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, History, Menu, X, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DataSourceStatus } from "./DataSourceStatus";
import { useThemeStore } from "../stores/themeStore";
import { cn } from "../lib/utils";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isStealthMode, toggleStealthMode } = useThemeStore();
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "首页",
      icon: Home,
      description: "热榜聚合",
    },
    {
      // path: "/excel",
      // icon: Bookmark,
      label: "工资实时(开发中)",
    },
    {
      // path: "/excel",
      // icon: Bookmark,
      label: "工资实时(开发中)",
    },
    // {
    //   path: "/subscription",
    //   label: "我的订阅",
    //   icon: User,
    //   description: "订阅管理",
    // },
    // {
    //   path: "/history",
    //   label: "历史榜单",
    //   icon: History,
    //   description: "历史数据",
    // },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* 桌面端导航 */}
      <nav
        className={cn(
          "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
          isStealthMode && "bg-gray-100 dark:bg-gray-900",
          className
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {isStealthMode ? "W" : "M"}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {isStealthMode ? "WorkSpace" : "mo契摸鱼吧"}
                </span>
              </Link>
            </div>

            {/* 桌面端导航链接 */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {isStealthMode ? item.description : item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center space-x-2">
              {/* 数据来源状态 */}
              <DataSourceStatus className="hidden sm:flex" />

              {/* 偷摸模式切换 */}
              <button
                onClick={toggleStealthMode}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isStealthMode &&
                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                )}
                title={isStealthMode ? "退出偷摸模式" : "启用偷摸模式"}
              >
                {isStealthMode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              {/* 主题切换 */}
              <ThemeToggle />

              {/* 移动端菜单按钮 */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <div>
                      <div>{isStealthMode ? item.description : item.label}</div>
                      {!isStealthMode && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

// 面包屑导航
export const Breadcrumb = () => {
  const location = useLocation();
  const { isStealthMode } = useThemeStore();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [{ label: isStealthMode ? "Dashboard" : "首页", path: "/" }];

    if (path === "/subscription") {
      items.push({
        label: isStealthMode ? "Settings" : "我的订阅",
        path: "/subscription",
      });
    } else if (path === "/history") {
      items.push({
        label: isStealthMode ? "Reports" : "历史榜单",
        path: "/history",
      });
    }

    return items;
  };

  const items = getBreadcrumbItems();

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <Link
            to={item.path}
            className={cn(
              "hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
              index === items.length - 1 &&
                "text-gray-900 dark:text-gray-100 font-medium"
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

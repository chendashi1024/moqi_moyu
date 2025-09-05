import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Menu } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Subscription } from "./pages/Subscription";
import { History } from "./pages/History";
import { useTheme } from "./hooks/useTheme";
import { queryClient } from "./lib/queryClient";
import { cn } from "./lib/utils";

function App() {
  useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
          {/* 侧边栏 */}
          <Sidebar
            isOpen={sidebarOpen}
            isCollapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* 主体内容区域 */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* 移动端顶部栏 */}
            <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* 主要内容 */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-4 lg:p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;

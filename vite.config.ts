import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from "vite-plugin-trae-solo-badge";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: "hidden",
  },
  server: {
    open: true,
    proxy: {
      // 代理 smooth-api 函数调用到具体的函数地址
      "/api/smooth-api": {
        target:
          "https://qguuzxljrertmjypatge.supabase.co/functions/v1/smooth-api",
        changeOrigin: true,
        rewrite: () => "",
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("smooth-api 代理错误:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("smooth-api 代理请求:", req.method, req.url);
            // 添加必要的请求头
            proxyReq.setHeader("Content-Type", "application/json");
          });
          proxy.on("proxyRes", (proxyRes) => {
            console.log("smooth-api 代理响应:", proxyRes.statusCode);
          });
        },
      },
      // 代理 hot_list 函数调用到 Supabase 接口
      "/api/hot_list": {
        target:
          "https://qguuzxljrertmjypatge.supabase.co/functions/v1/hot_list",
        changeOrigin: true,
        rewrite: () => "",
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("hot_list 代理错误:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("hot_list 代理请求:", req.method, req.url);
            // 添加必要的请求头
            proxyReq.setHeader("Content-Type", "application/json");
          });
          proxy.on("proxyRes", (proxyRes) => {
            console.log("hot_list 代理响应:", proxyRes.statusCode);
          });
        },
      },
      // 代理 hotlist-proxy 函数调用到具体的函数地址
      "/api/hotlist-proxy": {
        target:
          "https://qguuzxljrertmjypatge.supabase.co/functions/v1/hotlist-proxy",
        changeOrigin: true,
        rewrite: () => "",
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("hotlist-proxy 代理错误:", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("hotlist-proxy 代理请求:", req.method, req.url);
            // 添加必要的请求头
            proxyReq.setHeader("Content-Type", "application/json");
          });
          proxy.on("proxyRes", (proxyRes) => {
            console.log("hotlist-proxy 代理响应:", proxyRes.statusCode);
          });
        },
      },
      // 通用 Supabase 函数代理
      "/api/supabase-functions": {
        target: "https://qguuzxljrertmjypatge.supabase.co/functions/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/supabase-functions", ""),
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("Supabase 函数代理错误:", err);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("Supabase 函数代理请求:", req.method, req.url);
          });
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["react-dev-locator"],
      },
    }),
    // traeBadgePlugin({
    //   variant: "dark",
    //   position: "bottom-right",
    //   prodOnly: true,
    //   clickable: true,
    //   clickUrl: "https://www.trae.ai/solo?showJoin=1",
    //   autoTheme: true,
    //   autoThemeTarget: "#root",
    // }),
    tsconfigPaths(),
  ],
});

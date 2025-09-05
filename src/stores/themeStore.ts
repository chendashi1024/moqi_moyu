import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Theme } from "../types";

interface ThemeState {
  theme: Theme;
  isStealthMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleStealthMode: () => void;
  getSystemTheme: () => "light" | "dark";
  getEffectiveTheme: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isStealthMode: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        // 主题变更后立即应用
        setTimeout(() => applyTheme(), 0);
      },

      toggleStealthMode: () => {
        set((state) => ({ isStealthMode: !state.isStealthMode }));
      },

      getSystemTheme: () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      },

      getEffectiveTheme: () => {
        const { theme, getSystemTheme } = get();
        return theme === "system" ? getSystemTheme() : theme;
      },
    }),
    {
      name: "theme-storage-v2",
      partialize: (state) => ({
        theme: state.theme,
        isStealthMode: state.isStealthMode,
      }),
    }
  )
);

// 应用主题到DOM
export const applyTheme = () => {
  const store = useThemeStore.getState();
  const effectiveTheme = store.getEffectiveTheme();
  const root = document.documentElement;

  if (effectiveTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// 监听系统主题变化
if (typeof window !== "undefined") {
  // 清除旧的主题存储，强制所有用户使用新的深色默认主题
  localStorage.removeItem("theme-storage");
  localStorage.removeItem("theme");

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const store = useThemeStore.getState();
    if (store.theme === "system") {
      applyTheme();
    }
  });

  // 初始化主题
  applyTheme();
}

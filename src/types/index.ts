// VVhan API Types (Legacy)
export interface VVhanHotlistItem {
  title: string;
  url: string;
  hot: number;
}

export interface VVhanApiResponse {
  success: boolean;
  data: Record<string, VVhanHotlistItem[]>;
}

// Momoyu API Types
export interface MomoyuHotlistItem {
  id: number;
  title: string;
  extra: string; // 热度值，如 "1731 万"
  link: string;
}

export interface MomoyuPlatform {
  id: number;
  sort: number;
  name: string;
  source_key: string;
  icon_color: string;
  data: MomoyuHotlistItem[];
}

export interface MomoyuApiResponse {
  status: number;
  message: string;
  data: MomoyuPlatform[];
}

// Application Types
export interface Platform {
  id: string;
  name: string;
  key: string;
  icon?: string;
  color?: string;
}

export interface HotlistItem {
  id: string;
  title: string;
  url: string;
  hot: number;
  platform: string;
  platformName: string;
}

export interface ApiResponse {
  data: HotlistItem[];
  source: "supabase";
  timestamp: number;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface UserSubscription {
  id: number;
  user_id: string;
  source_id: number;
  platform_key: string;
  platform_name: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

// App State Types
export interface AppState {
  theme: Theme;
  selectedPlatforms: string[];
  searchQuery: string;
  isStealthMode: boolean;
  user: User | null;
  subscriptions: UserSubscription[];
}

// API Error Type
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

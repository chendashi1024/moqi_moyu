import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Source {
  id: number
  name: string
  key: string
  url: string
  created_at: string
}

export interface HotlistItem {
  id: number
  source_id: number
  title: string
  link: string
  hot_score: number
  created_at: string
}

export interface Subscription {
  id: number
  user_id: string
  source_id: number
  created_at: string
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드 전용 Admin 클라이언트 (RLS 우회용)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

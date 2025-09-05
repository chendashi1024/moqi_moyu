-- 创建在线用户表
CREATE TABLE IF NOT EXISTS online_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_online_users_user_id ON online_users(user_id);
CREATE INDEX IF NOT EXISTS idx_online_users_last_seen ON online_users(last_seen);
CREATE INDEX IF NOT EXISTS idx_online_users_session_id ON online_users(session_id);

-- 启用行级安全策略
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户读取在线用户数据
CREATE POLICY "Allow read access to online users" ON online_users
  FOR SELECT USING (true);

-- 创建策略：允许用户插入自己的在线状态
CREATE POLICY "Allow insert own online status" ON online_users
  FOR INSERT WITH CHECK (true);

-- 创建策略：允许用户更新自己的在线状态
CREATE POLICY "Allow update own online status" ON online_users
  FOR UPDATE USING (true);

-- 创建策略：允许用户删除自己的在线状态
CREATE POLICY "Allow delete own online status" ON online_users
  FOR DELETE USING (true);

-- 授权给anon和authenticated角色
GRANT ALL PRIVILEGES ON online_users TO anon;
GRANT ALL PRIVILEGES ON online_users TO authenticated;

-- 创建函数来清理过期的在线用户（超过5分钟未活动）
CREATE OR REPLACE FUNCTION cleanup_offline_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- 创建定时任务每分钟清理一次过期用户（需要pg_cron扩展）
-- SELECT cron.schedule('cleanup-offline-users', '* * * * *', 'SELECT cleanup_offline_users();');
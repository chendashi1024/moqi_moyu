import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface OnlineUser {
  id: string;
  user_id: string;
  session_id: string;
  last_seen: string;
  created_at: string;
}

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // 生成唯一的会话ID
  const generateSessionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 获取用户ID（这里使用简单的方式，实际项目中可能需要从认证系统获取）
  const getUserId = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', userId);
    }
    return userId;
  };

  // 注册用户为在线状态
  const registerOnline = async () => {
    try {
      const userId = getUserId();
      const sessionId = generateSessionId();
      sessionIdRef.current = sessionId;

      // 先删除该用户的所有旧记录
      await supabase
        .from('online_users')
        .delete()
        .eq('user_id', userId);

      // 然后插入新的在线记录
      const { error } = await supabase
        .from('online_users')
        .insert({
          user_id: userId,
          session_id: sessionId,
          last_seen: new Date().toISOString()
        });

      if (error) {
        console.error('注册在线状态失败:', error);
        return false;
      }

      setIsOnline(true);
      return true;
    } catch (error) {
      console.error('注册在线状态异常:', error);
      return false;
    }
  };

  // 更新心跳
  const updateHeartbeat = async () => {
    if (!sessionIdRef.current) return;

    try {
      const { error } = await supabase
        .from('online_users')
        .update({ last_seen: new Date().toISOString() })
        .eq('session_id', sessionIdRef.current);

      if (error) {
        console.error('更新心跳失败:', error);
      }
    } catch (error) {
      console.error('更新心跳异常:', error);
    }
  };

  // 移除在线状态
  const removeOnline = async () => {
    if (!sessionIdRef.current) return;

    try {
      const { error } = await supabase
        .from('online_users')
        .delete()
        .eq('session_id', sessionIdRef.current);

      if (error) {
        console.error('移除在线状态失败:', error);
      }

      setIsOnline(false);
      sessionIdRef.current = null;
    } catch (error) {
      console.error('移除在线状态异常:', error);
    }
  };

  // 获取在线用户数量
  const fetchOnlineCount = async () => {
    try {
      // 先清理过期用户（超过5分钟未活动）
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      await supabase
        .from('online_users')
        .delete()
        .lt('last_seen', fiveMinutesAgo);

      // 获取当前在线用户数量
      const { count, error } = await supabase
        .from('online_users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('获取在线用户数量失败:', error);
        return;
      }

      setOnlineCount(count || 0);
    } catch (error) {
      console.error('获取在线用户数量异常:', error);
    }
  };

  // 设置实时监听
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('online_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        () => {
          // 当有变化时重新获取在线用户数量
          fetchOnlineCount();
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  // 清理资源
  const cleanup = () => {
    // 清理心跳定时器
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // 取消实时订阅
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // 移除在线状态
    removeOnline();
  };

  useEffect(() => {
    // 初始化
    const init = async () => {
      // 注册为在线
      const success = await registerOnline();
      if (success) {
        // 设置心跳定时器（每30秒更新一次）
        heartbeatIntervalRef.current = setInterval(updateHeartbeat, 30000);
        
        // 设置实时监听
        setupRealtimeSubscription();
        
        // 获取初始在线用户数量
        fetchOnlineCount();
      }
    };

    init();

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时停止心跳
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      } else {
        // 页面显示时恢复心跳
        if (sessionIdRef.current && !heartbeatIntervalRef.current) {
          updateHeartbeat(); // 立即更新一次
          heartbeatIntervalRef.current = setInterval(updateHeartbeat, 30000);
        }
      }
    };

    // 监听页面卸载
    const handleBeforeUnload = () => {
      cleanup();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 清理函数
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, []);

  return {
    onlineCount,
    isOnline
  };
};
import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Bell, Inbox, Trash2, CheckCircle } from 'lucide-react';
import { notificationsApi } from '@/api/endpoints';
import { useUiStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';

export function NotificationDrawer() {
  const queryClient = useQueryClient();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isNotificationDrawerOpen, setNotificationDrawer } = useUiStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then((r) => r.data.data || []),
    enabled: isNotificationDrawerOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification removed');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  // Handle outside click to close drawer
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isNotificationDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement;
        // Avoid closing if clicking the toggle button
        if (target.closest('[aria-label="Notifications"]')) return;
        setNotificationDrawer(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isNotificationDrawerOpen, setNotificationDrawer]);

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifications = notifications.filter((n: any) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const typeIcon: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setNotificationDrawer(false)}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative w-screen max-w-md bg-surface h-full flex flex-col shadow-2xl border-l border-border animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-plum" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Notifications</h2>
              <p className="text-xs text-text-secondary">
                {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-background/50">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                filter === 'all' ? 'bg-plum text-white' : 'text-text-secondary hover:bg-background'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                filter === 'unread' ? 'bg-plum text-white' : 'text-text-secondary hover:bg-background'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === 'unread' ? 'bg-white text-plum' : 'bg-primary-100 text-plum-accent'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              className="text-xs font-bold text-plum-accent hover:underline flex items-center gap-1"
            >
              <CheckCircle size={13} />
              Mark all read
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 text-text-secondary">
                <Inbox size={24} />
              </div>
              <p className="font-bold text-text-primary text-sm">All caught up!</p>
              <p className="text-xs text-text-secondary mt-1">No notifications match this filter.</p>
            </div>
          ) : (
            filteredNotifications.map((n: any) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                className={`p-5 flex gap-4 transition-all hover:bg-background/80 relative group cursor-pointer ${
                  !n.isRead ? 'bg-primary-50/50 border-l-4 border-l-plum' : ''
                }`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type] || 'ℹ️'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-text-primary ${!n.isRead ? 'font-bold' : 'font-medium'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-text-secondary mt-2">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Hover Delete Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(n.id);
                  }}
                  className="absolute right-4 top-4 p-1.5 rounded-md hover:bg-red-50 text-border group-hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

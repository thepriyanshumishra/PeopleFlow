import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Trash2, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle, Inbox } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';
import { notificationsApi } from '@/api/endpoints';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

type FilterType = 'all' | 'unread' | 'read';

function typeIcon(type: string) {
  const base = 'w-5 h-5 flex-shrink-0';
  switch (type) {
    case 'success': return <CheckCircle className={`${base} text-green-500`} />;
    case 'error': return <XCircle className={`${base} text-error`} />;
    case 'warning': return <AlertTriangle className={`${base} text-yellow-500`} />;
    default: return <Info className={`${base} text-primary`} />;
  }
}

function groupNotifications(notifications: any[]) {
  const today: any[] = [];
  const yesterday: any[] = [];
  const earlier: any[] = [];
  notifications.forEach(n => {
    const date = new Date(n.createdAt);
    if (isToday(date)) today.push(n);
    else if (isYesterday(date)) yesterday.push(n);
    else earlier.push(n);
  });
  return { today, yesterday, earlier };
}

function NotificationRow({ n, onMarkRead, onDelete }: { n: any; onMarkRead: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <div
      onClick={() => !n.isRead && onMarkRead(n.id)}
      className={`group flex items-start gap-3 px-5 py-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-background/60
        ${!n.isRead ? 'bg-primary-50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
    >
      <div className="mt-0.5">{typeIcon(n.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
            {n.title}
            {!n.isRead && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />}
          </p>
          <span className="text-[11px] text-text-secondary whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(n.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5 text-error" />
      </button>
    </div>
  );
}

function GroupSection({ label, items, onMarkRead, onDelete }: { label: string; items: any[]; onMarkRead: (id: number) => void; onDelete: (id: number) => void }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="px-5 py-2 bg-background border-b border-border">
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">{label}</p>
      </div>
      {items.map(n => (
        <NotificationRow key={n.id} n={n} onMarkRead={onMarkRead} onDelete={onDelete} />
      ))}
    </div>
  );
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then(r => r.data.data || []),
    refetchInterval: 30000,
  });

  const notifications: any[] = data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const { today, yesterday, earlier } = groupNotifications(filtered);

  const tabs: { label: string; value: FilterType; count?: number }[] = [
    { label: 'All', value: 'all', count: notifications.length },
    { label: 'Unread', value: 'unread', count: unreadCount },
    { label: 'Read', value: 'read' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Notification Center"
        subtitle="Stay updated with all your HR notifications"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Notifications' }]}
        icon={<Bell className="w-5 h-5 text-plum-accent" />}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="btn-secondary btn-sm flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="page-wrapper max-w-3xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-4 p-1 bg-surface rounded-xl border border-border w-fit">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${filter === tab.value ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-background'}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold
                  ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-background text-text-secondary'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-3 px-5 py-4 animate-pulse">
                  <div className="w-5 h-5 skeleton rounded-full flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-full" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              variant={filter === 'unread' ? 'notifications' : 'default'}
              title={filter === 'unread' ? "You're all caught up!" : 'No notifications'}
              description={filter === 'unread' ? 'No unread notifications at this time.' : 'No notifications match this filter.'}
            />
          ) : (
            <>
              <GroupSection label="Today" items={today} onMarkRead={id => markReadMutation.mutate(id)} onDelete={id => deleteMutation.mutate(id)} />
              <GroupSection label="Yesterday" items={yesterday} onMarkRead={id => markReadMutation.mutate(id)} onDelete={id => deleteMutation.mutate(id)} />
              <GroupSection label="Earlier" items={earlier} onMarkRead={id => markReadMutation.mutate(id)} onDelete={id => deleteMutation.mutate(id)} />
            </>
          )}
        </div>

        {notifications.length > 0 && (
          <p className="text-center text-xs text-text-secondary mt-4">
            Showing {filtered.length} of {notifications.length} notifications
          </p>
        )}
      </div>
    </div>
  );
}

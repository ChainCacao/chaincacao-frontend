import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotificationStore } from '../../stores/useNotificationStore';
import NotificationItem from './NotificationItem';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-cacao/40 hover:text-cacao transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-cacao/10 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cacao/5">
            <h3 className="text-sm font-black text-cacao">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Tout lire
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-cacao/40 hover:text-cacao">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-cacao/40 text-center py-6">Aucune notification</p>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

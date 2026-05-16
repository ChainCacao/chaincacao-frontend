import { Bell, Check } from 'lucide-react';
import type { Notification } from '../../types/api';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
        notification.isRead ? 'bg-gray-50 opacity-60' : 'bg-white'
      }`}
    >
      <div className="p-2 bg-cacao/10 rounded-lg text-cacao">
        <Bell size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-cacao truncate">{notification.title}</p>
        <p className="text-xs text-cacao/60 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-cacao/40 mt-1">
          {new Date(notification.createdAt).toLocaleString('fr-FR')}
        </p>
      </div>
      {!notification.isRead && (
        <button
          onClick={() => onRead(notification.id)}
          className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
          title="Marquer comme lu"
        >
          <Check size={14} />
        </button>
      )}
    </div>
  );
}

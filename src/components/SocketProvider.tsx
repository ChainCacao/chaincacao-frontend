import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { connectSocket, disconnectSocket } from '../services/socket.service';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  return <>{children}</>;
}

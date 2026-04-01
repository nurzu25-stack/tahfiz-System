import { useAppStore, timeAgo } from '../../store/AppContext';
import { Bell, BookOpen, Calendar, DollarSign, Trophy, Megaphone, CheckCheck } from 'lucide-react';

type NotifType = 'hafazan' | 'attendance' | 'payment' | 'achievement' | 'announcement';

const typeConfig: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  hafazan:      { icon: <BookOpen size={18} />,    color: 'text-green-600',  bg: 'bg-green-50' },
  attendance:   { icon: <Calendar size={18} />,    color: 'text-blue-600',   bg: 'bg-blue-50' },
  payment:      { icon: <DollarSign size={18} />,  color: 'text-purple-600', bg: 'bg-purple-50' },
  achievement:  { icon: <Trophy size={18} />,      color: 'text-yellow-600', bg: 'bg-yellow-50' },
  announcement: { icon: <Megaphone size={18} />,   color: 'text-gray-600',   bg: 'bg-gray-50' },
};

export function Notifications() {
  const { state, dispatch } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const parentUser = state.users.find(u => u.name === authUser.name && u.role === 'parent') ?? state.users.find(u => u.role === 'parent')!;
  const child = state.students.find(s => s.id === parentUser?.linkedId) ?? state.students[0];

  const notifs = [...state.notifications.filter(n => n.studentId === child?.id)].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => dispatch({ type: 'MARK_ALL_READ', payload: { studentId: child?.id ?? '' } });
  const markRead = (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { id } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Pusat Pemberitahuan</h2>
          <p className="text-gray-600 mt-1">{unread > 0 ? `${unread} pemberitahuan belum dibaca` : 'Semua sudah dibaca!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            <CheckCheck size={16} /> Tandakan Semua Dibaca
          </button>
        )}
      </div>

      {notifs.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Bell size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Tiada pemberitahuan lagi.</p>
        </div>
      )}

      <div className="space-y-3">
        {notifs.map(notif => {
          const cfg = typeConfig[notif.type as NotifType] ?? typeConfig.announcement;
          return (
            <div key={notif.id}
              onClick={() => !notif.read && markRead(notif.id)}
              className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${notif.read ? 'bg-white border-gray-100 opacity-70' : 'bg-white border-green-200 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-full ${cfg.bg} ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                  {!notif.read && <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-1" />}
                </div>
                <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-gray-400 text-xs mt-1">{timeAgo(notif.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
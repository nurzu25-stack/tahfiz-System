import { Trophy, Award, Star, Shield } from 'lucide-react';
import { useAppStore, getStudentStreak, getStudentRank, getClassLeaderboard, getStudentLastRecords } from '../../store/AppContext';

export function Achievements() {
  const { state } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const studentUser = state.users.find(u => u.name === authUser.name && u.role === 'student') ?? state.users.find(u => u.role === 'student')!;
  const student = state.students.find(s => s.id === studentUser?.linkedId) ?? state.students[0];
  const streak = getStudentStreak(state, student?.id ?? '');
  const rank = getStudentRank(student?.juzukCompleted ?? 0);
  const leaderboard = getClassLeaderboard(state, student?.classId ?? 'c1');
  const records = getStudentLastRecords(state, student?.id ?? '', 100);

  // Badge definitions
  const badges = [
    { name: 'Warrior', icon: '🛡️', description: 'Completed 1 Juzuk', earned: (student?.juzukCompleted ?? 0) >= 1, date: 'Sep 2025' },
    { name: 'Elite', icon: '🥈', description: 'Completed 5 Juzuk', earned: (student?.juzukCompleted ?? 0) >= 5, date: 'Jan 2026' },
    { name: 'Legend Al-Hafiz', icon: '🏆', description: 'Complete 30 Juzuk', earned: (student?.juzukCompleted ?? 0) >= 30, date: 'Not yet earned' },
  ];

  // Dynamic achievements
  const hasStreak30 = streak >= 30;
  const maxAyahDay = records.reduce((max, r) => Math.max(max, r.ayahCount ?? 0), 0);
  const hasQuickLearner = maxAyahDay >= 50;
  const totalDays = new Set(records.map(r => r.date)).size;
  const has100days = totalDays >= 100;
  const excellentCount = records.filter(r => r.sabaq.grade === 'Mumtaz').length;
  const hasExcellence = excellentCount >= 10;

  const achievements = [
    { title: 'Kehadiran Terbaik', description: '30 hari berturutan', icon: Star, color: 'blue', earned: hasStreak30 },
    { title: 'Pelajar Pantas', description: 'Hafal 50 Ayat dalam sehari', icon: Award, color: 'green', earned: hasQuickLearner },
    { title: 'Raja Konsistensi', description: '100 hari belajar', icon: Trophy, color: 'purple', earned: has100days },
    { title: 'Anugerah Kecemerlangan', description: '10 gred Mumtaz berturutan', icon: Shield, color: 'orange', earned: hasExcellence },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-semibold text-gray-900">Achievements & Ranking</h2><p className="text-gray-600 mt-1">Your badges, awards, and class ranking</p></div>

      {/* Current Rank */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="text-6xl">{rank.icon}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900">{rank.name}</h3>
            <p className="text-gray-700 mt-1">{student?.juzukCompleted ?? 0} Juzuk Diselesaikan · 🔥 {streak} hari berturutan</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Kemajuan ke {rank.nextRank}</span><span>{rank.progressToNext}%</span>
              </div>
              <div className="bg-white rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${rank.progressToNext}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AKMAL Badges */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Lencana AKMAL</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map(badge => (
            <div key={badge.name} className={`p-6 rounded-xl border-2 text-center ${badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h4 className="font-semibold text-gray-900 text-lg">{badge.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
              <div className="mt-3">
                {badge.earned
                  ? <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium inline-block">✓ Diperoleh: {badge.date}</div>
                  : <div className="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs font-medium inline-block">🔒 Terkunci</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Achievements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian Khas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`p-4 rounded-lg border-2 ${a.earned ? colorClasses[a.color] : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-8 h-8 ${a.earned ? '' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{a.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                    {a.earned && <div className="mt-2 text-xs font-medium text-green-600">✓ Dibuka</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Papan Leder Kelas — {state.classes.find(c => c.id === student?.classId)?.name}</h3>
        <div className="space-y-2">
          {leaderboard.map(entry => (
            <div key={entry.rank} className={`flex items-center justify-between p-4 rounded-lg ${entry.id === student?.id ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' : entry.rank === 2 ? 'bg-gray-300 text-gray-700' : entry.rank === 3 ? 'bg-orange-400 text-orange-900' : 'bg-gray-200 text-gray-600'}`}>{entry.rank}</div>
                <div>
                  <p className="font-medium text-gray-900">{entry.name}{entry.id === student?.id ? ' (Anda)' : ''}</p>
                  <p className="text-sm text-gray-600">{entry.progress}</p>
                </div>
              </div>
              {entry.badge && <div className="text-2xl">{entry.badge}</div>}
            </div>
          ))}
          {leaderboard.length === 0 && <p className="text-gray-400 text-sm">Tiada rakan sekelas dijumpai.</p>}
        </div>
      </div>

      {/* Motivation */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border-2 border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">🌟 Anda Sangat Hebat!</h4>
        <p className="text-green-800">
          {leaderboard.findIndex(e => e.id === student?.id) === 0
            ? "Anda #1 dalam kelas! Teruskan kepimpinan! 👑"
            : `Anda #${leaderboard.findIndex(e => e.id === student?.id) + 1} dalam kelas! ${rank.progressToNext < 100 ? `Selesaikan ${Math.ceil((29 - (student?.juzukCompleted ?? 0)) * 0.3)} juzuk lagi untuk mencapai pangkat seterusnya!` : ''}`}
        </p>
      </div>
    </div>
  );
}

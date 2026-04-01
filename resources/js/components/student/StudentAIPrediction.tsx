import { Brain, TrendingUp, Calendar, Star, Zap, BookOpen } from 'lucide-react';
import { useAppStore, computeAIPrediction, getStudentStreak } from '../../store/AppContext';

export function StudentAIPrediction() {
  const { state } = useAppStore();

  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const studentUser = state.users.find(u => u.name === authUser.name && u.role === 'student') ?? state.users.find(u => u.role === 'student')!;
  const student = state.students.find(s => s.id === studentUser?.linkedId) ?? state.students[0];
  const streak = getStudentStreak(state, student?.id ?? '');

  const pred = student ? computeAIPrediction(state, student.id) : null;

  const trendColor = (t: string) =>
    t === 'Mumtaz' ? 'from-green-400 to-emerald-600' :
    t === 'Jayyid' ? 'from-blue-400 to-blue-600' :
    'from-orange-400 to-orange-600';

  const trendBg = (t: string) =>
    t === 'Mumtaz' ? 'bg-green-50 border-green-300 text-green-800' :
    t === 'Jayyid' ? 'bg-blue-50 border-blue-300 text-blue-800' :
    'bg-orange-50 border-orange-300 text-orange-800';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Ramalan AI Saya</h2>
        <p className="text-gray-600 mt-1">Anggaran khatam dan cadangan peribadi berdasarkan kemajuan hafazan anda</p>
      </div>

      {!pred ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
          <Brain className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>Mula merekod hafazan untuk menjana ramalan AI anda!</p>
        </div>
      ) : (
        <>
          {/* Hero prediction card */}
          <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${trendColor(pred.performanceTrend)} shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Trend Prestasi Anda</p>
                <h3 className="text-3xl font-bold">{pred.performanceTrend}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-white/80 text-xs mb-1">🎯 Anggaran Khatam</p>
                <p className="text-white font-bold text-lg">{pred.estimatedCompletion}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-white/80 text-xs mb-1">🔥 Hari Berturutan</p>
                <p className="text-white font-bold text-lg">{streak} hari</p>
              </div>
            </div>
          </div>

          {/* Progress overview */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Calendar className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', label: 'Kemajuan Semasa', value: pred.currentProgress },
              { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', label: 'Keyakinan AI', value: pred.confidence },
              { icon: <BookOpen className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', label: 'Purata Ayat/Hari', value: pred.avgAyahPerDay },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>{item.icon}</div>
                <p className="text-xs text-gray-600">{item.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Attendance rate bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📅 Kadar Kehadiran</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                  style={{ width: pred.attendanceRate }}
                />
              </div>
              <span className="text-lg font-bold text-green-600">{pred.attendanceRate}</span>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className={`rounded-xl border-2 p-6 ${trendBg(pred.performanceTrend)}`}>
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6" />
              <h3 className="font-bold text-lg">Cadangan AI Untuk Anda</h3>
            </div>
            <p className="text-sm leading-relaxed">{pred.recommendation}</p>
          </div>

          {/* Motivational tip */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-purple-900">💡 Tips Untuk Mencapai Sasaran</h3>
            </div>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Hafal sekurang-kurangnya 5 ayat setiap hari secara konsisten</li>
              <li>• Ulang kaji Sabaqi sebelum memulakan Sabaq baharu</li>
              <li>• Hadiri setiap sesi — kehadiran konsisten meningkatkan ingatan</li>
              <li>• Kongsi kemajuan anda dengan ibu bapa untuk sokongan moral</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

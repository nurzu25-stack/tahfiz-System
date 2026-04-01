import { Brain, TrendingUp, Calendar, Star, BookOpen, Users } from 'lucide-react';
import { useAppStore, computeAIPrediction } from '../../store/AppContext';

export function ParentAIPrediction() {
  const { state } = useAppStore();

  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const parentUser = state.users.find(u => u.name === authUser.name && u.role === 'parent') ?? state.users.find(u => u.role === 'parent')!;
  const child = state.students.find(s => s.id === parentUser?.linkedId) ?? state.students[0];

  const pred = child ? computeAIPrediction(state, child.id) : null;
  const childClass = state.classes.find(c => c.id === child?.classId);
  const teacher = state.teachers.find(t => t.id === child?.teacherId);

  const trendColor = (t: string) =>
    t === 'Mumtaz' ? { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' } :
    t === 'Jayyid' ? { bg: 'bg-blue-100',  text: 'text-blue-700',  border: 'border-blue-300'  } :
                     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };

  const tc = pred ? trendColor(pred.performanceTrend) : { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Ramalan AI — {child?.name ?? 'Anak Anda'}</h2>
        <p className="text-gray-600 mt-1">Anggaran khatam Al-Quran dan cadangan peribadi untuk anak anda</p>
      </div>

      {/* Child info banner */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-200 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {child?.name?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{child?.name ?? '—'}</p>
          <p className="text-sm text-gray-600">Kelas: <strong>{childClass?.name ?? '—'}</strong> · Ustaz/Ustazah: <strong>{teacher?.name ?? '—'}</strong></p>
          <p className="text-sm text-green-700 font-semibold mt-0.5">{child?.juzukCompleted ?? 0} / 30 Juzuk Dihafal</p>
        </div>
      </div>

      {!pred ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
          <Brain className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>Tiada data hafazan yang mencukupi untuk menjana ramalan.</p>
        </div>
      ) : (
        <>
          {/* Performance trend card */}
          <div className={`rounded-xl p-6 border-2 ${tc.bg} ${tc.border}`}>
            <div className="flex items-center gap-3 mb-2">
              <Star className={`w-6 h-6 ${tc.text}`} />
              <h3 className={`text-lg font-bold ${tc.text}`}>Trend Prestasi: {pred.performanceTrend}</h3>
            </div>
            <p className="text-gray-700 text-sm">
              {pred.performanceTrend === 'Mumtaz'
                ? '🌟 Anak anda menunjukkan prestasi cemerlang! Teruskan dokongan dan galakkan.'
                : pred.performanceTrend === 'Jayyid'
                ? '👍 Anak anda berkembang dengan baik. Konsistensi adalah kunci kejayaan.'
                : '⚠️ Anak anda memerlukan perhatian lebih. Sila berbincang dengan ustaz/ustazah.'}
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Calendar className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50 border-purple-200', label: 'Anggaran Khatam', value: pred.estimatedCompletion },
              { icon: <TrendingUp className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50 border-blue-200',     label: 'Tahap Keyakinan AI', value: pred.confidence },
              { icon: <BookOpen className="w-6 h-6 text-green-600" />, bg: 'bg-green-50 border-green-200',    label: 'Purata Ayat/Hari', value: pred.avgAyahPerDay },
            ].map(item => (
              <div key={item.label} className={`rounded-xl border p-5 ${item.bg} flex items-center gap-4`}>
                <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance & Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Pembelajaran</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-600">Kadar Kehadiran</p>
                  <p className="text-xl font-bold text-blue-600">{pred.attendanceRate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg"><BookOpen className="w-5 h-5 text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-600">Kemajuan Semasa</p>
                  <p className="text-xl font-bold text-green-600">{pred.currentProgress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Cadangan AI</h3>
            </div>
            <p className="text-purple-800 text-sm">{pred.recommendation}</p>
          </div>
        </>
      )}
    </div>
  );
}

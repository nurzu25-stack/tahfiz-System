import { useAppStore, getStudentLastRecords, getStudentStreak } from '../../store/AppContext';
import { Target, Calendar, BookOpen, TrendingUp } from 'lucide-react';

export function HafazanTarget() {
  const { state } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const studentUser = state.users.find(u => u.name === authUser.name && u.role === 'student') ?? state.users.find(u => u.role === 'student')!;
  const student = state.students.find(s => s.id === studentUser?.linkedId) ?? state.students[0];
  const records = getStudentLastRecords(state, student?.id ?? '', 365);
  const streak = getStudentStreak(state, student?.id ?? '');

  // Compute weekly / monthly / yearly progress
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const weeklyAyah = records.filter(r => new Date(r.date) >= weekAgo).reduce((s, r) => s + (r.ayahCount ?? 0), 0);
  const monthlyAyah = records.filter(r => new Date(r.date) >= monthStart).reduce((s, r) => s + (r.ayahCount ?? 0), 0);
  const yearlyAyah = records.filter(r => new Date(r.date) >= yearStart).reduce((s, r) => s + (r.ayahCount ?? 0), 0);

  // Targets
  const weeklyTarget = 100;   // ayah
  const monthlyTarget = 400;  // ayah
  const yearlyTarget = 4800;  // ayah (full quran ≈ 6236)

  const bar = (val: number, target: number) => Math.min(100, Math.round((val / target) * 100));

  const targets = [
    { label: 'Sasaran Mingguan', current: weeklyAyah, target: weeklyTarget, icon: <Calendar size={24} />, color: 'blue', period: 'Minggu Ini' },
    { label: 'Sasaran Bulanan', current: monthlyAyah, target: monthlyTarget, icon: <Target size={24} />, color: 'green', period: 'Bulan Ini' },
    { label: 'Sasaran Tahunan', current: yearlyAyah, target: yearlyTarget, icon: <TrendingUp size={24} />, color: 'purple', period: 'Tahun Ini' },
  ];

  const bgMap: Record<string, string> = { blue: 'bg-blue-50', green: 'bg-green-50', purple: 'bg-purple-50' };
  const textMap: Record<string, string> = { blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600' };
  const barMap: Record<string, string> = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500' };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-semibold text-gray-900">Sasaran Hafazan</h2><p className="text-gray-600 mt-1">Jejaki sasaran hafazan anda</p></div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hari Berturutan', value: `🔥 ${streak} hari`, color: 'text-orange-600' },
          { label: 'Jumlah Rekod', value: records.length, color: 'text-blue-600' },
          { label: 'Juzuk Selesai', value: `${student?.juzukCompleted ?? 0} / 30`, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Targets */}
      {targets.map(t => (
        <div key={t.label} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${bgMap[t.color]} ${textMap[t.color]} rounded-lg flex items-center justify-center`}>{t.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{t.label}</h3>
              <p className="text-sm text-gray-500">{t.period}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-2xl font-bold ${textMap[t.color]}`}>{t.current}</p>
              <p className="text-sm text-gray-500">/ {t.target} ayah</p>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${barMap[t.color]} rounded-full transition-all`} style={{ width: `${bar(t.current, t.target)}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{bar(t.current, t.target)}% selesai</span>
            <span>{Math.max(0, t.target - t.current)} ayat tinggal</span>
          </div>
        </div>
      ))}

      {/* Projected completion */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-green-600" size={22} />
          <h3 className="font-semibold text-green-900">Unjuran Khatam Al-Quran</h3>
        </div>
        {weeklyAyah > 0 ? (
          <>
            <p className="text-3xl font-bold text-green-700">{Math.ceil((6236 - (student?.juzukCompleted ?? 0) * 208) / (weeklyAyah / 7))} hari</p>
            <p className="text-sm text-green-700 mt-1">Berdasarkan kadar semasa ~{Math.round(weeklyAyah / 7)} ayat/hari</p>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Mula rekod hafazan untuk lihat unjuran anda!</p>
        )}
      </div>
    </div>
  );
}

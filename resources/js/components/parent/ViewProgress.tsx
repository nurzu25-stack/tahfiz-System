import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppStore } from '../../store/AppContext';
import { BookOpen, TrendingUp, Star } from 'lucide-react';
import { HafazanRecord } from '../../store/mockData';

interface ViewProgressProps {
  childId: string;
}

export function ViewProgress({ childId }: ViewProgressProps) {
  const { state } = useAppStore();
  const [records, setRecords] = useState<HafazanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Identify child from global state for static details
  const child = state.students.find(s => String(s.id) === String(childId));
  const progressPct = child ? Math.round((child.juzukCompleted / 30) * 100) : 0;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`/api/hafazan-records?student_id=${childId}&limit=10`);
        setRecords(resp.data);
      } catch (err) {
        console.error('Failed to fetch hafazan records', err);
      } finally {
        setLoading(false);
      }
    };
    if (childId) fetchRecords();
  }, [childId]);

  const gradeColor = (g: string) =>
    g === 'Mumtaz' ? 'bg-green-100 text-green-700' :
    g === 'Jayyid' ? 'bg-blue-100 text-blue-700' :
    g === 'Maqbul' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

  // Monthly summary (current month)
  const now = new Date();
  const monthRecords = records.filter(r => new Date(r.date).getMonth() === now.getMonth());
  const monthAyah = monthRecords.reduce((sum, r) => sum + (r.ayahCount ?? 0), 0);

  if (loading) return <div className="p-8 text-slate-500">Memuatkan rekod hafazan...</div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-semibold text-gray-900">Kemajuan Hafazan</h2><p className="text-gray-600 mt-1">Rekod kemajuan terperinci untuk {child?.name}</p></div>

      {/* Overall progress */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">{child?.name?.charAt(0)}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{child?.name}</h3>
            <p className="text-gray-600 text-sm">{child?.juzukCompleted} / 30 Juzuk Diselesaikan</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <span>Kemajuan Keseluruhan</span><span className="font-bold text-green-700">{progressPct}%</span>
        </div>
        <div className="h-4 bg-white rounded-full overflow-hidden border border-green-200">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Bulan Ini', value: `${monthAyah} ayat`, icon: <TrendingUp size={18} /> },
            { label: 'Jumlah Rekod', value: records.length, icon: <BookOpen size={18} /> },
            { label: 'Pencapaian Seterusnya', value: `${(child?.juzukCompleted ?? 0) + 1} Juzuk`, icon: <Star size={18} /> },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-lg p-3 text-center">
              <div className="flex justify-center text-green-600 mb-1">{m.icon}</div>
              <p className="text-lg font-bold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Hafazan Records */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rekod Hafazan Terkini</h3>
        {records.length === 0 && <p className="text-gray-400 text-sm">Tiada rekod lagi.</p>}
        <div className="space-y-4">
          {records.map(rec => (
            <div key={rec.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900 text-sm">{new Date(rec.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="text-xs text-gray-500">{rec.ayahCount} ayat direkod</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'Sabaq', data: rec.sabaq, color: 'green' },
                  { type: 'Sabaqi', data: rec.sabaqi, color: 'blue' },
                  { type: 'Manzil', data: rec.manzil, color: 'purple' },
                ].map(({ type, data, color }) => (
                  <div key={type} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{type}</p>
                    <p className="text-sm font-bold text-slate-800">{data.surah || '—'}</p>
                    {data.surah && <p className="text-[11px] text-slate-500 font-medium">Ayah {data.from}–{data.to}</p>}
                    {data.grade && <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${gradeColor(data.grade)}`}>{data.grade}</span>}
                  </div>
                ))}
              </div>
              {rec.remarks && <p className="mt-3 text-sm text-gray-600 italic">💬 {rec.remarks}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

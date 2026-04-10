import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export function UploadReport() {
  const { state, dispatch } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const teacher = state.teachers.find(t => 
    t.email === authUser.email || 
    (authUser.name && t.name.toLowerCase().includes(authUser.name.toLowerCase().split(' ').slice(-1)[0]))
  ) ?? state.teachers[0];
  const teacherClasses = state.classes.filter(c => teacher?.classIds.some(cid => String(cid) === String(c.id)));
  const [classId, setClassId] = useState(teacherClasses[0]?.id ?? '');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [saved, setSaved] = useState(false);
  const inCls = 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';

  const pastReports = state.reports
    .filter(r => r.teacherId === teacher?.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_REPORT', payload: { teacherId: teacher?.id ?? 't1', classId, date: new Date().toISOString().split('T')[0], content, fileName: fileName || undefined } });
    setContent(''); setFileName('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-semibold text-gray-900">Muat Naik Laporan Harian</h2><p className="text-gray-600 mt-1">Hantar laporan aktiviti dan kemajuan kelas anda</p></div>

      {saved && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="font-semibold text-green-900">Laporan berjaya diserahkan!</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kelas *</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className={inCls}>
              {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kandungan Laporan *</label>
            <textarea required rows={5} value={content} onChange={e => setContent(e.target.value)} placeholder="Huraikan aktiviti kelas hari ini, kemajuan pelajar, dan sebarang pemerhatian penting..." className={inCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lampiran (pilihan)</label>
            <div className="flex items-center gap-3">
              <input type="text" placeholder="e.g. report_march2026.pdf" value={fileName} onChange={e => setFileName(e.target.value)} className={inCls} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"><Upload className="w-5 h-5" />Hantar Laporan</button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sejarah Penghantaran</h3>
        {pastReports.length === 0 && <p className="text-gray-400 text-sm">Tiada laporan lalu.</p>}
        <div className="space-y-3">
          {pastReports.map(r => (
            <div key={r.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm">{state.classes.find(c => c.id === r.classId)?.name ?? r.classId}</p>
                  <span className="text-xs text-gray-500">{r.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.content}</p>
                {r.fileName && <p className="text-xs text-blue-600 mt-1">📎 {r.fileName}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { AttendanceStatus } from '../../store/mockData';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function ManageAttendance() {
  const { state, dispatch } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const teacher = state.teachers.find(t => t.name.includes(authUser.name?.split(' ').slice(-1)[0] ?? '')) ?? state.teachers[0];
  const teacherClasses = state.classes.filter(c => teacher?.classIds.includes(c.id));

  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id ?? '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [saved, setSaved] = useState(false);

  const studentsInClass = state.students.filter(s => s.classId === selectedClassId);

  const toggle = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: { status, remarks: prev[studentId]?.remarks ?? '' } }));
  };

  const getStatusForStudent = (studentId: string): AttendanceStatus => {
    if (attendanceMap[studentId]) return attendanceMap[studentId].status;
    const existing = state.attendance.find(a => a.studentId === studentId && a.date === date);
    return existing?.status ?? 'Hadir';
  };

  const handleSave = () => {
    const records = studentsInClass.map(s => ({
      studentId: s.id,
      classId: selectedClassId,
      date,
      status: getStatusForStudent(s.id),
      remarks: attendanceMap[s.id]?.remarks ?? '',
    }));
    dispatch({ type: 'MARK_ATTENDANCE', payload: records });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const todayStats = {
    present: studentsInClass.filter(s => getStatusForStudent(s.id) === 'Hadir').length,
    absent: studentsInClass.filter(s => getStatusForStudent(s.id) === 'Tidak Hadir').length,
    late: studentsInClass.filter(s => getStatusForStudent(s.id) === 'Lewat').length,
    total: studentsInClass.length,
  };

  const statusBtn = (sid: string, status: AttendanceStatus, label: string, color: string) => (
    <button onClick={() => toggle(sid, status)}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${getStatusForStudent(sid) === status ? `${color} border-current` : 'text-gray-400 border-gray-200 hover:border-gray-400'}`}>
      {status === 'Hadir' ? <CheckCircle2 size={13} /> : status === 'Tidak Hadir' ? <XCircle size={13} /> : <Clock size={13} />}
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-semibold text-gray-900">Urus Kehadiran</h2><p className="text-gray-600 mt-1">Tandakan dan rekod kehadiran pelajar</p></div>
      </div>

      {saved && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <p className="font-semibold text-green-900">Kehadiran disimpan! Ibu bapa telah dimaklumkan.</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); setAttendanceMap({}); }} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => { setDate(e.target.value); setAttendanceMap({}); }} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Jumlah', value: todayStats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Hadir', value: todayStats.present, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tidak Hadir', value: todayStats.absent, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Lewat', value: todayStats.late, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Pelajar — {state.classes.find(c => c.id === selectedClassId)?.name}</span>
            <div className="flex gap-2">
              <button onClick={() => { const m: typeof attendanceMap = {}; studentsInClass.forEach(s => { m[s.id] = { status: 'Hadir', remarks: '' }; }); setAttendanceMap(m); }} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200">Tandakan Semua Hadir</button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {studentsInClass.map(student => (
            <div key={student.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                <p className="text-xs text-gray-500">{student.juzukCompleted} Juzuk dihafal</p>
              </div>
              <div className="flex gap-2">
                {statusBtn(student.id, 'Hadir', 'Hadir', 'text-green-600 bg-green-50')}
                {statusBtn(student.id, 'Lewat', 'Lewat', 'text-orange-600 bg-orange-50')}
                {statusBtn(student.id, 'Tidak Hadir', 'Tidak Hadir', 'text-red-600 bg-red-50')}
              </div>
              {getStatusForStudent(student.id) === 'Tidak Hadir' && (
                <input
                  type="text"
                  placeholder="Sebab..."
                  className="text-xs px-2 py-1 border border-gray-200 rounded w-32 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={attendanceMap[student.id]?.remarks ?? ''}
                  onChange={e => setAttendanceMap(prev => ({ ...prev, [student.id]: { ...prev[student.id], status: 'Tidak Hadir', remarks: e.target.value } }))}
                />
              )}
            </div>
          ))}
          {studentsInClass.length === 0 && <p className="px-6 py-10 text-center text-gray-400 text-sm">Tiada pelajar dalam kelas ini.</p>}
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button onClick={handleSave} className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Simpan Kehadiran</button>
        </div>
      </div>
    </div>
  );
}

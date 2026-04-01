import { useAppStore, getStudentAttendanceRate, getStudentLastRecords } from '../../store/AppContext';
import { Eye } from 'lucide-react';
import { useState } from 'react';

export function StudentList() {
  const { state } = useAppStore();
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
  const teacher = state.teachers.find(t => t.name.includes(authUser.name?.split(' ').slice(-1)[0] ?? '')) ?? state.teachers[0];
  const teacherClasses = state.classes.filter(c => teacher?.classIds.includes(c.id));
  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id ?? '');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const students = state.students.filter(s => s.classId === selectedClassId);

  const getLastRecord = (sid: string) => getStudentLastRecords(state, sid, 1)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-semibold text-gray-900">My Students</h2><p className="text-gray-600 mt-1">View all students in your classes</p></div>
        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map(student => {
          const attendance = getStudentAttendanceRate(state, student.id);
          const lastRec = getLastRecord(student.id);
          return (
            <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">{student.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">Age {student.age} · Since {student.enrolledDate}</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">{student.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Hafazan Progress:</span><span className="font-semibold text-green-600">{student.juzukCompleted} / 30 Juzuk</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Attendance Rate:</span><span className="font-semibold text-gray-900">{attendance}%</span></div>
                {lastRec && <div className="flex justify-between"><span className="text-gray-600">Last Sabaq:</span><span className="text-gray-900">{lastRec.sabaq.surah} · {lastRec.sabaq.grade}</span></div>}
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round((student.juzukCompleted / 30) * 100)}%` }} />
                </div>
              </div>
              <button onClick={() => setSelectedStudent(student)} className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Eye className="w-4 h-4" /> View Profile
              </button>
            </div>
          );
        })}
        {students.length === 0 && <div className="col-span-2 p-10 text-center text-gray-400">No students in this class.</div>}
      </div>

      {/* View student modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">Student Profile</h3><button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <div className="space-y-3">
              {[
                ['Name', selectedStudent.name],
                ['Age', selectedStudent.age],
                ['Class', state.classes.find(c => c.id === selectedStudent.classId)?.name],
                ['Juzuk Completed', `${selectedStudent.juzukCompleted} / 30`],
                ['Attendance', `${getStudentAttendanceRate(state, selectedStudent.id)}%`],
                ['Status', selectedStudent.status],
                ['Enrolled', selectedStudent.enrolledDate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{k}</span>
                  <span className="font-medium text-gray-900 text-sm">{String(v)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedStudent(null)} className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { genId } from '../../store/mockData';

export function ManageStudents() {
  const { state, dispatch } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [addForm, setAddForm] = useState({ name: '', age: '', classId: 'c1', teacherId: 't1', parentId: 'u4' });
  const [editForm, setEditForm] = useState<any>({});

  const getClassName = (classId: string) => state.classes.find(c => c.id === classId)?.name ?? classId;
  const getTeacherName = (teacherId: string) => state.teachers.find(t => t.id === teacherId)?.name ?? teacherId;
  const getAttendance = (studentId: string) => {
    const recs = state.attendance.filter(a => a.studentId === studentId);
    if (!recs.length) return 'N/A';
    const present = recs.filter(a => a.status !== 'Tidak Hadir').length;
    return `${Math.round((present / recs.length) * 100)}%`;
  };

  const filtered = state.students.filter(s =>
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || getClassName(s.classId).toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!classFilter || s.classId === classFilter)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_STUDENT', payload: { name: addForm.name, age: Number(addForm.age), classId: addForm.classId, teacherId: addForm.teacherId, parentId: addForm.parentId } });
    setAddForm({ name: '', age: '', classId: 'c1', teacherId: 't1', parentId: 'u4' });
    setShowAddModal(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'EDIT_STUDENT', payload: { id: editForm.id, name: editForm.name, age: Number(editForm.age), classId: editForm.classId } });
    setShowEditModal(false);
  };

  const handleDelete = (student: any) => {
    if (confirm(`Adakah anda pasti mahu memadam ${student.name}?`)) {
      dispatch({ type: 'DELETE_STUDENT', payload: { id: student.id } });
    }
  };

  const inputCls = 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Urus Pelajar</h2>
          <p className="text-gray-600 mt-1">Lihat dan urus semua rekod pelajar ({state.students.length} jumlah)</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-5 h-5" /> Tambah Pelajar
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari pelajar..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Semua Kelas</option>
          {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Nama','Umur','Kelas','Ustaz/Ustazah','Hafazan','Kehadiran','Status','Tindakan'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getClassName(student.classId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getTeacherName(student.teacherId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{student.juzukCompleted} Juzuk</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAttendance(student.id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${student.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedStudent(student); setShowViewModal(true); }} className="p-1 text-gray-400 hover:text-green-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditForm({ ...student }); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(student)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-500">Tiada pelajar ditemui.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tambah Pelajar Baharu</h3>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Penuh</label><input required className={inputCls} placeholder="Nama pelajar" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Umur</label><input type="number" required className={inputCls} placeholder="Umur" value={addForm.age} onChange={e => setAddForm({ ...addForm, age: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                  <select required className={inputCls} value={addForm.classId} onChange={e => setAddForm({ ...addForm, classId: e.target.value })}>
                    {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Ustaz / Ustazah</label>
                  <select required className={inputCls} value={addForm.teacherId} onChange={e => setAddForm({ ...addForm, teacherId: e.target.value })}>
                    {state.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Tambah Pelajar</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Kemaskini Pelajar</h3>
            <form className="space-y-4" onSubmit={handleEdit}>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Nama Penuh</label><input required className={inputCls} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Umur</label><input type="number" required className={inputCls} value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                <select className={inputCls} value={editForm.classId} onChange={e => setEditForm({ ...editForm, classId: e.target.value })}>
                  {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Profil Pelajar</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Nama Penuh', selectedStudent.name],
                ['Umur', selectedStudent.age],
                ['Kelas', getClassName(selectedStudent.classId)],
                ['Ustaz / Ustazah', getTeacherName(selectedStudent.teacherId)],
                ['Kemajuan Hafazan', `${selectedStudent.juzukCompleted} / 30 Juzuk`],
                ['Kehadiran', getAttendance(selectedStudent.id)],
                ['Status', selectedStudent.status],
                ['Tarikh Daftar', selectedStudent.enrolledDate],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="font-medium text-gray-900">{String(val)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full mt-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
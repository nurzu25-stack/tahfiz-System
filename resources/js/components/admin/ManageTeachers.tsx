import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';

export function ManageTeachers() {
  const { state, dispatch } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', specialization: '' });
  const inputCls = 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';

  const getStudentCount = (teacherId: string) =>
    state.students.filter(s => s.teacherId === teacherId).length;

  const getClassNames = (classIds: string[]) =>
    classIds.map(id => state.classes.find(c => c.id === id)?.name ?? id).join(', ') || '—';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TEACHER', payload: { name: addForm.name, email: addForm.email, phone: addForm.phone, specialization: addForm.specialization, classIds: [] } });
    setAddForm({ name: '', email: '', phone: '', specialization: '' });
    setShowAddModal(false);
  };

  const handleDelete = (teacher: any) => {
    if (confirm(`Padam ${teacher.name} daripada sistem?`)) {
      dispatch({ type: 'DELETE_TEACHER', payload: { id: teacher.id } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Teachers & Classes</h2>
          <p className="text-gray-600 mt-1">Manage teachers and assign classes ({state.teachers.length} total)</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="w-5 h-5" /> Tambah Guru
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.teachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">{teacher.status}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(teacher)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Emel:</span><span className="text-gray-900 truncate ml-2">{teacher.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Telefon:</span><span className="text-gray-900">{teacher.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Kelas:</span><span className="text-gray-900">{getClassNames(teacher.classIds)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pelajar:</span><span className="font-semibold text-green-600">{getStudentCount(teacher.id)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Kepakaran:</span><span className="text-gray-900">{teacher.specialization}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={() => dispatch({ type: 'EDIT_TEACHER', payload: { id: teacher.id, status: teacher.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif' } })}
                className={`w-full py-2 rounded-lg text-sm font-medium ${teacher.status === 'Aktif' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                {teacher.status === 'Aktif' ? 'Tidak Aktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Semua Kelas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.classes.map(cls => {
            const teacher = state.teachers.find(t => t.id === cls.teacherId);
            const studentCount = cls.studentIds.length;
            return (
              <div key={cls.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{studentCount} / {cls.capacity} pelajar</p>
                <p className="text-sm text-gray-500 mt-1">{teacher?.name ?? '—'}</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${Math.min(100, (studentCount / cls.capacity) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tambah Guru Baharu</h3>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><input required className={inputCls} placeholder="Ustaz / Ustazah name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" required className={inputCls} placeholder="teacher@akmal.edu.my" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" required className={inputCls} placeholder="+60 12-345 6789" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label><input className={inputCls} placeholder="e.g. Hafazan & Tajweed" value={addForm.specialization} onChange={e => setAddForm({ ...addForm, specialization: e.target.value })} /></div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Tambah Guru</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import axios from 'axios';

export function ManageStudents() {
  const { state, dispatch } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [addForm, setAddForm] = useState({ name: '', age: '', classId: '', teacherId: '', parentId: '1' });
  const [editForm, setEditForm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'tetap' | 'interview'>('tetap');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, teachersRes] = await Promise.all([
          axios.get('/api/students'),
          axios.get('/api/classes'),
          axios.get('/api/teachers')
        ]);
        dispatch({ type: 'SET_STUDENTS', payload: studentsRes.data });
        dispatch({ type: 'SET_CLASSES', payload: classesRes.data });
        // Handle teachers paginated or all
        dispatch({ type: 'SET_TEACHERS', payload: Array.isArray(teachersRes.data) ? teachersRes.data : teachersRes.data.data });
        
        // Auto-select first IDs for add form
        if (classesRes.data.length > 0) setAddForm(prev => ({ ...prev, classId: classesRes.data[0].id }));
        if (teachersRes.data.data?.length > 0) setAddForm(prev => ({ ...prev, teacherId: teachersRes.data.data[0].id }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const getClassName = (classId: string | number) => state.classes.find(c => String(c.id) === String(classId))?.name ?? classId;
  const getTeacherName = (teacherId: string | number) => state.teachers.find(t => String(t.id) === String(teacherId))?.name ?? teacherId;
  
  const getAttendance = (studentId: string | number) => {
    const recs = state.attendance.filter(a => String(a.studentId) === String(studentId));
    if (!recs.length) return 'N/A';
    const present = recs.filter(a => a.status !== 'Tidak Hadir').length;
    return `${Math.round((present / recs.length) * 100)}%`;
  };

  const filtered = state.students.filter(s => {
    const matchesSearch = (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || getClassName(s.classId).toString().toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = (!classFilter || String(s.classId) === String(classFilter));
    const type = s.admissionType || 'tetap';
    const matchesTab = type === activeTab;
    return matchesSearch && matchesClass && matchesTab;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/students', {
        ...addForm,
        age: Number(addForm.age),
        enrolledDate: new Date().toISOString().split('T')[0],
        juzukCompleted: 0,
        status: 'Aktif'
      });
      dispatch({ type: 'ADD_STUDENT', payload: response.data });
      setAddForm({ name: '', age: '', classId: state.classes[0]?.id || '', teacherId: state.teachers[0]?.id || '', parentId: '1' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Gagal menambah pelajar.');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/students/${editForm.id}`, editForm);
      dispatch({ type: 'EDIT_STUDENT', payload: response.data });
      setShowEditModal(false);
      setEditForm(null);
    } catch (error) {
      console.error('Error editing student:', error);
      alert('Gagal mengemaskini pelajar.');
    }
  };

  const handleDelete = async (student: any) => {
    if (confirm(`Adakah anda pasti mahu memadam ${student.name}?`)) {
      try {
        await axios.delete(`/api/students/${student.id}`);
        dispatch({ type: 'DELETE_STUDENT', payload: { id: student.id } });
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Gagal memadam pelajar.');
      }
    }
  };

  const inputCls = 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Akademi Al-Quran Amalillah — <span className="text-gray-500 font-medium lowercase">urus pelajar</span></h2>
          <p className="text-gray-500 mt-1 text-sm">Lihat, kategorikan, dan kemaskini maklumat pelajar mengikut status pendaftaran.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#6FC7CB] text-white rounded-xl hover:bg-[#5FB3B7] shadow-lg shadow-cyan-100 transition-all font-bold">
          <Plus className="w-5 h-5" /> DAFTAR PELAJAR
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tetap')}
          className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 ${
            activeTab === 'tetap' ? 'border-[#6FC7CB] text-[#6FC7CB]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Pelajar Tetap
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 ${
            activeTab === 'interview' ? 'border-[#6FC7CB] text-[#6FC7CB]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Pelajar Interview
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
                {['Ranking','Nama','Umur','Kelas','Murabbi/ah','Hafazan','Kehadiran','Status','Tindakan'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-[#6FC7CB]">#{student.ranking || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{student.name}</td>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
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
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Murabbi / Murabbiah</label>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
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
                ['Murabbi / Murabbiah', getTeacherName(selectedStudent.teacherId)],
                ['Ranking Semasa', selectedStudent.ranking ? `#${selectedStudent.ranking}` : 'Tiada Ranking'],
                ['Jenis Pendaftaran', selectedStudent.admissionType === 'interview' ? 'Murid Interview' : 'Murid Tetap'],
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
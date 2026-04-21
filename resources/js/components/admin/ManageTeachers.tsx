import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import axios from 'axios';

export function ManageTeachers() {
  const { state, dispatch } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', icNo: '', username: '', specialization: '', gender: 'M' });
  const [addClassForm, setAddClassForm] = useState({ name: '', capacity: 20, teacherId: '' });
  const [editClassForm, setEditClassForm] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);
  
  // Search and Pagination state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, last_page: 1, from: 0, to: 0 });

  const inputCls = 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/classes');
        dispatch({ type: 'SET_CLASSES', payload: response.data });
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, [dispatch]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/api/teachers', {
          params: {
            page: page,
            search: debouncedSearch
          }
        });
        // Laravel paginator returns data in .data.data
        const { data, ...info } = response.data;
        dispatch({ type: 'SET_TEACHERS', payload: data });
        setPaginationInfo({
          total: info.total,
          last_page: info.last_page,
          from: info.from,
          to: info.to
        });
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, [dispatch, page, debouncedSearch]);

  const getStudentCount = (teacherId: string | number) =>
    state.students.filter(s => String(s.teacherId) === String(teacherId)).length;

  const getClassNames = (classIds: any) => {
    if (!classIds) return '—';
    const ids = Array.isArray(classIds) ? classIds : JSON.parse(classIds || '[]');
    return ids.map((id: any) => state.classes.find(c => String(c.id) === String(id))?.name ?? id).join(', ') || '—';
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/teachers', {
        ...addForm,
        joined_date: new Date().toISOString().split('T')[0],
        status: 'Aktif'
      });
      dispatch({ type: 'ADD_TEACHER', payload: response.data });
      setAddForm({ name: '', email: '', phone: '', icNo: '', username: '', specialization: '', gender: 'M' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Gagal menambah guru. Sila semak input anda.');
    }
  };

  const handleDelete = async (teacher: any) => {
    if (confirm(`Padam ${teacher.name} daripada sistem?`)) {
      try {
        await axios.delete(`/api/teachers/${teacher.id}`);
        dispatch({ type: 'DELETE_TEACHER', payload: { id: teacher.id } });
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Gagal memadam guru.');
      }
    }
  };

  const toggleStatus = async (teacher: any) => {
    const newStatus = teacher.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    try {
      const response = await axios.put(`/api/teachers/${teacher.id}`, { status: newStatus });
      dispatch({ type: 'EDIT_TEACHER', payload: response.data });
    } catch (error) {
      console.error('Error toggling teacher status:', error);
      alert('Gagal mengemas kini status guru.');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/teachers/${editForm.id}`, editForm);
      dispatch({ type: 'EDIT_TEACHER', payload: response.data });
      setShowEditModal(false);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Gagal mengemas kini guru.');
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/classes', {
        ...addClassForm,
        studentIds: []
      });
      dispatch({ type: 'ADD_CLASS', payload: response.data });
      setAddClassForm({ name: '', capacity: 20, teacherId: '' });
      setShowAddClassModal(false);
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Gagal menambah kelas.');
    }
  };

  const handleEditClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/classes/${editClassForm.id}`, {
        name: editClassForm.name,
        capacity: editClassForm.capacity,
        teacherId: editClassForm.teacherId
      });
      // Update global state
      const updatedClasses = state.classes.map(c => c.id === editClassForm.id ? response.data : c);
      dispatch({ type: 'SET_CLASSES', payload: updatedClasses });
      setShowEditClassModal(false);
      setEditClassForm(null);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Gagal mengemas kini kelas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Teachers & Classes</h2>
          <p className="text-gray-600 mt-1">Manage teachers and assign classes ({paginationInfo.total} total)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau emel..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-5 h-5" /> Tambah Guru
          </button>
          <button onClick={() => setShowAddClassModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Tambah Kelas
          </button>
        </div>
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
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => { setEditForm(teacher); setShowEditModal(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4F4F9] text-[#2D3142] font-bold rounded-xl hover:bg-gray-200 transition-all border-none cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => toggleStatus(teacher)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${
                  teacher.status === 'Aktif' ? 'bg-[#E9F5F1] text-[#52B788] hover:bg-[#D8EDE5]' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {teacher.status === 'Aktif' ? 'Assigned Class' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {paginationInfo.total > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            Menunjukkan <span className="font-medium text-gray-900">{paginationInfo.from}</span> hingga <span className="font-medium text-gray-900">{paginationInfo.to}</span> daripada <span className="font-medium text-gray-900">{paginationInfo.total}</span> guru
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-gray-50">
              Muka Surat {page} daripada {paginationInfo.last_page}
            </div>
            <button
              onClick={() => setPage((p: number) => Math.min(paginationInfo.last_page, p + 1))}
              disabled={page === paginationInfo.last_page}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginationInfo.total === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Tiada guru dijumpai</h3>
          <p className="text-gray-500 mt-1">Cuba tukar carian anda atau tambah guru baharu.</p>
        </div>
      )}

      {/* Classes Overview - High Fidelity Design */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm mt-8">
        <h3 className="text-xl font-bold text-[#2D3142] mb-8">All Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {state.classes.map(cls => {
            const studentCount = cls.studentIds.length;
            return (
              <div 
                key={cls.id} 
                className="p-8 bg-[#F8F9FA] border-2 border-transparent hover:border-[#8A63F2] rounded-[1.5rem] transition-all duration-300 group cursor-pointer"
              >
                <h4 className="text-xl font-bold text-[#2D3142] mb-2">{cls.name}</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">{studentCount} students</p>
                <button 
                  onClick={() => { setEditClassForm(cls); setShowEditClassModal(true); }}
                  className="flex items-center gap-2 text-[#52B788] font-bold hover:gap-3 transition-all border-none bg-transparent p-0 cursor-pointer text-sm"
                >
                  Edit Class <span className="text-lg">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tambah Guru Baharu</h3>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><input required className={inputCls} placeholder="Ustaz / Ustazah name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" required className={inputCls} placeholder="teacher@akmal.edu.my" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">ID Log Masuk (Username)</label><input className={inputCls} placeholder="e.g. murabbi_alif" value={addForm.username} onChange={e => setAddForm({ ...addForm, username: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">No. IC (Opsional)</label><input className={inputCls} placeholder="Jika ada" value={addForm.icNo} onChange={e => setAddForm({ ...addForm, icNo: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" required className={inputCls} placeholder="+60 12-345 6789" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label><input className={inputCls} placeholder="e.g. Hafazan & Tajweed" value={addForm.specialization} onChange={e => setAddForm({ ...addForm, specialization: e.target.value })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jantina</label>
                <select className={inputCls} value={addForm.gender} onChange={e => setAddForm({ ...addForm, gender: e.target.value })}>
                  <option value="M">Lelaki (Murabbi)</option>
                  <option value="F">Perempuan (Murabbiah)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Tambah Guru</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Class</h3>
            <form className="space-y-6" onSubmit={handleAddClass}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Class Name</label>
                <input 
                  required 
                  className={inputCls} 
                  placeholder="e.g., Al-Falah" 
                  value={addClassForm.name} 
                  onChange={e => setAddClassForm({ ...addClassForm, name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                <input 
                  type="number" 
                  required 
                  className={inputCls} 
                  placeholder="Maximum students" 
                  value={addClassForm.capacity} 
                  onChange={e => setAddClassForm({ ...addClassForm, capacity: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Teacher</label>
                <select 
                  required 
                  className={inputCls} 
                  value={addClassForm.teacherId} 
                  onChange={e => setAddClassForm({ ...addClassForm, teacherId: e.target.value })}
                >
                  <option value="">Select teacher</option>
                  {state.teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                  Create Class
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddClassModal(false)} 
                  className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-10 shadow-2xl overflow-hidden border border-gray-100">
            <h3 className="text-2xl font-bold text-[#2D3142] mb-8 text-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">Edit Profil Guru</h3>
            <form className="space-y-5" onSubmit={handleEdit}>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Full Name</label>
                <input required className={inputCls} placeholder="Ustaz / Ustazah name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Email</label>
                <input type="email" required className={inputCls} placeholder="teacher@akmal.edu.my" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Phone</label>
                <input type="tel" required className={inputCls} placeholder="+60 12-345 6789" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Specialization</label>
                <input className={inputCls} placeholder="e.g. Hafazan & Tajweed" value={editForm.specialization} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Jantina</label>
                <select className={inputCls} value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                  <option value="M">Lelaki (Murabbi)</option>
                  <option value="F">Perempuan (Murabbiah)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-8">
                <button type="submit" className="flex-1 py-4 bg-[#52B788] text-white font-bold rounded-2xl hover:bg-[#40916C] shadow-lg shadow-green-100 transition-all border-none cursor-pointer">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm cursor-pointer">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditClassModal && editClassForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl overflow-hidden border border-gray-100">
            <h3 className="text-2xl font-bold text-[#2D3142] mb-8 text-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">Edit Maklumat Kelas</h3>
            <form className="space-y-6" onSubmit={handleEditClass}>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Class Name</label>
                <input 
                  required 
                  className={inputCls} 
                  value={editClassForm.name} 
                  onChange={e => setEditClassForm({ ...editClassForm, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Capacity</label>
                <input 
                  type="number" 
                  required 
                  className={inputCls} 
                  value={editClassForm.capacity} 
                  onChange={e => setEditClassForm({ ...editClassForm, capacity: Number(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 ml-1">Assign Teacher</label>
                <select 
                  required 
                  className={inputCls} 
                  value={editClassForm.teacherId} 
                  onChange={e => setEditClassForm({ ...editClassForm, teacherId: e.target.value })}
                >
                  <option value="">Select teacher</option>
                  {state.teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all border-none cursor-pointer">
                  Simpan Perubahan
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditClassModal(false)} 
                  className="w-full py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer bg-white"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
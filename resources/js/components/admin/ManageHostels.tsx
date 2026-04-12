import { useState, useEffect } from 'react';
import { Plus, Home, Users, Trash2, Edit, ChevronRight, Bed, UserPlus } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import axios from 'axios';

export function ManageHostels() {
  const { state, dispatch } = useAppStore();
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', block: '', capacity: 20, gender: 'Lelaki', description: '' });
  const [assignData, setAssignData] = useState({ studentId: '', hostelId: '', roomNumber: '' });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const resp = await axios.get('/api/hostels');
      setHostels(resp.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch hostels', err);
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await axios.post('/api/hostels', formData);
      setHostels([...hostels, { ...resp.data, students_count: 0 }]);
      setShowAddModal(false);
      setFormData({ name: '', block: '', capacity: 20, gender: 'Lelaki', description: '' });
    } catch (err) {
      alert('Gagal menambah asrama');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/hostels/assign', {
        student_id: assignData.studentId,
        hostel_id: assignData.hostelId,
        room_number: assignData.roomNumber
      });
      setShowAssignModal(false);
      fetchHostels();
      alert('Pelajar berjaya ditempatkan!');
    } catch (err) {
      alert('Gagal menempatkan pelajar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Adakah anda pasti mahu memadam asrama ini?')) return;
    try {
      await axios.delete(`/api/hostels/${id}`);
      setHostels(hostels.filter(h => h.id !== id));
    } catch (err) {
      alert('Gagal memadam asrama');
    }
  };

  const inCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-gray-700';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl shadow-teal-900/5">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pengurusan Asrama</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Urus penginapan dan penempatan pelajar</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-teal-700 border-2 border-teal-100 rounded-2xl hover:bg-teal-50 font-bold transition-all shadow-lg shadow-teal-900/5">
            <UserPlus size={20} /> Tempatkan Pelajar
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl hover:scale-105 active:scale-95 font-bold transition-all shadow-xl shadow-teal-900/20">
            <Plus size={20} /> Tambah Blok Asrama
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hostels.map(hostel => (
            <div key={hostel.id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${hostel.gender === 'Lelaki' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                  {hostel.gender}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Home className="text-teal-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{hostel.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{hostel.block || 'Tiada Blok'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kapasiti</p>
                  <p className="text-2xl font-black text-slate-800">{hostel.capacity}</p>
                </div>
                <div className="bg-teal-50 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Penghuni</p>
                  <p className="text-2xl font-black text-teal-700">{hostel.students_count}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${hostel.students_count / hostel.capacity > 0.9 ? 'bg-red-500' : 'bg-teal-500'}`}
                    style={{ width: `${Math.min(100, (hostel.students_count / hostel.capacity) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-bold text-slate-500 text-center italic">
                  {hostel.capacity - hostel.students_count} Kekosongan Tersedia
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                <button className="flex-1 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(hostel.id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {hostels.length === 0 && (
            <div className="col-span-full bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Tiada Data Asrama</h3>
              <p className="text-slate-400 mt-2 font-medium">Mulakan dengan menambah blok asrama baharu.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-8">Tambah Asrama Baharu</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Asrama / Bangunan</label>
                <input required placeholder="Contoh: Aspura Al-Hidayah" className={inCls} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Blok</label>
                  <input placeholder="A, B, C..." className={inCls} value={formData.block} onChange={e => setFormData({ ...formData, block: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kapasiti</label>
                  <input type="number" required className={inCls} value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Penghuni</label>
                <select className={inCls} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Lelaki">Lelaki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/20">Simpan Data</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-8">Tempatkan Pelajar</h3>
            <form onSubmit={handleAssign} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Pelajar</label>
                <select required className={inCls} value={assignData.studentId} onChange={e => setAssignData({ ...assignData, studentId: e.target.value })}>
                  <option value="">Pilih pelajar...</option>
                  {state.students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Asrama</label>
                <select required className={inCls} value={assignData.hostelId} onChange={e => setAssignData({ ...assignData, hostelId: e.target.value })}>
                  <option value="">Pilih asrama...</option>
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.block})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombor Bilik / Katil</label>
                <input placeholder="Contoh: B-301" className={inCls} value={assignData.roomNumber} onChange={e => setAssignData({ ...assignData, roomNumber: e.target.value })} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20">Sahkan Penempatan</button>
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

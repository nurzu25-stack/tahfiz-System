import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User, Shield, BookOpen, HeartPulse, ChevronRight, ChevronLeft, Check } from 'lucide-react';
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
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [addForm, setAddForm] = useState({
    name: '',
    icNo: '',
    gender: 'M',
    dob: '',
    age: 0,
    address: '',
    // Guardian
    parentName: '',
    parentPhone: '',
    parentId: '1',
    // Academic
    studentId: '', // System generated or manual
    classId: '',
    teacherId: '',
    enrolledDate: new Date().toISOString().split('T')[0],
    intakeJuzuk: 0,
    admissionType: 'tetap' as 'tetap' | 'interview',
    // Health
    medicalHistory: '',
  });

  const [editForm, setEditForm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'tetap' | 'interview'>('tetap');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, teachersRes] = await Promise.all([
          axios.get('/api/students'),
          axios.get('/api/classes'),
          axios.get('/api/teachers?all=true')
        ]);
        dispatch({ type: 'SET_STUDENTS', payload: studentsRes.data });
        dispatch({ type: 'SET_CLASSES', payload: classesRes.data });
        dispatch({ type: 'SET_TEACHERS', payload: Array.isArray(teachersRes.data) ? teachersRes.data : teachersRes.data.data });
        
        if (classesRes.data.length > 0) setAddForm(prev => ({ ...prev, classId: classesRes.data[0].id }));
        if (teachersRes.data.data?.length > 0) setAddForm(prev => ({ ...prev, teacherId: teachersRes.data.data[0].id }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Auto-calculate age from DOB
  useEffect(() => {
    if (addForm.dob) {
      const birthDate = new Date(addForm.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAddForm(prev => ({ ...prev, age }));
    }
  }, [addForm.dob]);

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
        juzukCompleted: addForm.intakeJuzuk,
        status: 'Aktif'
      });
      dispatch({ type: 'ADD_STUDENT', payload: response.data });
      resetAddForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Gagal menambah pelajar.');
    }
  };

  const resetAddForm = () => {
    setAddForm({
      name: '',
      icNo: '',
      gender: 'M',
      dob: '',
      age: 0,
      address: '',
      parentName: '',
      parentPhone: '',
      parentId: '1',
      studentId: '',
      classId: state.classes[0]?.id || '',
      teacherId: state.teachers[0]?.id || '',
      enrolledDate: new Date().toISOString().split('T')[0],
      intakeJuzuk: 0,
      admissionType: 'tetap',
      medicalHistory: '',
    });
    setCurrentStep(1);
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

  const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#6FC7CB] outline-none transition-all';
  const labelCls = 'block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2';

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {[
        { step: 1, icon: <User className="w-4 h-4" />, label: 'Peribadi' },
        { step: 2, icon: <Shield className="w-4 h-4" />, label: 'Penjaga' },
        { step: 3, icon: <BookOpen className="w-4 h-4" />, label: 'Akademik' },
        { step: 4, icon: <HeartPulse className="w-4 h-4" />, label: 'Kesihatan' },
      ].map((s, idx, arr) => (
        <div key={s.step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep === s.step 
              ? 'bg-[#6FC7CB] text-white shadow-lg shadow-cyan-100' 
              : currentStep > s.step ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {currentStep > s.step ? <Check className="w-5 h-5" /> : s.icon}
            </div>
            <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${
              currentStep === s.step ? 'text-[#6FC7CB]' : 'text-slate-400'
            }`}>{s.label}</span>
          </div>
          {idx < arr.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 -mt-5 transition-all ${
              currentStep > s.step ? 'bg-green-500' : 'bg-slate-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Akademi Al-Quran Amalillah — <span className="text-slate-500 font-medium lowercase">urus pelajar</span></h2>
          <p className="text-slate-500 mt-1 text-sm leading-relaxed">Pendaftaran pelajar baharu kini lebih tersusun dengan sistem wizard multi-step.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#6FC7CB] text-white rounded-xl hover:bg-[#5FB3B7] shadow-lg shadow-cyan-50 transition-all font-bold">
          <Plus className="w-5 h-5" /> DAFTAR PELAJAR
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('tetap')}
          className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 ${
            activeTab === 'tetap' ? 'border-[#6FC7CB] text-[#6FC7CB]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pelajar Tetap
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 ${
            activeTab === 'interview' ? 'border-[#6FC7CB] text-[#6FC7CB]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pelajar Interview
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari nama pelajar atau ID..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#6FC7CB] outline-none" />
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#6FC7CB] outline-none font-medium text-slate-600">
          <option value="">Semua Kelas</option>
          {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {['Ranking','Nama','Umur','Kelas','Murabbi/ah','Hafazan','Kehadiran','Status','Tindakan'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-[#6FC7CB]">#{student.ranking || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{student.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {student.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{student.age} thn</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getClassName(student.classId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getTeacherName(student.teacherId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold">{student.juzukCompleted} Juzuk</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-mono tracking-tighter">{getAttendance(student.id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${student.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedStudent(student); setShowViewModal(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-[#6FC7CB] rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditForm({ ...student }); setShowEditModal(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(student)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300"><Search className="w-8 h-8" /></div>
                    <p className="text-slate-500 font-medium">Tiada pelajar ditemui.</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Wizrd */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Tambah Pelajar Baharu</h3>
                <p className="text-slate-400 text-sm">Sila lengkapkan maklumat mengikut langkah di bawah.</p>
              </div>
              <button onClick={() => { setShowAddModal(false); resetAddForm(); }} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all">✕</button>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleAdd} className="mt-4">
              
              {/* Step 1: Maklumat Peribadi */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Nama Penuh *</label>
                      <input required className={inputCls} placeholder="Nama mengikut MyKid/IC" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>No. Kad Pengenalan / MyKid *</label>
                      <input required className={inputCls} placeholder="Contoh: 121101101234" value={addForm.icNo} onChange={e => setAddForm({ ...addForm, icNo: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={labelCls}>Jantina *</label>
                      <select required className={inputCls} value={addForm.gender} onChange={e => setAddForm({ ...addForm, gender: e.target.value })}>
                        <option value="M">LELAKI (M)</option>
                        <option value="F">PEREMPUAN (F)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Tarikh Lahir *</label>
                      <input type="date" required className={inputCls} value={addForm.dob} onChange={e => setAddForm({ ...addForm, dob: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Umur (Autocalc)</label>
                      <input disabled className={`${inputCls} bg-slate-100 font-bold`} value={`${addForm.age} Tahun`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Alamat Rumah *</label>
                    <textarea required rows={2} className={inputCls} placeholder="Alamat penuh surat-menyurat" value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Step 2: Maklumat Penjaga */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className={labelCls}>Nama Ibu Bapa / Penjaga *</label>
                    <input required className={inputCls} placeholder="Nama penuh penjaga" value={addForm.parentName} onChange={e => setAddForm({ ...addForm, parentName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>No. Telefon Penjaga *</label>
                    <input required className={inputCls} placeholder="Contoh: +60 12-345 6789" value={addForm.parentPhone} onChange={e => setAddForm({ ...addForm, parentPhone: e.target.value })} />
                  </div>
                  <p className="p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs leading-relaxed border border-blue-100 uppercase font-bold tracking-wider">
                     Maklumat ini penting untuk sebarang urusan kecemasan & laporan hafazan harian melalui SMS/WhatsApp.
                  </p>
                </div>
              )}

              {/* Step 3: Akademik & Hafazan */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Kelas *</label>
                      <select required className={inputCls} value={addForm.classId} onChange={e => setAddForm({ ...addForm, classId: e.target.value })}>
                        {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Murabbi / Murabbiah *</label>
                      <select required className={inputCls} value={addForm.teacherId} onChange={e => setAddForm({ ...addForm, teacherId: e.target.value })}>
                        {state.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Tarikh Kemasukan *</label>
                      <input type="date" required className={inputCls} value={addForm.enrolledDate} onChange={e => setAddForm({ ...addForm, enrolledDate: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Hafazan Semasa (Juzuk)</label>
                      <input type="number" className={inputCls} placeholder="0-30" value={addForm.intakeJuzuk} onChange={e => setAddForm({ ...addForm, intakeJuzuk: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Jenis Pendaftaran</label>
                    <div className="flex gap-4">
                      {['tetap', 'interview'].map(t => (
                        <button key={t} type="button" onClick={() => setAddForm({ ...addForm, admissionType: t as any })} className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                          addForm.admissionType === t ? 'border-[#6FC7CB] bg-cyan-50 text-[#6FC7CB]' : 'border-slate-100 text-slate-400'
                        }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Kesihatan */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className={labelCls}>Sejarah Perubatan / Alahan</label>
                    <textarea rows={4} className={inputCls} placeholder="Contoh: Alahan terhadap habuk, Asma, dsb." value={addForm.medicalHistory} onChange={e => setAddForm({ ...addForm, medicalHistory: e.target.value })} />
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-800 mb-2 underline">Ringkasan Pendaftaran</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                      <span className="text-slate-400">Nama:</span> <span className="font-bold text-slate-700">{addForm.name}</span>
                      <span className="text-slate-400">IC:</span> <span className="font-bold text-slate-700">{addForm.icNo}</span>
                      <span className="text-slate-400">Kelas:</span> <span className="font-bold text-slate-700">{getClassName(addForm.classId)}</span>
                      <span className="text-slate-400">Penjaga:</span> <span className="font-bold text-slate-700">{addForm.parentName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-8 border-t border-slate-50 mt-8">
                {currentStep > 1 && (
                  <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-3 border-2 border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 font-bold transition-all flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> KEMBALI
                  </button>
                )}
                {currentStep < 4 ? (
                  <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="flex-1 py-3 bg-[#6FC7CB] text-white rounded-xl hover:bg-[#5FB3B7] font-bold shadow-lg shadow-cyan-100 transition-all flex items-center justify-center gap-2">
                    SETERUSNYA <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2">
                    DAFTAR SEKARANG <Check className="w-5 h-5" />
                  </button>
                )}
                {currentStep === 1 && (
                  <button type="button" onClick={() => { setShowAddModal(false); resetAddForm(); }} className="px-6 py-3 text-slate-400 hover:text-slate-600 font-bold transition-all">BATAL</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Kemaskini Pelajar</h3>
            <form className="space-y-5" onSubmit={handleEdit}>
              <div><label className={labelCls}>Nama Penuh</label><input required className={inputCls} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>No. IC / MyKid</label><input className={inputCls} value={editForm.icNo} onChange={e => setEditForm({ ...editForm, icNo: e.target.value })} /></div>
                <div><label className={labelCls}>Umur</label><input type="number" required className={inputCls} value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Kelas</label>
                  <select className={inputCls} value={editForm.classId} onChange={e => {
                    const selectedClass = state.classes.find(c => String(c.id) === String(e.target.value));
                    setEditForm({ 
                      ...editForm, 
                      classId: e.target.value,
                      teacherId: selectedClass?.teacherId || editForm.teacherId
                    });
                  }}>
                    {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Murabbi / Murabbiah</label>
                  <select className={inputCls} value={editForm.teacherId} onChange={e => setEditForm({ ...editForm, teacherId: e.target.value })}>
                    {state.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 transition-all">SIMPAN</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 border-2 border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 font-bold transition-all">BATAL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-3xl w-full p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
               <button onClick={() => setShowViewModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all">✕</button>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
               <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#6FC7CB] to-[#5FB3B7] flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-cyan-100">
                 {selectedStudent.name.charAt(0)}
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedStudent.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedStudent.id}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">{selectedStudent.status}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
              <div>
                <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Butiran Peribadi</h4>
                <div className="space-y-4">
                  {[
                    ['Kad Pengenalan', selectedStudent.icNo || '—'],
                    ['Jantina', selectedStudent.gender === 'F' ? 'Perempuan' : 'Lelaki'],
                    ['Tarikh Lahir', selectedStudent.dob || '—'],
                    ['Umur', `${selectedStudent.age} Tahun`],
                    ['Alamat', selectedStudent.address || '—'],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-xs text-slate-400 font-medium">{l}</span>
                      <span className="text-sm text-slate-700 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Akademik & Penjaga</h4>
                <div className="space-y-4">
                  {[
                    ['Kelas', getClassName(selectedStudent.classId)],
                    ['Murabbi/ah', getTeacherName(selectedStudent.teacherId)],
                    ['Hafazan', `${selectedStudent.juzukCompleted} Juzuk`],
                    ['Penjaga', state.users.find(u => u.id === selectedStudent.parentId)?.name || 'Hassan bin Ahmad'],
                    ['Tarikh Daftar', selectedStudent.enrolledDate],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-xs text-slate-400 font-medium">{l}</span>
                      <span className="text-sm text-slate-700 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-red-50/50 rounded-3xl border border-red-100">
               <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-2">Maklumat Kesihatan</h4>
               <p className="text-slate-700 text-sm font-medium">{selectedStudent.medicalHistory || 'Tiada sejarah perubatan dilaporkan.'}</p>
            </div>

            <div className="mt-8 pt-4">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
              >
                TUTUP PROFIL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { BookOpen, User, Phone, Mail, Award, CheckCircle2, ChevronRight, ChevronLeft, Shield, Sparkles, Building2, Wallet } from 'lucide-react';
import axios from 'axios';

export function PublicRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Parent Data
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentJob: '',
    parentIncome: '',
    password: '',
    confirmPassword: '',
    // Student Data
    studentName: '',
    studentGender: 'M',
    studentDob: '',
    studentAge: 0,
    tajwidLevel: 'Asas',
    hafazanLevel: '0 Juzuk',
  });

  // Auto-calc age
  useEffect(() => {
    if (formData.studentDob) {
      const birthDate = new Date(formData.studentDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, studentAge: age }));
    }
  }, [formData.studentDob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Kata laluan tidak sepadan.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/api/public/register-enrollment', {
        ...formData,
        admissionType: 'interview'
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghantar permohonan. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#6FC7CB] outline-none transition-all text-slate-700';
  const labelCls = 'block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5';

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A4D50] to-[#6FC7CB] p-6">
        <div className="bg-white rounded-[40px] max-w-xl w-full p-12 text-center shadow-2xl animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Permohonan Berjaya!</h2>
          <p className="text-slate-500 leading-relaxed mb-10">
            Terima kasih En/Puan <strong>{formData.parentName}</strong>. Rekod permohonan untuk <strong>{formData.studentName}</strong> telah diterima. 
            <br/><br/>
            Status permohonan kini adalah <strong>'Pending'</strong>. Mudir akan menyemak data socio-ekonomi anda sebelum memanggil untuk sesi temuduga (interview).
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
          >
            KEMBALI KE LAMAN UTAMA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-12 px-6">
      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-cyan-100 mb-6">
          <Sparkles className="w-10 h-10 text-[#6FC7CB]" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Pendaftaran Pelajar Baharu</h1>
        <p className="text-slate-500 font-medium">Sila lengkapkan butiran untuk proses kemasukan (Interview).</p>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden relative border border-slate-50">
        {/* Step Indicator */}
        <div className="flex border-b border-slate-50">
          {[
            { n: 1, label: 'Waris & Akaun', icon: <User className="w-4 h-4" /> },
            { n: 2, label: 'Butiran Pelajar', icon: <BookOpen className="w-4 h-4" /> },
          ].map(s => (
            <div key={s.n} className={`flex-1 flex items-center justify-center py-5 gap-3 transition-all ${
              currentStep === s.n ? 'bg-slate-50/50 border-b-4 border-[#6FC7CB]' : 'opacity-40'
            }`}>
              <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === s.n ? 'bg-[#6FC7CB] text-white' : 'bg-slate-200 text-slate-500'
              }`}>{s.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-3">
              <span className="p-1 bg-red-100 rounded-lg">✕</span> {error}
            </div>
          )}

          {currentStep === 1 ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="p-6 bg-cyan-50/50 rounded-3xl border border-cyan-100 mb-8">
                 <h4 className="flex items-center gap-2 text-[#1A4D50] font-black uppercase text-xs tracking-widest mb-2">
                   <Shield className="w-4 h-4" /> Maklumat Penjaga (Parent)
                 </h4>
                 <p className="text-[#1A4D50]/60 text-[11px] leading-relaxed">Sila pastikan data socio-ekonomi anda tepat untuk memudahkan pihak Mudir membuat semakan kelayakan kemasukan.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <label className={labelCls}>Nama Penuh Waris *</label>
                   <input required className={inputCls} placeholder="Nama mengikut IC" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} />
                 </div>
                 <div>
                   <label className={labelCls}>E-mel *</label>
                   <input type="email" required className={inputCls} placeholder="waris@email.com" value={formData.parentEmail} onChange={e => setFormData({ ...formData, parentEmail: e.target.value })} />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <label className={labelCls}>Telefon *</label>
                    <input type="tel" required className={inputCls} placeholder="012-XXXXXXX" value={formData.parentPhone} onChange={e => setFormData({ ...formData, parentPhone: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Pekerjaan *</label>
                    <input required className={inputCls} placeholder="Guru, Kerani, dsb." value={formData.parentJob} onChange={e => setFormData({ ...formData, parentJob: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Gaji Bulanan (RM) *</label>
                    <input type="number" required className={inputCls} placeholder="Contoh: 3500" value={formData.parentIncome} onChange={e => setFormData({ ...formData, parentIncome: e.target.value })} />
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-50 mt-8">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Akses Akaun (Password)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="password" required className={inputCls} placeholder="Cipta Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <input type="password" required className={inputCls} placeholder="Sahkan Password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Nama Anak (Calon Pelajar) *</label>
                    <input required className={inputCls} placeholder="Nama penuh anak" value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Jantina *</label>
                      <select required className={inputCls} value={formData.studentGender} onChange={e => setFormData({ ...formData, studentGender: e.target.value })}>
                        <option value="M">Lelaki</option>
                        <option value="F">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Umur</label>
                      <input disabled className={`${inputCls} bg-slate-100 font-bold`} value={`${formData.studentAge} thn`} />
                    </div>
                  </div>
               </div>

               <div>
                 <label className={labelCls}>Tarikh Lahir *</label>
                 <input type="date" required className={inputCls} value={formData.studentDob} onChange={e => setFormData({ ...formData, studentDob: e.target.value })} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                  <div>
                    <label className={labelCls}>Tahap Tajwid Semasa</label>
                    <select className={inputCls} value={formData.tajwidLevel} onChange={e => setFormData({ ...formData, tajwidLevel: e.target.value })}>
                       <option>Asas (Iqra)</option>
                       <option>Sederhana</option>
                       <option>Lancar (Al-Quran)</option>
                       <option>Amat Lancar</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Tahap Hafazan (Juzuk)</label>
                    <input className={inputCls} placeholder="Contoh: 2 Juzuk" value={formData.hafazanLevel} onChange={e => setFormData({ ...formData, hafazanLevel: e.target.value })} />
                  </div>
               </div>

               <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white rounded-2xl shadow-sm text-[#6FC7CB]"><Sparkles className="w-6 h-6" /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Analisis Kelayakan Awal</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Data anda akan diproses menggunakan AI sistem untuk menentukan ranking temuduga. Pastikan semua maklumat adalah benar.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          <div className="flex gap-4 mt-12 pt-8 border-t border-slate-50">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)} 
                className="px-8 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                KEMBALI
              </button>
            )}
            {currentStep === 1 ? (
              <button 
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="flex-1 py-4 bg-[#6FC7CB] text-white rounded-2xl font-bold hover:bg-[#5FB3B7] shadow-xl shadow-cyan-100 transition-all flex items-center justify-center gap-3"
              >
                TERUSKAN <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isLoading}
                className={`flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? 'MENGHANTAR...' : 'HANTAR PERMOHONAN'} <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FOOTER */}
      <div className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        &copy; 2026 Akademi Al-Quran Amalillah — Guest Enrollment System
      </div>
    </div>
  );
}

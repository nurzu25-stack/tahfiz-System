import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  Filter, 
  Search,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAppStore } from '../../store/AppContext';

type EnrollmentStatus = 'PROSPECT' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'OFFERED' | 'ENROLLED';

interface Applicant {
  id: string;
  name: string;
  parentName: string;
  phone: string;
  icNo: string;
  dateApplied: string;
  status: EnrollmentStatus;
  interviewDate?: string;
  notes?: string;
}

export function EnrollmentHub() {
  const { state, dispatch } = useAppStore();
  const [activeTab, setActiveTab] = useState<EnrollmentStatus | 'ALL'>('ALL');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Mock data for initial implementation
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 'APP-1021', name: 'Zaid bin Razali', parentName: 'Razali Ahmad', phone: '0123456789', icNo: '120501101231', dateApplied: '2026-04-01', status: 'PROSPECT' },
    { id: 'APP-1022', name: 'Nurul Huda', parentName: 'Huda Kassim', phone: '0198765432', icNo: '130201104322', dateApplied: '2026-04-02', status: 'INTERVIEW', interviewDate: '2026-04-10' },
    { id: 'APP-1023', name: 'Ahmad Rafiq', parentName: 'Rafiq Bakar', phone: '0112233445', icNo: '110801105543', dateApplied: '2026-03-28', status: 'ACCEPTED' },
    { id: 'APP-1024', name: 'Sofea Arissa', parentName: 'Arissa Omar', phone: '0133344556', icNo: '141011109988', dateApplied: '2026-04-03', status: 'REJECTED' },
  ]);

  const stats = [
    { label: 'Prospek Baharu', count: applicants.filter(a => a.status === 'PROSPECT').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Temuduga', count: applicants.filter(a => a.status === 'INTERVIEW').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Menunggu Tawaran', count: applicants.filter(a => a.status === 'ACCEPTED').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const updateStatus = (id: string, newStatus: EnrollmentStatus) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedApplicant?.id === id) setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const sendWhatsAppOffer = (applicant: Applicant) => {
    const message = `Assalamualaikum Tn/Puan ${applicant.parentName}, Tahniah! Anak anda ${applicant.name} telah DITERIMA masuk ke AKMAL Tahfiz. Sila muat turun surat tawaran digital di portal kami: https://akmal-tahfiz.edu.my/off/digital-letter`;
    window.open(`https://wa.me/${applicant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const config = {
      PROSPECT: { label: 'Prospek', cls: 'bg-blue-100 text-blue-700' },
      INTERVIEW: { label: 'Temuduga', cls: 'bg-amber-100 text-amber-700' },
      ACCEPTED: { label: 'Diterima', cls: 'bg-emerald-100 text-emerald-700' },
      REJECTED: { label: 'Ditolak', cls: 'bg-red-100 text-red-700' },
      OFFERED: { label: 'Tawaran Dihantar', cls: 'bg-purple-100 text-purple-700' },
      ENROLLED: { label: 'Aktif', cls: 'bg-slate-900 text-white' },
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config[status].cls}`}>{config[status].label}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight underline decoration-[#6FC7CB] decoration-4 underline-offset-8">Hub Pendaftaran Digital</h2>
          <p className="text-slate-500 font-medium mt-3">Urus kitaran hayat kemasukan pelajar daripada Prospek ke Aktif.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">
             <Download className="size-4" /> EKSPORT DATA
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#6FC7CB] text-white rounded-xl font-bold text-xs hover:bg-[#5FB3B7] shadow-xl shadow-cyan-100 transition-all">
             <Calendar className="size-4" /> JADUAL TEMUDUGA
           </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`p-6 rounded-[32px] border border-slate-100 shadow-sm ${s.bg}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${s.color}`}>{s.label}</p>
            <p className="text-4xl font-black text-slate-800">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Workflow Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
         {['ALL', 'PROSPECT', 'INTERVIEW', 'ACCEPTED', 'OFFERED'].map((t) => (
           <button 
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeTab === t ? 'bg-[#1A4D50] text-[#6FC7CB] border-[#1A4D50] shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-[#6FC7CB]'
            }`}
           >
             {t === 'ALL' ? 'Semua Calon' : t}
           </button>
         ))}
      </div>

      {/* Applicants List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {applicants.filter(a => activeTab === 'ALL' || a.status === activeTab).map((a) => (
            <div 
              key={a.id} 
              onClick={() => setSelectedApplicant(a)}
              className={`p-6 rounded-[32px] bg-white border-2 transition-all cursor-pointer group ${
                selectedApplicant?.id === a.id ? 'border-[#6FC7CB] shadow-2xl shadow-cyan-50' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#6FC7CB] transition-colors">
                    <Users className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{a.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Penjaga: {a.parentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(a.status)}
                  <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-end gap-1 uppercase">
                    <Clock className="size-3" /> DAFTAR: {a.dateApplied}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          {selectedApplicant ? (
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl sticky top-8 animate-in slide-in-from-right-8 duration-500">
               <div className="text-center mb-10">
                 <div className="size-24 bg-gradient-to-br from-[#1A4D50] to-[#6FC7CB] rounded-[38px] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-2xl shadow-cyan-100">
                   {selectedApplicant.name.charAt(0)}
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedApplicant.name}</h3>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">{selectedApplicant.id}</p>
               </div>

               <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                     <MessageCircle className="size-5 text-emerald-500" />
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase">Telefon</p>
                       <p className="text-sm font-bold text-slate-700">{selectedApplicant.phone}</p>
                     </div>
                   </div>
                   <button onClick={() => window.open(`https://wa.me/${selectedApplicant.phone}`, '_blank')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                     <ExternalLink className="size-4" />
                   </button>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    {selectedApplicant.status === 'PROSPECT' && (
                      <button onClick={() => updateStatus(selectedApplicant.id, 'INTERVIEW')} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all flex items-center justify-center gap-2">
                        <Calendar className="size-4" /> PANGGIL TEMUDUGA
                      </button>
                    )}
                    {selectedApplicant.status === 'INTERVIEW' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(selectedApplicant.id, 'ACCEPTED')} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">LULUS</button>
                        <button onClick={() => updateStatus(selectedApplicant.id, 'REJECTED')} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">GAGAL</button>
                      </div>
                    )}
                    {selectedApplicant.status === 'ACCEPTED' && (
                      <button onClick={() => setShowOfferModal(true)} className="w-full py-4 bg-[#1A4D50] text-[#6FC7CB] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 shadow-xl transition-all flex items-center justify-center gap-2">
                        <FileText className="size-4" /> JANA SURAT TAWARAN
                      </button>
                    )}
                    {selectedApplicant.status === 'OFFERED' && (
                      <button onClick={() => updateStatus(selectedApplicant.id, 'ENROLLED')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-2">
                        <ShieldCheck className="size-4" /> SAHKAN PENDAFTARAN
                      </button>
                    )}
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-100">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Nota Pegawai Admin</p>
                 <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm italic text-slate-500 min-h-[80px]" placeholder="Masukkan catatan temuduga di sini..." />
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[40px] text-center">
               <Zap className="size-12 text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pilih calon untuk melihat butiran & tindakan</p>
            </div>
          )}
        </div>
      </div>

      {/* Offer Letter Modal Overlay */}
      {showOfferModal && selectedApplicant && (
        <div className="fixed inset-0 bg-[#1A4D50]/80 backdrop-blur-xl flex items-center justify-center p-6 z-[60]">
           <div className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
              <div className="p-12">
                 <div className="flex justify-between items-start mb-12">
                    <img src="/images/logo.png" alt="Logo" className="h-14" />
                    <div className="text-right">
                       <p className="text-[10px] font-black text-[#6FC7CB] uppercase tracking-[0.4em]">Surat Tawaran Rasmi</p>
                       <p className="text-slate-400 font-mono text-xs mt-1">REF: AKM/OFF/{new Date().getFullYear()}/{selectedApplicant.id.split('-')[1]}</p>
                    </div>
                 </div>

                 <div className="space-y-6 text-slate-800">
                    <p className="font-bold">Kepada Tn/Puan {selectedApplicant.parentName},</p>
                    <p className="text-4xl font-black tracking-tight leading-none text-slate-900 uppercase">TAWARAN KEMASUKAN PELAJAR BAHARU</p>
                    <p className="leading-relaxed font-medium text-slate-600">
                      Dengan segala hormatnya, kami di **AKMAL Tahfiz** amat sukacita memaklumkan bahawa anak anda, **{selectedApplicant.name}**, telah berjaya dalam sesi temuduga dan ditawarkan tempat untuk mengikuti program pengajian di akademi kami.
                    </p>
                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tarikh Pendaftaran</p>
                         <p className="font-black text-lg">15 JUN 2026</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi</p>
                         <p className="font-black text-lg">KAMPUS AKMAL</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4 mt-12">
                    <button 
                      onClick={() => {
                        sendWhatsAppOffer(selectedApplicant);
                        updateStatus(selectedApplicant.id, 'OFFERED');
                        setShowOfferModal(false);
                      }}
                      className="flex-1 py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 shadow-2xl shadow-emerald-200 transition-all flex items-center justify-center gap-3"
                    >
                       <MessageCircle className="size-6 fill-white" /> HANTAR WHATSAPP
                    </button>
                    <button onClick={() => setShowOfferModal(false)} className="px-10 py-5 bg-slate-100 text-slate-400 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">BATAL</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

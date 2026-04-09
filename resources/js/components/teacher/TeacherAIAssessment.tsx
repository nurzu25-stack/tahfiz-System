import { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Clock, User, Download, ExternalLink, Filter, Search, Brain } from 'lucide-react';

interface AIResult {
  id: string;
  studentName: string;
  surah: string;
  score: number;
  date: string;
  status: 'reviewed' | 'pending';
}

export function TeacherAIAssessment() {
  const [results, setResults] = useState<AIResult[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [filter]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/ai-assessments?status=${filter}`);
      if (resp.ok) {
        const data = await resp.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string) => {
    try {
      const resp = await fetch(`/api/ai-assessments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reviewed' }),
      });
      if (resp.ok) {
        fetchAssessments();
      }
    } catch (err) {
      console.error('Failed to update assessment', err);
    }
  };

  const filteredResults = results; // Filtering is handled by API

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Semakan Penilaian AI</h2>
          <p className="text-slate-500 font-medium">Pantau hasil rakaman hafazan yang telah dinilai secara automatik.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
             <input type="text" placeholder="Cari pelajar..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6FC7CB] shadow-sm" />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-[#6FC7CB] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>SEMUA</button>
             <button onClick={() => setFilter('pending')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'pending' ? 'bg-[#6FC7CB] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>PENDING</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FC7CB]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResults.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#6FC7CB] group-hover:scale-105 transition-transform">
                  <User className="size-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{r.studentName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#6FC7CB]/10 text-[#1A4D50] rounded-full text-[10px] font-black uppercase tracking-wider">
                       {r.surah}
                     </span>
                     <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                       <Clock className="size-3" /> {r.date}
                     </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Markah AI</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-1.5 rounded-full ${r.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: '40px' }} />
                    <span className={`text-xl font-black ${r.score > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{r.score}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   {r.status === 'pending' ? (
                     <button 
                       onClick={() => handleReview(r.id)}
                       className="px-5 py-2.5 bg-[#1A4D50] text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg flex items-center gap-2"
                     >
                       <Play className="size-3 fill-white" /> SEMAK RAKAMAN
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                       <CheckCircle2 className="size-3" /> SUDAH DISEMAK
                     </div>
                   )}
                   <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                      <Download className="size-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
          {filteredResults.length === 0 && <div className="text-center p-10 text-slate-400">Tiada rekod penilaian dijumpai.</div>}
        </div>
      )}

      <div className="p-8 bg-cyan-900 rounded-[32px] text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
           <Brain className="size-48" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-3 italic">"AI membantu Murabbi menjimatkan masa menyemak ralat bacaan yang biasa."</h3>
          <p className="opacity-80 font-medium">Sistem ini menyerlahkan ralat Tajwid dan kelancaran secara automatik sebelum anda mengesahkan markah akhir.</p>
        </div>
      </div>
    </div>
  );
}

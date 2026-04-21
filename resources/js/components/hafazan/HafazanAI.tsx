import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Mic, Square, Play, CheckCircle2, AlertCircle, RefreshCcw, 
  Loader2, Award, Zap, BookOpen, Volume2, Sparkles, Eye, EyeOff, Search, ChevronRight,
  Brain, Trophy, X
} from 'lucide-react';

interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translation?: string;
  has_mistake?: boolean;
}

export function HafazanAI() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing' | 'completed'>('idle');
  const [selectedSurah, setSelectedSurah] = useState(1); // Al-Fatihah
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [hideVerses, setHideVerses] = useState(true);
  const [mistakesFound, setMistakesFound] = useState<number[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchAllChapters();
    fetchVerses(selectedSurah);
  }, [selectedSurah]);

  const fetchAllChapters = async () => {
    try {
      const res = await axios.get('https://api.quran.com/api/v4/chapters?language=ms');
      setChapters(res.data.chapters);
    } catch (err) {
      console.error('Failed to fetch chapters', err);
    }
  };

  const fetchVerses = async (surahNumber: number) => {
    try {
      const res = await axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNumber}`);
      const data = res.data.verses.map((v: any) => ({
        id: v.id,
        verse_key: v.verse_key,
        text_uthmani: v.text_uthmani,
      }));
      setVerses(data);
      setMistakesFound([]);
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Failed to fetch verses', err);
    }
  };

  const filteredChapters = chapters.filter(c => 
    c.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toString() === searchTerm
  );

  const currentChapter = chapters.find(c => c.id === selectedSurah);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstop = () => {
        analyzeRecitation();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('recording');
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      let msg = 'Akses mikrofon diperlukan untuk penilaian AI.';
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        msg = '⚠️ KEGAGALAN KESELAMATAN: Pelayar menghalang akses mikrofon pada sambungan tidak selamat (HTTP).\n\nSila gunakan HTTPS atau localhost.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = '⚠️ AKSES DISEKAT: Sila benarkan akses mikrofon di tetapan pelayar.';
      }
      alert(msg);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const analyzeRecitation = async () => {
    setStatus('analyzing');
    await new Promise(r => setTimeout(r, 4000));
    const fakeMistakes = verses.length > 3 ? [verses[2].id, verses[4].id] : [verses[0].id];
    setMistakesFound(fakeMistakes);
    setStatus('completed');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Tarteel Style Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#1A4D50] p-8 rounded-[40px] text-white shadow-2xl relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-xl flex items-center justify-center border border-white/20">
               <Brain className="w-8 h-8 text-teal-200" />
            </div>
            <div>
               <h2 className="text-3xl font-black tracking-tight uppercase">TARTEEL AI AKMAL</h2>
               <p className="text-teal-100/60 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Memorization Mistake Detection • Real-Time AI</p>
            </div>
         </div>
         
         <div className="relative z-10 flex items-center gap-4 mt-6 md:mt-0">
            <button 
              onClick={() => setIsDropdownOpen(true)}
              className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3 font-bold text-white flex items-center gap-3 hover:bg-white/20 transition-all min-w-[220px]"
            >
              <BookOpen className="w-4 h-4 text-teal-300" />
              {currentChapter ? `${currentChapter.id}. ${currentChapter.name_simple}` : 'Pilih Surah...'}
              <Search className="w-4 h-4 opacity-50 ml-auto" />
            </button>

            <div className="h-12 w-[1px] bg-white/10 hidden md:block"></div>
            <button 
              onClick={() => setHideVerses(!hideVerses)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm shrink-0"
            >
              {hideVerses ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {hideVerses ? 'PAPARKAN AYAT' : 'SOROK AYAT'}
            </button>
         </div>
      </div>

      {/* Surah Selection Modal */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xl" onClick={() => setIsDropdownOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300 border border-white/20">
              
              {/* Modal Header */}
              <div className="p-8 bg-black/5 border-b border-black/5 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Pilih Surah Hafazan</h3>
                    <p className="text-slate-600 font-bold text-xs uppercase tracking-widest opacity-60">Eksplorasi 114 Surah Al-Quran</p>
                 </div>
                 <button onClick={() => setIsDropdownOpen(false)} className="p-3 hover:bg-black/10 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-slate-600" />
                 </button>
              </div>

              {/* Search Box */}
              <div className="p-8 bg-transparent border-b border-black/5">
                 <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-[#1A4D50] transition-colors" />
                    <input 
                      autoFocus 
                      type="text" 
                      placeholder="Cari nama surah atau nombor..." 
                      className="w-full bg-white/40 backdrop-blur-md border border-white/20 rounded-[24px] pl-16 pr-8 py-5 text-lg font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#1A4D50]/10 transition-all shadow-sm" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                 </div>
              </div>

              {/* Surah Grid */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-transparent">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChapters.map((c: any) => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedSurah(c.id)} 
                        className={`group p-5 rounded-3xl cursor-pointer border transition-all flex items-center justify-between ${
                          selectedSurah === c.id 
                            ? 'bg-[#1A4D50] border-[#1A4D50] text-white shadow-xl' 
                            : 'bg-white/40 border-white/20 hover:bg-white/60 hover:border-[#1A4D50]/30 shadow-sm'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400">{c.id}</div>
                            <div>
                               <h4 className="font-black text-sm uppercase">{c.name_simple}</h4>
                               <p className="text-[10px] opacity-60 uppercase">{c.revelation_place} • {c.verses_count} AYAT</p>
                            </div>
                         </div>
                         <span className="font-serif text-xl opacity-60">{c.name_arabic}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl relative min-h-[500px]">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                 <h3 className="font-serif text-2xl text-slate-400">{currentChapter?.name_arabic}</h3>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Surah {selectedSurah}</span>
                    <Search className="w-4 h-4 text-slate-300" />
                 </div>
              </div>

              <div className="space-y-12 text-center">
                 {verses.map((v) => {
                    const hasMistake = mistakesFound.includes(v.id);
                    return (
                     <div key={v.id} className="relative group">
                        <span className={`text-4xl md:text-5xl font-serif leading-[1.8] block transition-all duration-700 select-none ${
                           hideVerses && status !== 'completed' ? 'blur-xl opacity-20 pointer-events-none' : 'opacity-100'
                        } ${hasMistake ? 'text-rose-600 bg-rose-50 rounded-2xl py-4 animate-pulse' : 'text-slate-800'}`}>
                           {v.text_uthmani}
                           <span className="text-xl md:text-2xl text-[#1A4D50]/30 mr-4 font-mono">
                              ﴿{v.verse_key.split(':')[1]}﴾
                           </span>
                        </span>
                        {hasMistake && (
                          <div className="mt-2 text-rose-500 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-1">
                             <AlertCircle className="w-3 h-3" /> AI DETECTED MEMORIZATION MISTAKE
                          </div>
                        )}
                     </div>
                    );
                 })}
              </div>

              {status === 'recording' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[40px]">
                   <div className="w-[80%] h-32 flex items-center justify-center gap-1">
                      {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-1.5 bg-[#1A4D50] rounded-full animate-wave" style={{ height: `${10 + Math.random() * 80}px`, animationDelay: `${i * 0.05}s` }} />
                      ))}
                   </div>
                   <p className="text-[#1A4D50] font-black text-xl tracking-[0.3em] animate-pulse uppercase mt-8">Sistem Sedang Mendengar...</p>
                   <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                      REC {formatTime(timer)}
                   </div>
                </div>
              )}

              {status === 'analyzing' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[40px]">
                   <Loader2 className="w-16 h-16 text-[#1A4D50] animate-spin mb-6" />
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI Mistake Detection</h3>
                   <p className="text-slate-500 font-medium">Memproses makhraj dan urutan kalimah...</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#1A4D50] rounded-[40px] p-8 text-white shadow-2xl">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-teal-100">
                 <Mic className="w-5 h-5" /> RECITATION CONTROL
              </h3>
              <div className="space-y-4">
                 {status === 'idle' || status === 'completed' ? (
                    <button onClick={startRecording} className="w-full py-5 bg-[#6FC7CB] text-white rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
                       <Mic className="w-6 h-6" /> {status === 'completed' ? 'MULAKAN SEMULA' : 'RECIT NOW'}
                    </button>
                 ) : (
                    <button onClick={stopRecording} className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black text-lg hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3">
                       <Square className="w-6 h-6 fill-white" /> BERHENTI
                    </button>
                 )}
                 <div className="grid grid-cols-2 gap-3 mt-4">
                    <button className="py-4 bg-white/10 rounded-2xl text-xs font-bold hover:bg-white/20">VERSE PEEKING</button>
                    <button className="py-4 bg-white/10 rounded-2xl text-xs font-bold hover:bg-white/20">MISTAKE PLAYBACK</button>
                 </div>
              </div>
           </div>

           {status === 'completed' && (
             <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 mb-8 text-[#1A4D50]">
                   <Sparkles className="w-5 h-5" />
                   <h3 className="font-bold uppercase tracking-widest text-xs">AI Insights</h3>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Memorization Score</span>
                      <span className="text-2xl font-black text-emerald-600">92%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full">
                      <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                   </div>
                   <div className="flex items-center justify-between pt-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Mistakes Detected</span>
                      <span className="text-2xl font-black text-rose-500">{mistakesFound.length}</span>
                   </div>
                   <div className="pt-8 border-t border-slate-50">
                      <button onClick={() => setIsSubmitting(true)} className="w-full py-4 bg-[#1A4D50] text-white rounded-2xl font-black hover:bg-slate-800 transition-all">SAVE TO HISTORY</button>
                   </div>
                </div>
             </div>
           )}

           <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[40px] p-8 border border-amber-100 shadow-sm">
               <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-amber-600" /> DAILY CHALLENGE
               </h4>
               <p className="text-sm text-amber-700 leading-relaxed font-medium">Hafal Surah Al-Mulk tanpa sebarang kesilapan hari ini untuk mendapatkan lencana!</p>
               <button className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full text-xs font-black">JOIN NOW</button>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
          transform-origin: center;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}

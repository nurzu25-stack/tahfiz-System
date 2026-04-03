import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, CheckCircle2, AlertCircle, RefreshCcw, Loader2, Award, Zap, BookOpen, Volume2, Sparkles } from 'lucide-react';

interface AssessmentResult {
  accuracy: number;
  smoothness: number;
  tajwid: number;
  mistakes: string[];
  transcription: string;
}

export function HafazanAI() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing' | 'completed'>('idle');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [selectedSurah, setSelectedSurah] = useState('Al-Fatihah');
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        analyzeRecitation();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('recording');
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Sila benarkan akses mikrofon untuk memulakan penilaian.');
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
    // Simulate complex AI analysis
    await new Promise(r => setTimeout(r, 3500));
    
    setResult({
      accuracy: 94,
      smoothness: 88,
      tajwid: 90,
      mistakes: ['Ayat 4: Mad Asli terpendek', 'Ayat 6: Makhraj huruf "Qaf"'],
      transcription: "Bismillahir Rahmanir Rahim. Alhamdu lillahi Rabbil 'alamin. Ar-Rahmanir Rahim. Maliki Yawmiddin..."
    });
    setStatus('completed');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        {/* Header Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FC7CB]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6FC7CB]/10 text-[#1A4D50] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                <Zap className="size-3" /> AI ASSESSMENT BETA
              </div>
              <h2 className="text-3xl font-black text-slate-800">Ujian Hafazan Pintar</h2>
              <p className="text-slate-500 font-medium mt-1">Gunakan rakaman audio untuk penilaian automatik berasaskan AI.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value)}
                className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#6FC7CB] transition-all"
              >
                <option>Al-Fatihah</option>
                <option>Surah Al-Mulk</option>
                <option>Surah Al-Kahfi</option>
                <option>Surah An-Naba'</option>
              </select>
            </div>
          </div>

          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 group hover:border-[#6FC7CB]/50 transition-all">
              <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                <Mic className="size-8 text-[#6FC7CB]" />
              </div>
              <p className="text-xl font-bold text-slate-700 mb-2">Sedia untuk Merakam?</p>
              <p className="text-slate-400 text-sm mb-8">Pastikan persekitaran anda sunyi untuk ketepatan terbaik.</p>
              <button 
                onClick={startRecording}
                className="px-10 py-4 bg-[#6FC7CB] text-white rounded-2xl font-black hover:bg-[#5FB3B7] shadow-xl shadow-cyan-100 transition-all active:scale-95"
              >
                MULA MERAKAM
              </button>
            </div>
          )}

          {status === 'recording' && (
            <div className="flex flex-col items-center justify-center py-16 bg-[#1A4D50] rounded-[32px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full border-[20px] border-white animate-pulse" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-5xl font-black mb-8 font-mono">{formatTime(timer)}</div>
                <div className="flex gap-4 items-center mb-10">
                   {[...Array(12)].map((_, i) => (
                     <div 
                      key={i} 
                      className="w-1.5 bg-[#6FC7CB] rounded-full animate-bounce" 
                      style={{ height: `${20 + Math.random() * 40}px`, animationDelay: `${i * 0.1}s` }} 
                     />
                   ))}
                </div>
                <button 
                  onClick={stopRecording}
                  className="size-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-2xl shadow-red-500/20 active:scale-90"
                >
                  <Square className="size-8 fill-white text-white" />
                </button>
                <p className="mt-6 font-bold text-red-200 uppercase tracking-widest text-xs animate-pulse">BERHENTI RAKAMAN</p>
              </div>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
              <Loader2 className="size-16 text-[#6FC7CB] animate-spin mb-8" />
              <h3 className="text-2xl font-black text-slate-800 mb-2">Menganalisis Bacaan...</h3>
              <p className="text-slate-400 font-medium animate-pulse italic text-center max-w-sm px-4">
                Sistem AI sedang membandingkan rakaman anda dengan teks Al-Quran standar & hukum Tajwid.
              </p>
            </div>
          )}

          {status === 'completed' && result && (
            <div className="space-y-8 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl relative overflow-hidden">
                  <Award className="absolute -right-4 -bottom-4 size-24 text-emerald-100 rotate-12" />
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-1">Ketepatan</p>
                  <p className="text-4xl font-black text-emerald-700">{result.accuracy}%</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl relative overflow-hidden">
                   <Zap className="absolute -right-4 -bottom-4 size-24 text-blue-100 rotate-12" />
                   <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Kelancaran</p>
                   <p className="text-4xl font-black text-blue-700">{result.smoothness}%</p>
                </div>
                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl relative overflow-hidden">
                   <BookOpen className="absolute -right-4 -bottom-4 size-24 text-indigo-100 rotate-12" />
                   <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-1">Tajwid</p>
                   <p className="text-4xl font-black text-indigo-700">{result.tajwid}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Volume2 className="size-6 text-[#6FC7CB]" />
                    <h4 className="text-xl font-bold">Transkripsi AI</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic text-lg mb-8">
                    "{result.transcription}"
                  </p>
                  <button onClick={() => setStatus('idle')} className="inline-flex items-center gap-2 text-[#6FC7CB] font-bold hover:underline">
                    <RefreshCcw className="size-4" /> Cuba Sekali Lagi
                  </button>
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="size-6 text-amber-500" />
                    <h4 className="text-xl font-bold text-slate-800">Teguran AI</h4>
                  </div>
                  <div className="space-y-4">
                    {result.mistakes.map((m, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 font-medium items-center">
                        <div className="size-8 bg-amber-100 rounded-full flex items-center justify-center text-xs font-black shrink-0">{i+1}</div>
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-[#6FC7CB]/5 rounded-2xl text-[#1A4D50] text-sm font-medium">
                    💡 <strong>Tips Global:</strong> Fokuskan pada makhraj "Qaf" dan perkemaskan "Mad Asli" untuk markah 100%.
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                 <button className="w-full md:w-auto px-10 py-4 bg-[#1A4D50] text-white rounded-2xl font-black hover:bg-slate-900 shadow-xl transition-all active:scale-95">
                    HANTAR KEPADA MURABBI
                 </button>
                 <button onClick={() => setStatus('idle')} className="w-full md:w-auto px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">
                    BATAL
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-[24px] flex gap-4">
        <Sparkles className="size-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <h5 className="font-bold text-amber-900">Teknologi Penilaian Quranic-AI</h5>
          <p className="text-amber-700 text-sm leading-relaxed mt-1">
            Sistem penilaian audio ini menggunakan model pengecaman pertuturan khusus untuk Bahasa Arab dan hukum Tajwid. Markah yang diberikan adalah sebagai rujukan awal sebelum disahkan oleh Murabbi anda.
          </p>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, ChevronRight, BookOpen, Clock, Target, Calendar } from 'lucide-react';

interface Phase {
  title: string;
  duration: string;
  juzuk: string;
  details: string[];
  color: string;
  bg: string;
  border: string;
}

const phases: Phase[] = [
  {
    title: 'FASA 1',
    duration: '3 Bulan',
    juzuk: 'Juzuk 30, 1, 2, 3, 4, 5, 6, 7',
    details: ['Tahsin', 'MINIMUM 8 Juzuk'],
    color: '#84cc16', // lime-500
    bg: '#f7fee7',
    border: '#d9f99d',
  },
  {
    title: 'FASA 2',
    duration: '3 Bulan',
    juzuk: 'Juzuk 8, 9, 10, 11, 12, 13, 14, 15',
    details: ['MINIMUM 8 Juzuk'],
    color: '#f59e0b', // amber-500
    bg: '#fffbeb',
    border: '#fef3c7',
  },
  {
    title: 'FASA 3',
    duration: '3 Bulan',
    juzuk: 'Juzuk 16, 17, 18, 19, 20, 21, 22, 23',
    details: ['MINIMUM 8 Juzuk'],
    color: '#ef4444', // red-500
    bg: '#fef2f2',
    border: '#fee2e2',
  },
  {
    title: 'FASA AKHIR',
    duration: '3 Bulan',
    juzuk: 'Juzuk 24, 25, 26, 27, 28, 29',
    details: ['MINIMUM 6 Juzuk', 'Tasbit'],
    color: '#db2777', // pink-600
    bg: '#fdf2f8',
    border: '#fce7f3',
  },
];

export function StudyRoadmap() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">"STUDY SESSION"</h2>
        <p className="text-xl font-bold text-[#6FC7CB] mt-1 italic uppercase tracking-widest">Setahun Menempa Sejarah</p>
      </div>

      {/* Intro info card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="size-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-[#6FC7CB]">
             <Calendar className="size-8" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Tempoh</p>
             <p className="text-xl font-black text-slate-800">12 BULAN</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="size-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
             <BookOpen className="size-8" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Hafazan</p>
             <p className="text-xl font-black text-slate-800">30 JUZUK</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="size-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
             <Target className="size-8" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fokus Utama</p>
             <p className="text-xl font-black text-slate-800">ITQAN & TASBIT</p>
           </div>
        </div>
      </div>

      {/* Path Roadmap */}
      <div className="flex flex-col gap-6 relative">
        {/* Connection line for Desktop */}
        <div className="absolute left-[3.4rem] top-10 bottom-10 w-1 bg-slate-100 hidden md:block" />

        {phases.map((phase, idx) => (
          <div 
            key={idx} 
            className="group relative flex flex-col md:flex-row gap-6 md:items-center animate-in slide-in-from-left-4 duration-700"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Phase Bubble */}
            <div 
              className="z-10 size-28 rounded-[40px] flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500"
              style={{ background: phase.color }}
            >
              <div className="text-center">
                 <p className="text-[10px] font-black opacity-80 uppercase leading-none mb-1">Fasa</p>
                 <p className="text-2xl font-black">{idx === 3 ? 'AKHIR' : idx + 1}</p>
              </div>
            </div>

            {/* Content Card */}
            <div 
              className="flex-1 p-8 rounded-[40px] border-2 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-slate-100"
              style={{ background: phase.bg, borderColor: phase.border }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-5 py-1.5 rounded-full text-white font-black text-xs uppercase tracking-widest" style={{ background: phase.color }}>
                    {phase.duration}
                  </div>
                  <div className="h-px w-8 bg-slate-300" />
                  <Target className="size-5" style={{ color: phase.color }} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{phase.title}</h3>
                  <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <BookOpen className="size-4" />
                    <span>{phase.juzuk}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {phase.details.map((detail, i) => (
                   <span 
                    key={i} 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold shadow-sm"
                   >
                     <CheckCircle2 className="size-4 text-emerald-500" />
                     {detail}
                   </span>
                ))}
              </div>
            </div>

            {/* Desktop Connector Arrow */}
            <div className="hidden md:block absolute right-[-2.5rem] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
               <ChevronRight className="size-10 text-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 text-white p-10 rounded-[48px] relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 bottom-0 size-64 bg-[#6FC7CB]/20 rounded-full blur-[100px] -mr-32 -mb-32" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h4 className="text-2xl font-black mb-2">Misi Hafiz 30 Juzuk Sebulan</h4>
              <p className="text-slate-400 font-medium max-w-lg">
                Sukatan pelajaran ini dirangka secara intensif untuk memastikan pelajar mampu menghafal 30 Juzuk Al-Quran dalam tempoh 12 bulan dengan kualiti hafazan yang mantap.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="Logo" className="h-16 opacity-50 grayscale invert" />
            </div>
         </div>
      </div>
    </div>
  );
}

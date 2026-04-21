import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, MessageSquare, Info, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const TAJWID_RULES: Record<string, string> = {
  'ikhfa': 'Ikhfa dari segi bahasa bermaksud menyembunyikan. Dari segi istilah tajwid, ia bermaksud menyebut huruf di antara sebutan Izhar dan Idgham tanpa Tasydid, berserta dengan Ghunnah (dengung).',
  'izhar': "Izhar bermaksud menerangkan atau menjelaskan sebutan huruf Nun Sakinah atau Tanwin tanpa dengung apabila bertemu dengan huruf-huruf Halqi (Alif, Ha, Kha, 'Ain, Ghain, Ha).",
  'idgham': 'Idgham bermaksud memasukkan suara huruf pertama ke dalam huruf kedua. Terbahagi kepada dua: Idgham Maal Ghunnah (dengan dengung) dan Idgham Bila Ghunnah (tanpa dengung).',
  'iqlab': 'Iqlab bermaksud menukarkan bunyi Nun Sakinah atau Tanwin kepada bunyi Mim (m) yang ringan apabila bertemu dengan huruf Ba (ب), berserta dengan dengung.',
  'mad': 'Mad bermaksud memanjangkan suara pada huruf Mad (Alif, Wau, Ya). Terdapat pelbagai jenis Mad seperti Mad Asli, Mad Wajib Muttasil, dan Mad Jaiz Munfasil.',
  'qalqalah': 'Qalqalah bermaksud bunyi lantunan atau pantulan suara apabila menyebut huruf-huruf Qalqalah (Qaf, Tha, Ba, Jim, Dal) yang bertanda sukun atau diwaqafkan.',
  'waqaf': 'Waqaf bermaksud memberhentikan bacaan di akhir kalimah untuk mengambil nafas dengan niat untuk menyambung semula bacaan.',
  'salam': 'Waalaikumussalam! Saya Pembantu AI Tajwid anda. Ada apa yang boleh saya bantu hari ini?',
  'hai': 'Hai! Saya sedia membantu anda belajar Tajwid. Tanya saya tentang Ikhfa, Izhar, Qalqalah atau apa sahaja!',
  'terima kasih': 'Sama-sama! Semoga Allah permudahkan urusan hafalan dan pembelajaran anda. Amin.',
};

export function AITajwidBuddy() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Assalamualaikum! Saya Ustaz Bot, pembantu AI Tajwid anda. Ada sebarang hukum tajwid yang ingin anda tanyakan?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getBotResponse(input);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const getBotResponse = (query: string) => {
    const q = query.toLowerCase();
    
    for (const key in TAJWID_RULES) {
      if (q.includes(key)) return TAJWID_RULES[key];
    }

    return "Maaf, saya masih belajar tentang itu. Buat masa ini saya pakar tentang hukum Nun Sakinah (Ikhfa, Izhar, dll), Qalqalah, dan Mad. Cuba tanya soalan berkaitan!";
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
      
      {/* Header */}
      <div className="bg-[#1A4D50] p-6 text-white flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
            <Bot className="w-6 h-6 text-teal-100" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">AI Tajwid Buddy</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-teal-200 uppercase">Sedia Membantu</span>
            </div>
          </div>
        </div>
        <div className="bg-white/10 p-2 rounded-xl text-xs font-bold font-mono">
           v2.0-SABAR
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.sender === 'user' ? 'bg-indigo-600' : 'bg-[#1A4D50]'}`}>
                  {m.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-teal-200" />}
               </div>
               <div className={`p-4 rounded-2xl shadow-sm relative ${
                 m.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
               }`}>
                  <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                  <span className={`text-[9px] mt-2 block opacity-50 font-bold ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
               </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
               <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-6 py-3 bg-white/50 backdrop-blur-sm border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
         {['Apa itu Ikhfa?', 'Hukum Qalqalah', 'Terangkan Mad', 'Nasihat Motivasi'].map((hint, i) => (
           <button 
             key={i} 
             onClick={() => setInput(hint)}
             className="whitespace-nowrap px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-[#1A4D50] hover:text-white hover:border-[#1A4D50] transition-all shadow-sm"
           >
             {hint}
           </button>
         ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya soalan tajwid..."
          className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#1A4D50] transition-all text-sm font-medium"
        />
        <button 
          onClick={handleSend}
          className="p-3 bg-[#1A4D50] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-teal-900/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Background Micro-animation */}
      <div className="absolute top-20 right-10 opacity-5 pointer-events-none">
         <Zap className="w-40 h-40 text-[#1A4D50]" />
      </div>
    </div>
  );
}

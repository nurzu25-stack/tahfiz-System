import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, AlertCircle, Calendar, 
  ArrowUpRight, ArrowDownRight, Printer, Download, Filter, RefreshCw
} from 'lucide-react';

export function FinancialAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get('/api/analytics/financial');
      setData(resp.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-8 h-8 text-[#1A4D50] animate-spin" />
    </div>
  );

  const COLORS = ['#1A4D50', '#6FC7CB', '#F43F5E', '#FBBF24'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Analitik Kewangan</h2>
          <p className="text-slate-500 font-medium">Analisis kutipan yuran and unjuran pendapatan</p>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-[#1A4D50] text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-teal-100">
              <Printer className="w-4 h-4" /> CETAK LAPORAN
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Jumlah Kutipan', value: `RM ${data?.totalCollected?.toLocaleString()}`, icon: DollarSign, color: 'emerald', trend: '+12%', isUp: true },
           { label: 'Jumlah Tunggakan', value: `RM ${data?.totalPending?.toLocaleString()}`, icon: AlertCircle, color: 'rose', trend: '-5%', isUp: false },
           { label: 'Unjuran Bulanan', value: `RM ${data?.forecast?.toLocaleString()}`, icon: TrendingUp, color: 'cyan', trend: 'Stabil', isUp: true },
           { label: 'Kadar Kutipan', value: `${data?.collectionRate}%`, icon: Users, color: 'amber', trend: 'Bagus', isUp: true },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform`}></div>
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-4`}>
                 <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h4>
              <div className="mt-4 flex items-center gap-2">
                 <span className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                 </span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Bulan Lepas</span>
              </div>
           </div>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-[#1A4D50]" /> TREND KUTIPAN (6 BULAN)
              </h3>
              <select className="text-xs font-black bg-slate-50 border-none rounded-lg px-4 py-2 text-slate-500 focus:ring-0">
                 <option>SEMUA KELAS</option>
                 <option>AL-FALAH</option>
                 <option>AL-IMAN</option>
              </select>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                  <Tooltip 
                    cursor={{fill: '#F1F5F9'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 600, fontSize: '12px'}} />
                  <Bar dataKey="kutipan" fill="#1A4D50" radius={[6, 6, 0, 0]} name="Kutipan (RM)" />
                  <Bar dataKey="tunggakan" fill="#6FC7CB" radius={[6, 6, 0, 0]} name="Tunggakan (RM)" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Side Stats / Ratio */}
        <div className="space-y-8">
           <div className="bg-[#1A4D50] p-8 rounded-3xl text-white shadow-xl shadow-teal-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-teal-100">
                 <TrendingUp className="w-5 h-5" /> RINGKASAN PRESTASI
              </h3>
              <div className="space-y-6 relative">
                 <div>
                    <p className="text-xs text-teal-200 font-bold uppercase tracking-widest">Kapasiti Pelajar Aktif</p>
                    <div className="flex items-end justify-between mt-1">
                       <h4 className="text-3xl font-black">{data?.activeStudents}</h4>
                       <span className="text-teal-300 text-xs font-bold font-mono">MAKS: 100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mt-2">
                       <div className="h-2 bg-teal-400 rounded-full" style={{ width: `${(data?.activeStudents / 100) * 100}%` }}></div>
                    </div>
                 </div>
                 
                 <div>
                    <p className="text-xs text-teal-200 font-bold uppercase tracking-widest">KPI Kutipan</p>
                    <div className="flex items-end justify-between mt-1">
                       <h4 className="text-3xl font-black">{data?.collectionRate}%</h4>
                       <span className="text-teal-300 text-xs font-bold font-mono">TARGET: 90%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mt-2">
                       <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${data?.collectionRate}%` }}></div>
                    </div>
                 </div>

                 <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-xs text-teal-200 font-bold italic">
                       "Sistem meramalkan peningkatan kutipan sebanyak 5% untuk bulan hadapan berdasarkan data sejarah."
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-6">NISBAH KUTIPAN</h3>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={[
                             { name: 'Diterima', value: data?.totalCollected },
                             { name: 'Tunggakan', value: data?.totalPending },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          <Cell fill="#1A4D50" />
                          <Cell fill="#6FC7CB" />
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-[#1A4D50]"></div> DITERIMA
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-[#6FC7CB]"></div> TUNGGAKAN
                 </div>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}

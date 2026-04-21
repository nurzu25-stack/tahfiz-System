import { useState, useRef } from 'react';
import { Brain, TrendingUp, Calendar, Download, RefreshCw, Upload, X, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { useAppStore, computeAIPrediction } from '../../store/AppContext';
import axios from 'axios';

export function AIPrediction() {
  const { state } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predictions = state.students.map(s => computeAIPrediction(state, s.id)).filter(Boolean) as NonNullable<ReturnType<typeof computeAIPrediction>>[];

  const avgConfidence = predictions.length
    ? Math.round(predictions.reduce((sum, p) => sum + parseInt(p!.confidence), 0) / predictions.length)
    : 0;

  const totalAyahAnalyzed = state.hafazanRecords.reduce((sum, r) => sum + (r.ayahCount ?? 0), 0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setGenerated(true); }, 1500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsImporting(true);
    setImportResult(null);

    try {
      const response = await axios.post('/api/ai/import-alumni', formData);
      setImportResult({ success: true, message: response.data.message });
      // Reset after success
      setTimeout(() => {
        setShowImportModal(false);
        setImportResult(null);
      }, 2000);
    } catch (error: any) {
      setImportResult({ 
        success: false, 
        message: error.response?.data?.message || 'Gagal mengimport data.' 
      });
    } finally {
      setIsImporting(false);
    }
  };

  const trendColor = (t: string) => t === 'Mumtaz' ? 'bg-green-100 text-green-700' : t === 'Jayyid' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ringkasan Ramalan AI</h2>
          <p className="text-gray-600 mt-1">Anggaran khatam dan trend prestasi berkuasa AI</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm"
          >
            <Upload className="w-4 h-4" /> DATA SEJARAH
          </button>
          <button onClick={handleGenerate} disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            {isGenerating ? 'Menganalisis...' : 'Jana Semula'}
          </button>
          <button onClick={() => { const data = JSON.stringify(predictions, null, 2); const b = new Blob([data], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'ai_predictions.json'; a.click(); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-5 h-5" /> Muat Turun Laporan
          </button>
        </div>
      </div>

      {/* AI Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm"><Brain className="w-8 h-8 text-purple-600" /></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjin Analisis AI</h3>
            <p className="text-gray-700 mb-4">Sistem AI kami menganalisis kemajuan hafazan, corak kehadiran, dan konsistensi pembayaran untuk menyediakan anggaran khatam yang tepat dan cadangan peribadi.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Titik Data Ayat', value: totalAyahAnalyzed.toLocaleString() },
                { label: 'Purata Ketepatan', value: `${avgConfidence}%` },
                { label: 'Pelajar Dipantau', value: state.students.length },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">{m.label}</p>
                  <p className="text-xl font-semibold text-purple-600">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      {generated && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-green-800 text-sm font-medium">
          ✅ Ramalan AI dikemas kini menggunakan rekod hafazan, data kehadiran, dan sejarah pembayaran terkini.
        </div>
      )}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ramalan Individu</h3>
        {predictions.map((pred, index) => pred && (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{pred.studentName}</h4>
                <p className="text-sm text-gray-600">Kemajuan Semasa: {pred.currentProgress}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${trendColor(pred.performanceTrend)}`}>{pred.performanceTrend}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { icon: <Calendar className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', label: 'Anggaran Khatam', value: pred.estimatedCompletion },
                { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', label: 'Tahap Keyakinan', value: pred.confidence },
                { icon: <Brain className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', label: 'Cadangan AI', value: pred.recommendation },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`p-2 ${item.bg} rounded-lg`}>{item.icon}</div>
                  <div><p className="text-xs text-gray-600">{item.label}</p><p className="text-sm font-semibold text-gray-900">{item.value}</p></div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <span>📅 Kadar Kehadiran: <strong>{pred.attendanceRate}</strong></span>
              <span>📖 Purata Ayat/Hari: <strong>{pred.avgAyahPerDay}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* ── IMPORT MODAL ── */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Latih Ramalan AI</h3>
                  <p className="text-slate-400 text-xs">Muat naik data khatam alumni</p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!importResult ? (
              <div 
                className="relative border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-indigo-200 transition-all cursor-pointer bg-slate-50/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden" 
                  accept=".xlsx,.xls,.csv"
                />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  {isImporting ? <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" /> : <Upload className="w-8 h-8 text-indigo-500" />}
                </div>
                <p className="font-bold text-slate-700">Klik untuk muat naik fail</p>
                <p className="text-slate-400 text-xs mt-1">Excel (.xlsx) atau CSV sahaja</p>
              </div>
            ) : (
              <div className={`p-8 rounded-3xl text-center ${importResult.success ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {importResult.success ? (
                   <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                ) : (
                   <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <p className={`font-bold ${importResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {importResult.message}
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Format Header Excel:</p>
               <p className="text-[10px] text-blue-700 leading-relaxed font-mono">
                 NAME, TARIKH MULA, TARIKH KHATAM, MURABBI, NO MATRIK, NO MYKAD
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
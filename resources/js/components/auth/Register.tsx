import { useState } from 'react';
import { BookOpen, Mail, Lock, User, Phone, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import axios from 'axios';

interface RegisterProps {
  onRegister: (role: 'student' | 'parent', name: string) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const { dispatch } = useAppStore();
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Student specific
    age: '',
    parentName: '',
    parentContact: '',
    // Parent specific
    childName: '',
    childAge: '',
    // Detailed Parent
    job: '',
    income: '',
  });

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
      // Call actual backend API
      const response = await axios.post('/api/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: role,
        // Optional but good for DB:
        job: role === 'parent' ? formData.job : undefined,
        income: role === 'parent' ? Number(formData.income) : undefined,
      });

      // Update local state for mock fallback if needed
      dispatch({
        type: 'ADD_USER',
        payload: {
          id: String(response.data.user.id),
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role as any,
          status: 'pending',
          password: '••••••••'
        }
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Gagal mendaftar. Sila cuba lagi atau hubungi pentadbir.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-green-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pendaftaran Berjaya!</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Terima kasih kerana mendaftar. Akaun anda sedang dalam proses semakan. 
            Sila tunggu kelulusan daripada <strong>Mudir (Admin)</strong> sebelum anda boleh log masuk ke dalam portal.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100"
          >
            KEMBALI KE LOG MASUK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 overflow-auto">
      <div className="w-full max-w-2xl my-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our Tahfiz Management — <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Portal Al-Amalillah</span></p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-xl border-2 transition-all ${
              role === 'student'
                ? 'border-green-600 bg-green-50'
                : 'border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="text-center">
              <User className={`w-8 h-8 mx-auto mb-2 ${role === 'student' ? 'text-green-600' : 'text-slate-400'}`} />
              <p className={`font-bold text-[10px] uppercase tracking-widest ${role === 'student' ? 'text-green-600' : 'text-slate-600'}`}>
                STUDENT (PELAJAR)
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`p-4 rounded-xl border-2 transition-all ${
              role === 'parent'
                ? 'border-green-600 bg-green-50'
                : 'border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="text-center">
              <User className={`w-8 h-8 mx-auto mb-2 ${role === 'parent' ? 'text-green-600' : 'text-slate-400'}`} />
              <p className={`font-bold text-[10px] uppercase tracking-widest ${role === 'parent' ? 'text-green-600' : 'text-slate-600'}`}>
                PARENT (WARIS)
              </p>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-in zoom-in duration-300">
               <AlertCircle className="w-4 h-4 flex-shrink-0" />
               <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+60 12-345 6789"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  required={role === 'student'}
                />
              </div>
            )}
          </div>

          {/* Parent Specific Fields */}
          {role === 'parent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Child Name *
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="Child's full name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Child Age *
                </label>
                <input
                  type="number"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  placeholder="Child's age"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Pekerjaan *
                </label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  placeholder="Contoh: Pegawai Bank"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Pendapatan Bulanan (RM) *
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="Contoh: 5000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" className="rounded border-slate-200" required />
            <label htmlFor="terms" className="text-xs font-medium text-slate-500">
              I agree to the Terms and Conditions
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UserPlus className="w-5 h-5" />
              {isLoading ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
            </button>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="px-6 py-3.5 border-2 border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all font-bold"
            >
              CANCEL
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <p className="text-slate-500 text-xs font-semibold">
            ALREADY HAVE AN ACCOUNT?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-700 font-bold"
            >
              LOGIN HERE
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

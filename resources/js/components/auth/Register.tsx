import { useState } from 'react';
import { BookOpen, Mail, Lock, User, Phone, UserPlus, X, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { genId } from '../../store/mockData';

interface RegisterProps {
  onRegister: (role: 'student' | 'parent', name: string) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const { dispatch } = useAppStore();
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add user to store with pending status
    const userId = genId('u');
    dispatch({
      type: 'ADD_USER',
      payload: {
        id: userId,
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
        status: 'pending',
        phone: formData.phone,
        // Detailed Parent
        job: role === 'parent' ? formData.job : undefined,
        wage: role === 'parent' ? Number(formData.income) : undefined,
      }
    });

    setIsSubmitted(true);
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
          <h1 className="text-3xl font-semibold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our Tahfiz Management System</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === 'student'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <User className={`w-8 h-8 mx-auto mb-2 ${role === 'student' ? 'text-green-600' : 'text-gray-400'}`} />
              <p className={`font-medium ${role === 'student' ? 'text-green-600' : 'text-gray-600'}`}>
                Student
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === 'parent'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <User className={`w-8 h-8 mx-auto mb-2 ${role === 'parent' ? 'text-green-600' : 'text-gray-400'}`} />
              <p className={`font-medium ${role === 'parent' ? 'text-green-600' : 'text-gray-600'}`}>
                Parent
              </p>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+60 12-345 6789"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required={role === 'student'}
                />
              </div>
            )}
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Parent's full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Contact *
                </label>
                <input
                  type="tel"
                  value={formData.parentContact}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                  placeholder="Parent's phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Parent Specific Fields */}
          {role === 'parent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child Name *
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="Child's full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child Age *
                </label>
                <input
                  type="number"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  placeholder="Child's age"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pekerjaan *
                </label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  placeholder="Contoh: Pegawai Bank"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pendapatan Bulanan (RM) *
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="Contoh: 5000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" className="rounded border-gray-300" required />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the Terms and Conditions
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Submit Registration
            </button>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 animate-pulse-glow">
            <FiHome className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome Back to LERE.lb</h2>
          <p className="text-gray-400">Sign in to continue your property search journey across Lebanon.</p>
          <div className="mt-8 flex justify-center gap-3">
            {['Beirut', 'Tripoli', 'Jounieh'].map(city => (
              <span key={city} className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-300">{city}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg"><FiHome className="text-white text-lg" /></div>
              <span className="font-bold text-xl text-gray-800">LERE<span className="text-primary-600">.lb</span></span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-1">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-modern !pl-11" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-modern !pl-11 !pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'} <FiArrowRight />
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

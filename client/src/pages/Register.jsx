import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone, role: form.role });
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <FiUser className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Join LERE.lb Today</h2>
          <p className="text-gray-400">Create your account and start exploring thousands of properties across Lebanon.</p>
          <div className="mt-8 space-y-3">
            {[
              'Browse premium properties',
              'Save your favorites',
              'Connect with expert agents',
              'Get personalized alerts',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1">Start your property journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input-modern" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative"><FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-modern !pl-11" required /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
              <div className="relative"><FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-modern !pl-11" placeholder="+961 3 123 456" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-modern">
                <option value="buyer">Buyer / Renter</option>
                <option value="seller">Property Owner</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-modern !pl-11" placeholder="Min 8 chars" required /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                <div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="input-modern !pl-11" required /></div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight />
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

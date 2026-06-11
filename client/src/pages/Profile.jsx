import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiSave, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    setSaving(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Current password is incorrect'); }
    setSaving(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-5 pb-6 mb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-0.5 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 capitalize">{user?.role}</span>
                <span className="text-sm text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input-modern" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5"><FiMail className="inline mr-1.5" />Email</label>
              <input type="email" value={user?.email} disabled className="input-modern bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5"><FiPhone className="inline mr-1.5" />Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-modern" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary !py-3 disabled:opacity-50">
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2"><FiLock className="text-primary-500" /> Change Password</h3>
          <p className="text-sm text-gray-500 mb-5">Update your account password</p>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="input-modern" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="input-modern" required />
              </div>
            </div>
            <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

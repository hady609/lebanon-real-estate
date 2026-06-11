import { useState, useEffect } from 'react';
import api from '../api/client';
import { FiHome, FiUsers, FiClock, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiDollarSign, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-10 skeleton w-64" />
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(n => <div key={n} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your real estate platform</p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { icon: FiHome, label: 'Total Properties', value: stats.totalProperties, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
                { icon: FiCheckCircle, label: 'Active Listings', value: stats.activeListings, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                { icon: FiClock, label: 'Pending Approval', value: stats.pendingApprovals, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
                { icon: FiUsers, label: 'Total Users', value: stats.totalUsers, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
                { icon: FiTrendingUp, label: 'Agents', value: stats.totalAgents, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
                { icon: FiAlertCircle, label: 'Inquiries', value: stats.totalInquiries, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                  <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className={`${s.text} text-xl`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {stats.propertiesByType?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">Properties by Type</h3>
                  <div className="space-y-4">
                    {stats.propertiesByType.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="capitalize font-medium text-gray-700">{item._id}</span>
                          <span className="font-semibold text-gray-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(item.count / stats.totalProperties) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.propertiesByCity?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">Top Cities</h3>
                  <div className="space-y-3">
                    {stats.propertiesByCity.slice(0, 8).map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                          <span className="font-medium text-gray-700">{item._id}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.recentTransactions?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-3 font-semibold text-gray-600">Property</th>
                          <th className="pb-3 font-semibold text-gray-600">Buyer</th>
                          <th className="pb-3 font-semibold text-gray-600">Amount</th>
                          <th className="pb-3 font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentTransactions.map((t, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 text-gray-800 font-medium">{t.property?.title || 'N/A'}</td>
                            <td className="py-3 text-gray-600">{t.buyer?.firstName} {t.buyer?.lastName}</td>
                            <td className="py-3 font-semibold text-gray-900">${t.amount?.toLocaleString()}</td>
                            <td className="py-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

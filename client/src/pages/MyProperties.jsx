import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { FiGrid, FiPlus, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties/mine').then(r => setProperties(r.data.properties)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-10 skeleton w-48 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-80 skeleton rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiGrid className="text-primary-600" /> My Properties
            </h1>
            <p className="text-gray-500 mt-1">{properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <button disabled className="btn-primary opacity-60 cursor-not-allowed text-sm">
            <FiPlus /> Add Property (Soon)
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><FiGrid className="text-gray-400 text-3xl" /></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No listings yet</h3>
            <p className="text-gray-500">You haven't listed any properties yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p._id} className="relative">
                <PropertyCard property={p} />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {!p.approved && (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-100 backdrop-blur-sm flex items-center gap-1">
                      <FiAlertCircle /> Pending
                    </span>
                  )}
                  {!p.isActive && (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold text-red-700 bg-red-100 backdrop-blur-sm flex items-center gap-1">
                      <FiXCircle /> Inactive
                    </span>
                  )}
                  {p.approved && p.isActive && (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-100 backdrop-blur-sm flex items-center gap-1">
                      <FiCheckCircle /> Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

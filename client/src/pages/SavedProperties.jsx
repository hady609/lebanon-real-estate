import { useState, useEffect } from 'react';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { FiHeart, FiTrash2, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me').then(r => setProperties(r.data.user.savedProperties || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const removeSaved = async (id) => {
    try {
      const { data } = await api.post(`/auth/save-property/${id}`);
      setProperties(p => p.filter(prop => prop._id !== id));
      toast.success(data.message);
    } catch { toast.error('Failed to remove'); }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiHeart className="text-red-500" /> Saved Properties
          </h1>
          <p className="text-gray-500 mt-1">{properties.length} saved {properties.length === 1 ? 'property' : 'properties'}</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4"><FiHeart className="text-red-400 text-3xl" /></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved properties</h3>
            <p className="text-gray-500 mb-6">Start browsing and save properties you love.</p>
            <Link to="/properties" className="btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <div key={p._id} className="relative group animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <PropertyCard property={p} />
                <button onClick={() => removeSaved(p._id)} className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                  <FiTrash2 className="text-red-500 text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

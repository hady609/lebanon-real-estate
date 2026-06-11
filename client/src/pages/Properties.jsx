import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiHome, FiSliders, FiRefreshCw } from 'react-icons/fi';

const cities = ['All Cities', 'Beirut', 'Tripoli', 'Jounieh', 'Sidon', 'Tyre', 'Zahle', 'Baalbeck', 'Byblos', 'Aley', 'Batroun', 'Nabatieh', 'Broummana', 'Bikfaya'];
const types = ['All Types', 'apartment', 'villa', 'house', 'penthouse', 'duplex', 'studio', 'land', 'commercial', 'office', 'building', 'townhouse', 'chalet'];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    purpose: searchParams.get('purpose') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    furnished: searchParams.get('furnished') || '',
    keyword: searchParams.get('keyword') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => { loadProperties(); }, [searchParams]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const { data } = await api.get('/properties', { params });
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
    } catch { setProperties([]); }
    finally { setLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const updateParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    updateParams(filters);
  };

  const clearFilters = () => {
    const cleared = { purpose: '', type: '', city: '', minPrice: '', maxPrice: '', minBedrooms: '', furnished: '', keyword: '', sort: 'newest' };
    setFilters(cleared);
    setSearchParams({});
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p.toString());
    setSearchParams(params);
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <FiChevronRight className="text-xs" />
              <span className="text-gray-800 font-medium">Properties</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Properties in Lebanon</h1>
            {total > 0 && <p className="text-gray-500 mt-1">{total} properties found</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary text-sm !py-2.5 ${showFilters ? 'border-primary-500 text-primary-600 bg-primary-50' : ''}`}>
              <FiSliders /> Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-600" />}
            </button>
            <select name="sort" value={filters.sort} onChange={(e) => { const nf = {...filters, sort: e.target.value}; setFilters(nf); updateParams(nf); }} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="bedrooms">Most Bedrooms</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="animate-scale-in mb-6">
            <form onSubmit={applyFilters} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Keyword</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input type="text" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Search..." className="input-modern !pl-9" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Purpose</label>
                  <select name="purpose" value={filters.purpose} onChange={handleFilterChange} className="input-modern">
                    <option value="">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange} className="input-modern">
                    {types.map(t => <option key={t} value={t === 'All Types' ? '' : t}>{t === 'All Types' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
                  <select name="city" value={filters.city} onChange={handleFilterChange} className="input-modern">
                    {cities.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Bedrooms</label>
                  <select name="minBedrooms" value={filters.minBedrooms} onChange={handleFilterChange} className="input-modern">
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Price (USD)</label>
                  <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="e.g. 50,000" className="input-modern" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Max Price (USD)</label>
                  <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="e.g. 500,000" className="input-modern" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Furnished</label>
                  <select name="furnished" value={filters.furnished} onChange={handleFilterChange} className="input-modern">
                    <option value="">Any</option>
                    <option value="true">Furnished</option>
                    <option value="false">Unfurnished</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 md:col-span-2">
                  <button type="submit" className="btn-primary !py-2.5 text-sm flex-1"><FiSearch /> Search</button>
                  <button type="button" onClick={clearFilters} className="btn-secondary !py-2.5 text-sm"><FiRefreshCw /></button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-52 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-4 skeleton w-1/2" />
                  <div className="h-10 skeleton w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><FiHome className="text-gray-400 text-3xl" /></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search filters or explore different cities.</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p, i) => (
                <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button disabled={page <= 1} onClick={() => goToPage(page - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all bg-white">
                  <FiChevronLeft />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => goToPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'border border-gray-200 hover:border-primary-500 hover:text-primary-600 bg-white'}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page >= pages} onClick={() => goToPage(page + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all bg-white">
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

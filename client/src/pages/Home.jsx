import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiTrendingUp, FiUsers, FiShield, FiHome, FiArrowRight, FiStar, FiChevronRight, FiPlay } from 'react-icons/fi';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';

const cities = ['Beirut', 'Tripoli', 'Jounieh', 'Sidon', 'Tyre', 'Zahle', 'Byblos', 'Baalbeck', 'Aley', 'Batroun'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState({ purpose: 'sale', city: '', type: '', keyword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/properties/featured').then(r => setFeatured(r.data.properties)).catch(() => {});
    api.get('/properties/locations').then(r => setLocations(r.data.locations)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params}`);
  };

  const totalProperties = locations.reduce((s, l) => s + l.count, 0);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-300 mb-6">
                <FiStar className="text-amber-400 text-xs" />
                <span>Lebanon's #1 Real Estate Platform</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-balance">
                Find Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Dream Home</span>
                <br />in Lebanon
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-8 leading-relaxed">
                Discover thousands of premium properties across all Lebanese regions. From Beirut apartments to mountain villas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/properties" className="btn-primary !px-8 !py-4 text-base group">
                  Explore Properties <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/register" className="btn-secondary !px-8 !py-4 text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30">
                  <FiPlay className="text-sm" /> Get Started
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                <div><div className="text-2xl font-bold text-white">{totalProperties || '300'}+</div><div className="text-sm text-gray-500">Properties</div></div>
                <div><div className="text-2xl font-bold text-white">{cities.length}+</div><div className="text-sm text-gray-500">Cities</div></div>
                <div><div className="text-2xl font-bold text-white">50+</div><div className="text-sm text-gray-500">Agents</div></div>
              </div>
            </div>

            <div className="hidden lg:block animate-fade-in-up animate-in-delay-2">
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl mb-4 animate-pulse-glow">
                        <FiHome className="text-white text-3xl" />
                      </div>
                      <p className="text-white/60 text-sm">Premium Properties Across Lebanon</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-primary-500/10 rounded-full blur-2xl" />
                <div className="absolute -top-4 -right-4 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSearch} className="glass rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row gap-3 animate-scale-in">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search properties by keyword..." value={search.keyword} onChange={e => setSearch({...search, keyword: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-transparent border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <select value={search.purpose} onChange={e => setSearch({...search, purpose: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <select value={search.city} onChange={e => setSearch({...search, city: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={search.type} onChange={e => setSearch({...search, type: e.target.value})} className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
              <option value="">All Types</option>
              {['apartment', 'villa', 'house', 'penthouse', 'land', 'commercial', 'office'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary !px-8 !py-3.5 text-sm whitespace-nowrap">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Featured</span>
                <h2 className="section-title mt-2">Premium Properties</h2>
                <p className="section-subtitle mt-2">Hand-picked properties for discerning buyers</p>
              </div>
              <Link to="/properties?featured=true" className="btn-secondary text-sm group">
                View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Browse by Location</span>
            <h2 className="section-title mt-2">Explore Cities</h2>
            <p className="section-subtitle mx-auto mt-2">Find properties in Lebanon's most sought-after locations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.map((city, i) => (
              <Link key={city} to={`/properties?city=${city}`}
                className="group relative p-6 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <FiMapPin className="relative text-primary-600 group-hover:text-white text-xl mb-2 transition-colors duration-300" />
                <p className="relative font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">{city}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="section-title mt-2">The LERE.lb Advantage</h2>
            <p className="section-subtitle mx-auto mt-2">We make finding your dream property in Lebanon seamless and trustworthy</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiShield, title: 'Verified Listings', desc: 'Every property is verified by our team for accuracy, quality, and authentic pricing.', color: 'from-primary-500 to-primary-600' },
              { icon: FiUsers, title: 'Expert Agents', desc: 'Connect with Lebanon\'s top-rated real estate agents who know the local market inside out.', color: 'from-purple-500 to-purple-600' },
              { icon: FiTrendingUp, title: 'Market Intelligence', desc: 'Get real-time market data, price trends, and neighborhood insights to make informed decisions.', color: 'from-emerald-500 to-emerald-600' },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl card-hover border border-gray-100">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <FiHome className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Join thousands of happy homeowners across Lebanon. Start your journey today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/properties" className="btn-primary !px-8 !py-4 text-base shadow-lg shadow-primary-500/20">
              Browse Properties <FiArrowRight />
            </Link>
            <Link to="/register" className="btn-secondary !px-8 !py-4 text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30">
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      </section>
    </div>
  );
}

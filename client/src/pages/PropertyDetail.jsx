import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiSquare, FiCalendar, FiDollarSign, FiCheck, FiX, FiHeart, FiShare2, FiPhone, FiMail, FiMessageSquare, FiChevronLeft, FiChevronRight, FiArrowLeft, FiMaximize2, FiShield, FiClock } from 'react-icons/fi';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadProperty(); }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data.property);
      const sim = await api.get(`/properties/${id}/similar`);
      setSimilar(sim.data.properties);
      if (user) {
        setSaved(data.property.savedByUser || false);
        setContactForm({ name: `${user.firstName} ${user.lastName}`, email: user.email, phone: user.phone || '', message: '' });
      }
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const { data } = await api.post(`/auth/save-property/${id}`);
      setSaved(data.saved);
      toast.success(data.message);
    } catch { toast.error('Please login to save'); }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return toast.error('Please fill required fields');
    setSending(true);
    try {
      await api.post('/inquiries', { ...contactForm, property: id });
      toast.success('Inquiry sent! The agent will contact you soon.');
      setContactForm({ ...contactForm, message: '' });
    } catch { toast.error('Failed to send inquiry'); }
    setSending(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[500px] skeleton rounded-2xl" />
            <div className="h-8 skeleton w-3/4" />
            <div className="h-6 skeleton w-1/2" />
            <div className="h-32 skeleton w-full" />
          </div>
          <div className="space-y-6">
            <div className="h-64 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><FiHome className="text-gray-400 text-3xl" /></div><h2 className="text-xl font-semibold">Property not found</h2><Link to="/properties" className="text-primary-600 mt-2 inline-block">Browse properties</Link></div>
    </div>
  );

  const images = property.images?.length ? property.images : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' }];

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Properties
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-black group">
              <img src={images[currentImage]?.url} alt={property.title} className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setCurrentImage(i => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <FiChevronRight />
                  </button>
                </>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white backdrop-blur-md ${property.purpose === 'sale' ? 'bg-primary-600/80' : 'bg-emerald-600/80'}`}>
                  {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                {property.featured && <span className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white backdrop-blur-md bg-amber-500/80">Featured</span>}
              </div>
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                <span className="text-2xl font-bold text-primary-600">${property.price?.toLocaleString()}</span>
                {property.purpose === 'rent' && <span className="text-sm text-gray-500">/month</span>}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all duration-200 ${i === currentImage ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1.5 mt-2">
                    <FiMapPin className="shrink-0 text-primary-500" />
                    {[property.location?.street, property.location?.district, property.location?.city].filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {user && (
                    <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'}`}>
                      <FiHeart className={saved ? 'fill-current' : ''} /> {saved ? 'Saved' : 'Save'}
                    </button>
                  )}
                  <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm font-medium">
                    <FiShare2 /> Share
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl mb-8">
                {[
                  { icon: FiHome, label: 'Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1) },
                  ...(property.type !== 'land' ? [
                    { icon: FiSquare, label: 'Bedrooms', value: `${property.bedrooms} Beds` },
                    { icon: FiMaximize2, label: 'Bathrooms', value: `${property.bathrooms} Baths` },
                  ] : []),
                  { icon: FiMaximize2, label: 'Area', value: `${property.floorArea || property.landArea} m²` },
                  ...(property.yearBuilt ? [{ icon: FiCalendar, label: 'Year Built', value: property.yearBuilt }] : []),
                  { icon: FiDollarSign, label: 'Price', value: `$${property.price?.toLocaleString()}` },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="text-center p-3">
                    <div className="w-10 h-10 mx-auto bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm"><item.icon className="text-primary-600 text-lg" /></div>
                    <div className="font-semibold text-gray-800 text-sm">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a, i) => (
                      <span key={i} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium border border-primary-100">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {property.features && Object.keys(property.features).filter(k => property.features[k]).length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(property.features).filter(([, v]) => v).map(([key]) => (
                      <div key={key} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center"><FiCheck className="text-emerald-600 text-sm" /></div>
                        <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Agent</h3>
                <p className="text-sm text-gray-500 mb-5">Send an inquiry about this property</p>

                <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {(property.contactInfo?.name || property.owner?.firstName)?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{property.contactInfo?.name || (property.owner?.firstName + ' ' + property.owner?.lastName)}</p>
                      <p className="text-xs text-gray-500">Real Estate Agent</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <a href={`tel:${property.contactInfo?.phone || property.owner?.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <FiPhone className="text-primary-500" /> {property.contactInfo?.phone || property.owner?.phone || '+961 1 234 567'}
                    </a>
                    <a href={`mailto:${property.contactInfo?.email || property.owner?.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <FiMail className="text-primary-500" /> {property.contactInfo?.email || property.owner?.email || 'agent@lere.lb'}
                    </a>
                  </div>
                </div>

                <form onSubmit={handleInquiry} className="space-y-3">
                  <input type="text" placeholder="Your Name *" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className="input-modern" required />
                  <input type="email" placeholder="Your Email *" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="input-modern" required />
                  <input type="tel" placeholder="Your Phone" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className="input-modern" />
                  <textarea placeholder="Your Message *" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} className="input-modern h-28 resize-none" required />
                  <button type="submit" disabled={sending} className="btn-primary w-full !py-3.5 disabled:opacity-50">
                    <FiMessageSquare /> {sending ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Property ID', value: `#${property._id.slice(-6).toUpperCase()}` },
                    { label: 'Status', value: property.purpose === 'sale' ? 'For Sale' : 'For Rent' },
                    { label: 'Listed', value: new Date(property.createdAt).toLocaleDateString() },
                    { label: 'Views', value: `${property.views} views` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Similar Properties</span>
              <h2 className="section-title mt-1">You Might Also Like</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map((p, i) => (
                <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

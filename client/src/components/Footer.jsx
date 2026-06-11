import { Link } from 'react-router-dom';
import { FiHome, FiPhone, FiMail, FiMapPin, FiArrowUpRight, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-gray-900 text-gray-400 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <FiHome className="text-white text-xl" />
              </div>
              <span className="font-bold text-xl text-white">LERE<span className="text-primary-400">.lb</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">Lebanon's premier real estate platform. Discover your dream home with trusted agents across all Lebanese regions.</p>
            <div className="flex gap-3">
              {['#', '#', '#', '#'].map((href, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                  <FiArrowUpRight />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/properties?purpose=sale', label: 'Buy Property' },
                { to: '/properties?purpose=rent', label: 'Rent Property' },
                { to: '/properties?type=land', label: 'Land for Sale' },
                { to: '/properties?type=commercial', label: 'Commercial' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-all duration-200 flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-primary-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Popular Cities</h3>
            <ul className="space-y-3">
              {['Beirut', 'Tripoli', 'Jounieh', 'Sidon', 'Zahle', 'Byblos'].map((city, i) => (
                <li key={i}>
                  <Link to={`/properties?city=${city}`} className="text-sm text-gray-400 hover:text-primary-400 transition-all duration-200 flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-primary-400 transition-all duration-200" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5"><FiPhone className="text-primary-400" /></div>
                <div><p className="text-white font-medium">Phone</p><p className="text-gray-400">+961 1 234 567</p></div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5"><FiMail className="text-primary-400" /></div>
                <div><p className="text-white font-medium">Email</p><p className="text-gray-400">info@lere.lb</p></div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5"><FiMapPin className="text-primary-400" /></div>
                <div><p className="text-white font-medium">Address</p><p className="text-gray-400">Beirut Central District<br />Lebanon</p></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} LERE.lb. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-500">
            Made with <FiHeart className="text-red-400 mx-0.5" /> in Lebanon
          </div>
        </div>
      </div>

      <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-40">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
    </footer>
  );
}

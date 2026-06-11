import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiHeart, FiGrid, FiBarChart2, FiSearch, FiLogIn, FiMessageSquare } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      api.get('/inquiries/unread-count').then(r => setUnreadCount(r.data.count)).catch(() => {});
    }
  }, [user, location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties', icon: FiSearch },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <FiHome className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl text-gray-800">LERE<span className="text-primary-600">.lb</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.to)} hover:bg-gray-100/80`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                {user.role === 'admin' && (
                  <Link to="/dashboard" className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/dashboard')} hover:bg-gray-100/80 flex items-center gap-1.5`}>
                    <FiBarChart2 className="text-base" /> Dashboard
                  </Link>
                )}
                {(user.role === 'agent' || user.role === 'seller') && (
                  <Link to="/my-properties" className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/my-properties')} hover:bg-gray-100/80 flex items-center gap-1.5`}>
                    <FiGrid className="text-base" /> My Listings
                  </Link>
                )}
                <Link to="/messages" className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/messages')} hover:bg-gray-100/80 flex items-center gap-1.5`}>
                  <FiMessageSquare className="text-base" /> Messages
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>
                <Link to="/saved" className={`p-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/saved')} hover:bg-gray-100/80`}>
                  <FiHeart className="text-lg" />
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100/80">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-gray-700">{user.firstName}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100/80 transition-all duration-200">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm !px-5 !py-2.5">
                  <FiLogIn className="text-base" /> Get Started
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/20 animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all text-sm font-medium">
                {link.icon && <link.icon className="text-lg" />}
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="h-px bg-gray-200 my-2" />
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium"><FiUser /> Profile</Link>
                <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium">
                  <div className="relative"><FiMessageSquare /> {unreadCount > 0 && <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}</div>
                  Messages
                </Link>
                <Link to="/saved" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium"><FiHeart /> Saved</Link>
                {user.role === 'admin' && <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium"><FiBarChart2 /> Dashboard</Link>}
                {(user.role === 'agent' || user.role === 'seller') && <Link to="/my-properties" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium"><FiGrid /> My Listings</Link>}
                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium"><FiLogOut /> Logout</button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-200 my-2" />
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 transition-all text-sm font-medium"><FiLogIn /> Sign In</Link>
                <Link to="/register" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all text-sm font-medium"><FiUser /> Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  Menu, X, LayoutDashboard, Calendar, Users, 
  DollarSign, Settings, FileText, LogOut, Briefcase, 
  MapPin, Compass, PhoneCall, Award
} from 'lucide-react';

// ==========================================
// 1. CUSTOMER PORTFOLIO LAYOUT
// ==========================================
export const CustomerLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Artists', path: '/artists' },
    { name: 'Locations', path: '/locations' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleBookingClick = () => {
    navigate('/contact?book=true');
  };

  return (
    <div className="flex flex-col min-h-screen bg-off-white text-stone-800">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-stone-200/50 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo variant="light" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-outfit text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-gold ${
                    isActive ? 'text-forest font-semibold border-b border-gold' : 'text-stone-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-gold transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-luxury-black/90 backdrop-blur-md pt-24 px-6 md:hidden">
          <div className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="font-outfit text-lg font-medium tracking-widest uppercase text-white hover:text-gold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Luxury Footer */}
      <footer className="bg-forest text-stone-200 border-t-2 border-gold pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Logo variant="dark" />
            <p className="font-sans text-xs text-stone-400 mt-2 leading-relaxed">
              Crafting premium hair, beard, and facial grooming therapies. Establish a legacy of style with our master artists.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-forest transition-all">
                <span className="text-xs">IG</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-forest transition-all">
                <span className="text-xs">FB</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-forest transition-all">
                <span className="text-xs">YT</span>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="font-outfit text-xs font-semibold uppercase tracking-widest text-gold">Studio Hours</h4>
            <div className="text-xs text-stone-300 flex flex-col gap-2 mt-2">
              <p><span className="text-stone-400 font-medium">Mon - Fri:</span> 09:00 AM - 08:00 PM</p>
              <p><span className="text-stone-400 font-medium">Saturday:</span> 09:00 AM - 06:00 PM</p>
              <p><span className="text-stone-400 font-medium">Sunday:</span> 10:00 AM - 04:00 PM</p>
            </div>
          </div>

          {/* Address & Booking */}
          <div className="flex flex-col gap-3">
            <h4 className="font-outfit text-xs font-semibold uppercase tracking-widest text-gold">Location</h4>
            <p className="text-xs text-stone-300 leading-relaxed mt-2">
              42 Royal Oak Crescent,<br />Sector 5, Metropolitan
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Ph: +1 (555) 019-2834<br />
              Email: hello@rustiksalon.com
            </p>
          </div>

          {/* Internal Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-outfit text-xs font-semibold uppercase tracking-widest text-gold">Portal Access</h4>
            <Link to="/admin" className="text-xs text-stone-400 hover:text-gold transition-colors mt-2">
              Admin Console
            </Link>
            <p className="text-[10px] text-stone-500 mt-1">
              © {new Date().getFullYear()} Rustik Salon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};


// ==========================================
// 2. SALON MANAGEMENT DASHBOARD LAYOUT
// ==========================================
export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Sidebar items definition
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['owner', 'manager', 'barber', 'staff'] },
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar, roles: ['owner', 'manager', 'barber', 'staff'] },
    { name: 'Customers', path: '/dashboard/customers', icon: Users, roles: ['owner', 'manager', 'staff'] },
    { name: 'Employees', path: '/dashboard/employees', icon: Briefcase, roles: ['owner', 'manager', 'staff'] },
    { name: 'Finances', path: '/dashboard/finances', icon: DollarSign, roles: ['owner', 'manager'] },
    { name: 'Content CMS', path: '/dashboard/cms', icon: Settings, roles: ['owner', 'manager'] },
    { name: 'Audit Reports', path: '/dashboard/reports', icon: FileText, roles: ['owner', 'manager'] }
  ];

  // Filter based on roles
  const allowedItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen flex bg-luxury-black text-stone-200">
      
      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-dark border-r border-luxury-gray flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-luxury-gray flex items-center justify-between">
          <Link to="/">
            <Logo variant="dark" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow px-4 py-6 flex flex-col gap-1.5">
          {allowedItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded font-outfit text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
                  isActive 
                    ? 'bg-gold/15 text-gold border-l-2 border-gold font-semibold' 
                    : 'text-stone-400 hover:bg-stone-800/40 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-luxury-gray flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/40 text-xs font-bold font-outfit">
              {user?.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold font-outfit truncate text-white uppercase">{user?.name}</span>
              <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded font-outfit text-xs font-semibold uppercase tracking-wider text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="h-16 border-b border-luxury-gray bg-luxury-dark/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/40 rounded md:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-outfit text-sm font-semibold tracking-wider text-white uppercase">
              {location.pathname === '/dashboard' ? 'Overview Analytics' : location.pathname.split('/').pop().toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-outfit">{user?.name}</span>
              <span className="text-[9px] text-gold font-medium uppercase tracking-widest mt-1">
                {user?.role} Mode
              </span>
            </div>
            <Link 
              to="/" 
              className="text-xs font-outfit font-semibold uppercase tracking-widest border border-gold/30 px-3 py-1.5 rounded text-gold hover:bg-gold hover:text-forest transition-all"
            >
              View Website
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Root */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

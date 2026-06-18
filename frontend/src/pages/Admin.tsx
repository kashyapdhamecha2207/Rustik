import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import Logo from '../components/Logo';
import { 
  KeyRound, Mail, AlertTriangle, ArrowLeft, LogOut, 
  DollarSign, Users, Search, Phone, FileEdit, Plus, 
  Trash2, Clock, RefreshCw, CheckCircle2 
} from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const { user, login, logout, isAdminRole, verifyOTP } = useAuth();

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // OTP Verification States
  const [showOtpView, setShowOtpView] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Dashboard Data States
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayCustomers, setTodayCustomers] = useState(0);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Historical Records States
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [historyData, setHistoryData] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Customer Management States
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customersLoading, setCustomersLoading] = useState(true);
  const [notesText, setNotesText] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  // Add Customer Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustWork, setNewCustWork] = useState('');
  const [newCustAmount, setNewCustAmount] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Success notifications
  const [notification, setNotification] = useState('');

  // Auto-clear notification helper
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await apiFetch('/finance/analytics');
      const data = await response.json();
      if (data.success && data.analytics) {
        setTodayRevenue(data.analytics.todayRevenue || 0);
        setTodayCustomers(data.analytics.todayCustomers || 0);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch History Data
  const fetchHistoryData = async (dateStr: string) => {
    if (!dateStr) return;
    try {
      setHistoryLoading(true);
      const response = await apiFetch(`/finance/history?date=${dateStr}`);
      const data = await response.json();
      if (data.success) {
        setHistoryData(data);
      }
    } catch (err) {
      console.error('Failed to fetch history data:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch Customer list
  const fetchCustomersList = async (search = '') => {
    try {
      setCustomersLoading(true);
      const response = await apiFetch(`/customers?search=${search}`);
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers || []);
        // Reset or select default customer
        if (data.customers && data.customers.length > 0) {
          // Keep selection if it still exists, otherwise select first
          const stillExists = selectedCustomer 
            ? data.customers.find((c: any) => c._id === selectedCustomer._id)
            : null;
          if (stillExists) {
            setSelectedCustomer(stillExists);
            setNotesText(stillExists.notes || '');
          } else {
            setSelectedCustomer(data.customers[0]);
            setNotesText(data.customers[0].notes || '');
          }
        } else {
          setSelectedCustomer(null);
          setNotesText('');
        }
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Fetch all dashboard data when logged in
  useEffect(() => {
    if (isAdminRole) {
      fetchDashboardStats();
      fetchCustomersList(searchQuery);
    }
  }, [isAdminRole, searchQuery]);

  useEffect(() => {
    if (isAdminRole) {
      fetchHistoryData(selectedHistoryDate);
    }
  }, [isAdminRole, selectedHistoryDate]);

  // Handle Admin Sign In
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginLoading(true);
    try {
      const resData = await login(email, password);
      if (resData && resData.requireOTP) {
        setShowOtpView(true);
        setLoginError('');
      } else {
        if (resData && resData.role !== 'admin') {
          // Log out immediately if user is not an admin
          logout();
          setLoginError('Access denied. This portal is restricted to administrator accounts.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle OTP Submission
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    try {
      await verifyOTP(email, otpCode);
      triggerNotification('Administrator authenticated successfully.');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid verification code. Please check console logs.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Customer Selection
  const handleSelectCustomer = (cust: any) => {
    setSelectedCustomer(cust);
    setNotesText(cust.notes || '');
  };

  // Handle Saving Styling Notes
  const handleUpdateNotes = async () => {
    if (!selectedCustomer) return;
    setUpdatingNotes(true);
    try {
      const response = await apiFetch(`/customers/${selectedCustomer._id}`, {
        method: 'PUT',
        body: JSON.stringify({ notes: notesText })
      });
      const data = await response.json();
      if (data.success) {
        triggerNotification('Styling preferences updated successfully.');
        // Refresh customer list to sync data
        fetchCustomersList(searchQuery);
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    } finally {
      setUpdatingNotes(false);
    }
  };

  // Handle Add Customer Submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newCustName || !newCustPhone || !newCustWork || !newCustAmount) {
      setAddError('All fields (Name, Phone, Work Done, Amount) are required.');
      return;
    }

    setAddLoading(true);
    try {
      const response = await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: newCustName,
          phone: newCustPhone,
          work: newCustWork,
          amount: newCustAmount
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setNewCustName('');
        setNewCustPhone('');
        setNewCustWork('');
        setNewCustAmount('');
        triggerNotification('Customer transaction logged successfully.');
        fetchCustomersList(searchQuery);
        fetchDashboardStats();
        fetchHistoryData(selectedHistoryDate);
      } else {
        setAddError(data.message || 'Failed to record transaction.');
      }
    } catch (err) {
      setAddError('A network error occurred.');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle Delete Customer Profile
  const handleDeleteCustomer = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete ${name}? This action will permanently remove their records from the salon database.`);
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/customers/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        triggerNotification(`Customer profile for ${name} was deleted.`);
        fetchCustomersList(searchQuery);
      } else {
        alert(data.message || 'Failed to delete customer profile.');
      }
    } catch (err) {
      alert('A network error occurred while deleting.');
    }
  };

  // State 1: Render Login Panel if not authenticated as Admin
  if (!isAdminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black px-4 relative overflow-hidden text-stone-200">
        {/* Background radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gold/5 blur-[130px] pointer-events-none" />

        {/* Back to website button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 inline-flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Website
        </button>

        {/* Main login glass panel box */}
        <div className="w-full max-w-md glass-panel-dark p-8 rounded-lg shadow-2xl relative z-10 flex flex-col items-center gap-8 border border-gold/20">
          
          {/* Branding header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Logo variant="dark" />
            <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.3em] text-gold mt-4">ADMIN SECURE CONSOLE</h2>
            <div className="w-8 h-[1px] bg-gold/50 mt-1" />
          </div>

          {/* Show info about existing logged in session if non-admin */}
          {user && user.role !== 'admin' && (
            <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] p-3 rounded font-sans flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>You are logged in as <strong>{user.name} ({user.role})</strong>. Admin access requires signing out and logging in with admin credentials.</span>
            </div>
          )}

          {loginError && (
            <div className="w-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] p-3 rounded font-sans flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {otpError && (
            <div className="w-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] p-3 rounded font-sans flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{otpError}</span>
            </div>
          )}

          {!showOtpView ? (
            /* Login Form */
            <form onSubmit={handleSubmitLogin} className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">Admin Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rustik.com"
                    className="w-full bg-luxury-black border border-luxury-gray text-white p-3 pl-11 text-xs rounded focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">Access Password</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-luxury-black border border-luxury-gray text-white p-3 pl-11 text-xs rounded focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 mt-4 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-lg transition-luxury hover:scale-105 flex items-center justify-center"
              >
                {loginLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest" />
                ) : (
                  'Secure Authentication'
                )}
              </button>
            </form>
          ) : (
            /* OTP Form */
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">6-Digit Verification Code</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-luxury-black border border-luxury-gray text-white p-3 pl-11 text-xs tracking-[0.5em] text-center font-mono rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <span className="text-[10px] text-stone-500 text-center font-sans mt-2">
                  We sent a 2FA OTP security code. Check the backend server terminal console logs to retrieve it.
                </span>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 mt-4 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-lg transition-luxury hover:scale-105 flex items-center justify-center"
              >
                {otpLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest" />
                ) : (
                  'Verify & Log In'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtpView(false);
                  setOtpCode('');
                  setOtpError('');
                }}
                className="w-full text-stone-500 hover:text-stone-300 font-outfit text-[10px] uppercase font-bold tracking-wider transition-colors mt-2"
              >
                ← Back to Credentials
              </button>
            </form>
          )}

          {/* Prompt regarding admin credentials */}
          <div className="w-full border-t border-luxury-gray pt-5 text-center flex flex-col gap-2 select-none text-[10px] font-sans text-stone-500">
            <span className="font-outfit text-[9px] font-bold tracking-widest uppercase">ADMIN SECURE CREDENTIALS</span>
            <p>Email: <span className="text-stone-400 font-semibold">admin@rustik.com</span></p>
            <p>Password: <span className="text-stone-400 font-semibold">password123</span></p>
          </div>

        </div>
      </div>
    );
  }

  // State 2: Render Admin Dashboard Page when authenticated as admin
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black text-stone-200 relative">
      {/* Background radial gold glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Floating success notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/35 text-emerald-200 px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="h-16 border-b border-luxury-gray bg-luxury-dark/65 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Logo variant="dark" />
          <div className="w-[1px] h-6 bg-luxury-gray hidden sm:block" />
          <h2 className="font-outfit text-xs font-bold tracking-[0.2em] text-gold uppercase hidden sm:block">
            ADMIN PORTAL
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-outfit">{user?.name}</span>
            <span className="text-[9px] text-gold font-bold uppercase tracking-widest mt-1">
              SYSTEM ROOT
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/admin');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded font-outfit text-xs font-semibold uppercase tracking-wider text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors border border-rose-500/20"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 relative z-10">
        
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">ADMINISTRATIVE OVERVIEW</h1>
            <span className="text-xs text-stone-400 font-sans mt-1">
              Review today's real-time financial earnings and complete administrative actions on customer accounts.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchDashboardStats();
                fetchCustomersList(searchQuery);
              }}
              className="p-2.5 rounded bg-luxury-dark border border-luxury-gray hover:border-gold hover:text-gold transition-colors text-stone-400"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={analyticsLoading || customersLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest rounded shadow-md flex items-center gap-2 transition-luxury hover:scale-[1.03]"
            >
              <Plus size={14} /> Log Work / Transaction
            </button>
          </div>
        </div>

        {/* Real-time Earnings & Customers Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings Card */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col gap-1.5 relative z-10">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">TODAY'S GROSS EARNINGS</span>
              <span className="text-3xl font-extrabold font-outfit text-white leading-none">
                ${todayRevenue.toFixed(2)}
              </span>
            </div>
            <div className="p-4 bg-gold/10 text-gold rounded-full border border-gold/25 relative z-10 shadow-lg">
              <DollarSign size={22} />
            </div>
          </div>

          {/* Active Customers Served Today Card */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col gap-1.5 relative z-10">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">TODAY'S CUSTOMERS SERVED</span>
              <span className="text-3xl font-extrabold font-outfit text-white leading-none">
                {todayCustomers}
              </span>
            </div>
            <div className="p-4 bg-gold/10 text-gold rounded-full border border-gold/25 relative z-10 shadow-lg">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Historical Records & Calendar Section */}
        <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex flex-col gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-gray pb-4">
            <div className="flex flex-col">
              <h3 className="font-outfit text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                📅 Historical Records & Calendar Lookup
              </h3>
              <span className="text-[11px] text-stone-400 font-sans mt-1">
                Select a date to view past daily work records and compare with total monthly earnings.
              </span>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">Select Date:</label>
              <input
                type="date"
                value={selectedHistoryDate}
                onChange={(e) => setSelectedHistoryDate(e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-white p-2 text-xs rounded focus:outline-none focus:border-gold font-sans cursor-pointer hover:border-gold/60 transition-colors"
              />
            </div>
          </div>

          {/* History Data View */}
          {historyLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : !historyData ? (
            <div className="text-center py-12 text-stone-500 text-xs font-outfit">
              No historical data loaded. Select a date above to query.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Day & Month Summary Column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Daily Card */}
                <div className="bg-luxury-black border border-luxury-gray p-4 rounded flex flex-col gap-1 relative overflow-hidden">
                  <span className="font-outfit text-[9px] font-bold text-gold tracking-widest uppercase">DAILY SUMMARY</span>
                  <span className="text-stone-400 text-[10px] font-sans">
                    {new Date(selectedHistoryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold font-outfit text-white">${historyData.dailyRevenue.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400 font-sans">{historyData.dailyCustomers} customer{historyData.dailyCustomers !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Monthly Card */}
                <div className="bg-luxury-black border border-luxury-gray p-4 rounded flex flex-col gap-1 relative overflow-hidden">
                  <span className="font-outfit text-[9px] font-bold text-gold tracking-widest uppercase">MONTHLY SUMMARY</span>
                  <span className="text-stone-400 text-[10px] font-sans">
                    {new Date(selectedHistoryDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold font-outfit text-white">${historyData.monthlyRevenue.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400 font-sans">{historyData.monthlyCustomers} customer{historyData.monthlyCustomers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger List (8 cols) */}
              <div className="lg:col-span-8 bg-luxury-black border border-luxury-gray rounded p-4 flex flex-col gap-3 min-h-[180px]">
                <h4 className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-luxury-gray pb-2 flex items-center justify-between">
                  <span>📝 Transactions Ledger</span>
                  <span className="text-[9px] font-sans text-stone-500 font-normal">Showing {historyData.dailyTransactions.length} records</span>
                </h4>

                {historyData.dailyTransactions.length === 0 ? (
                  <div className="flex-grow flex items-center justify-center py-8 text-stone-500 text-xs italic font-sans">
                    No transactions recorded on this date.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {historyData.dailyTransactions.map((tx: any, idx: number) => (
                      <div 
                        key={tx._id || idx} 
                        className="bg-luxury-dark border border-luxury-gray p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans hover:border-gold/30 transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-white uppercase truncate">{tx.customerName}</span>
                          <span className="text-[9px] text-stone-500 mt-0.5 font-mono">{tx.customerPhone}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 min-w-0">
                          <span className="text-stone-300 italic truncate text-right">{tx.work}</span>
                          <div className="text-right shrink-0 flex flex-col items-end leading-tight">
                            <span className="font-bold text-gold font-outfit text-xs">${tx.amount.toFixed(2)}</span>
                            <span className="text-[8px] text-stone-500 font-mono mt-0.5">{tx.time || 'Completed'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Split Section: Customer list & Customer actions details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Customer search list (5 cols) */}
          <div className="lg:col-span-5 bg-luxury-dark border border-luxury-gray rounded-lg p-5 flex flex-col gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name or phone..."
                className="w-full bg-luxury-black border border-luxury-gray text-white p-2.5 pl-10 text-xs rounded focus:outline-none focus:border-gold font-sans"
              />
            </div>

            {customersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-outfit">
                No customer profiles match.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-luxury-gray max-h-[400px] overflow-y-auto pr-1">
                {customers.map((cust: any) => {
                  const isSelected = selectedCustomer?._id === cust._id;
                  return (
                    <div
                      key={cust._id}
                      onClick={() => handleSelectCustomer(cust)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected ? 'bg-gold/10 text-gold font-semibold' : 'hover:bg-stone-800/40 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-stone-800 border border-luxury-gray text-stone-300 flex items-center justify-center shrink-0 text-xs font-bold font-outfit uppercase">
                          {cust.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-xs uppercase truncate text-white">{cust.name}</span>
                          <span className="text-[10px] text-stone-500 mt-1 font-mono">{cust.phone}</span>
                        </div>
                      </div>
                      <span className="font-outfit text-[9px] font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded tracking-wide shrink-0">
                        {cust.visits?.length || 0} VISITS
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel: Details timeline, editing preferences, and deletes (7 cols) */}
          <div className="lg:col-span-7">
            {selectedCustomer ? (
              <div className="bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-6 relative">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-gray pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-outfit text-lg font-bold uppercase">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-outfit text-base font-bold text-white uppercase tracking-wide">
                        {selectedCustomer.name}
                      </h3>
                      <span className="text-[9px] text-stone-500 font-mono mt-1">
                        DB REF ID: {selectedCustomer._id}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 shrink-0">
                    <div className="flex flex-col items-center bg-luxury-black px-3 py-1.5 rounded border border-luxury-gray text-center min-w-[70px]">
                      <span className="text-xs font-bold text-gold font-outfit">
                        ${selectedCustomer.visits?.reduce((sum: number, v: any) => sum + v.amount, 0) || 0}
                      </span>
                      <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Total Paid</span>
                    </div>
                  </div>
                </div>

                {/* Profile Contact Grid */}
                <div className="font-sans text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gold shrink-0" />
                    <span>Phone: <strong className="font-mono">{selectedCustomer.phone}</strong></span>
                  </div>
                </div>

                {/* Styling Notes editor */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider font-outfit border-b border-luxury-gray pb-1.5">
                    <span className="flex items-center gap-1.5"><FileEdit size={12} /> Work Requested / Notes</span>
                    <button 
                      onClick={handleUpdateNotes}
                      disabled={updatingNotes}
                      className="text-gold hover:underline font-bold transition-opacity disabled:opacity-50"
                    >
                      {updatingNotes ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    rows={2}
                    placeholder="e.g. Haircut or beard grooming notes..."
                    className="w-full bg-luxury-black border border-luxury-gray text-stone-200 text-xs p-3 rounded focus:outline-none focus:border-gold font-sans leading-relaxed"
                  />
                </div>

                {/* Visits history timeline */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-luxury-gray pb-1.5 flex items-center gap-1.5">
                    <Clock size={12} /> Transaction Ledger
                  </h4>
                  
                  {!selectedCustomer.visits || selectedCustomer.visits.length === 0 ? (
                    <div className="text-stone-500 text-xs italic py-2">
                      No logged transactions.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                      {selectedCustomer.visits.map((visit: any, idx: number) => (
                        <div key={idx} className="bg-luxury-black border border-luxury-gray p-2.5 rounded flex items-center justify-between gap-4 font-sans text-xs">
                          <span className="font-semibold text-white uppercase truncate">
                            {visit.services?.join(', ') || 'Barber Work'}
                          </span>
                          <div className="text-right shrink-0 flex items-center gap-3 font-mono">
                            <span className="text-xs font-bold text-gold font-outfit">${visit.amount}</span>
                            <span className="text-[9px] text-stone-500">{visit.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Critical Admin Zone (Profile Deletion) */}
                <div className="border-t border-luxury-gray pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-outfit">CRITICAL ZONE</span>
                    <span className="text-[10px] text-stone-500 font-sans mt-0.5">
                      This profile can be completely removed from the salon directory database.
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomer(selectedCustomer._id, selectedCustomer.name)}
                    className="px-4 py-2 bg-rose-950/20 border border-rose-500/35 hover:bg-rose-900/35 text-rose-400 rounded font-outfit text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start sm:self-center"
                  >
                    <Trash2 size={13} />
                    <span>Delete Profile</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-luxury-dark border border-luxury-gray py-24 text-center text-stone-500 font-outfit text-xs rounded-lg shadow-inner">
                Select a customer profile from the left directory column to load files.
              </div>
            )}
          </div>
        </div>

      </main>

      {/* LOG CUSTOMER WORK DIALOG MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-luxury-dark border-2 border-gold max-w-md w-full rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-luxury-gray flex items-center justify-between bg-luxury-black/40">
              <h3 className="font-outfit text-xs font-bold uppercase tracking-widest text-gold">LOG NEW CUSTOMER WORK</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-stone-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4 font-sans text-xs text-stone-300">
              {addError && (
                <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-2.5 rounded flex items-center gap-1.5">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Liam Henderson"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. +91 82385 37478"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Work Done *</label>
                <input
                  type="text"
                  required
                  value={newCustWork}
                  onChange={(e) => setNewCustWork(e.target.value)}
                  placeholder="e.g. Hair cutting, beard trim, coloring..."
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Amount Charged ($) *</label>
                <input
                  type="number"
                  required
                  value={newCustAmount}
                  onChange={(e) => setNewCustAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="flex items-center gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-white uppercase tracking-wider font-outfit text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest shadow-md transition-luxury hover:scale-[1.03]"
                >
                  {addLoading ? 'Recording...' : 'Log Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;

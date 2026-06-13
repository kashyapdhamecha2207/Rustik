import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, Users, DollarSign, Calendar, Sparkles, 
  Check, X, ChevronRight, Award, Scissors, ShoppingBag 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, Legend 
} from 'recharts';

export const Overview = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await apiFetch('/finance/analytics');
      const resData = await response.json();
      if (resData.success) {
        setData(resData.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Fetch pending / confirmed appointments to act on
  const fetchRecentBookings = async () => {
    try {
      const response = await apiFetch('/appointments');
      const apptsData = await response.json();
      if (apptsData.success) {
        // filter for non-completed recent bookings
        const filtered = apptsData.appointments
          .filter(a => a.status === 'pending' || a.status === 'confirmed')
          .slice(0, 5);
        setRecentAppointments(filtered);
      }
    } catch (err) {
      console.error('Error fetching recent bookings:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStats(), fetchRecentBookings()])
      .then(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      const res = await response.json();
      if (res.success) {
        // Re-fetch
        fetchStats();
        fetchRecentBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Colors for Recharts Pie Chart
  const COLORS = ['#C8A96B', '#0F2E16', '#225e30', '#a3813f', '#e5c98e'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  // Fallback calculations for role types (e.g. staff/barbers don't have access to /finance/analytics)
  const isFinancialVisible = user?.role === 'owner' || user?.role === 'manager';

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. WELCOME BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-outfit text-white tracking-wider uppercase">STUDIO METRICS</h1>
          <span className="text-xs text-stone-400 font-sans mt-1">Real-time salon operations and customer check-ins.</span>
        </div>
        <div className="flex items-center gap-2 bg-luxury-dark border border-luxury-gray px-4 py-2 rounded text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-outfit font-semibold uppercase tracking-wider text-white">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* 2. STATS CARDS (FINANCIAL OR BASIC) */}
      {isFinancialVisible && data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Revenue */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">TODAY'S REVENUE</span>
              <span className="text-2xl font-bold font-outfit text-white">${data.todayRevenue.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-1">
                <TrendingUp size={10} /> +12% vs yesterday
              </span>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/25">
              <DollarSign size={20} />
            </div>
          </div>

          {/* Today's Customers */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">TODAY'S CUSTOMERS</span>
              <span className="text-2xl font-bold font-outfit text-white">{data.todayCustomers}</span>
              <span className="text-[10px] text-stone-500 font-sans">Walk-ins & bookings</span>
            </div>
            <div className="p-3 bg-forest/20 text-gold rounded-full border border-forest/50">
              <Users size={20} />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">MONTHLY SALES (30D)</span>
              <span className="text-2xl font-bold font-outfit text-white">${data.monthlyRevenue.toFixed(2)}</span>
              <span className="text-[10px] text-stone-500 font-sans">Recurring sales total</span>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/25">
              <ShoppingBag size={20} />
            </div>
          </div>

          {/* Profit */}
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">NET PROFIT (YEAR)</span>
              <span className={`text-2xl font-bold font-outfit ${data.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${data.totalProfit.toFixed(2)}
              </span>
              <span className="text-[10px] text-stone-500 font-sans">Deducting expense logs</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      ) : (
        /* Barber/Staff Overview Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">WELCOME BACK</span>
              <span className="text-xl font-bold font-outfit text-white uppercase">{user?.name}</span>
              <span className="text-xs text-gold font-medium mt-1">ROLE: {user?.role.toUpperCase()}</span>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-full">
              <Award size={24} />
            </div>
          </div>
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">ACTIVE RESERVATIONS</span>
              <span className="text-2xl font-bold font-outfit text-white">View Calendar</span>
              <span className="text-xs text-stone-500 mt-1">Review your scheduled shifts</span>
            </div>
            <div className="p-3 bg-forest/20 text-gold rounded-full">
              <Calendar size={24} />
            </div>
          </div>
        </div>
      )}

      {/* 3. CHARTS GRID (FINANCIAL VIEW ONLY) */}
      {isFinancialVisible && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main line/area chart (col-span-8) */}
          <div className="lg:col-span-8 bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase">CASHFLOW FORECAST (6 MONTHS)</h3>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8A96B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#C8A96B" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C4A28" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1C4A28" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#121813', border: '1px solid #1E261F' }} />
                  <Legend />
                  <Area type="monotone" dataKey="Revenue" stroke="#C8A96B" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Profit" stroke="#225e30" fillOpacity={1} fill="url(#colorProf)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular services pie chart (col-span-4) */}
          <div className="lg:col-span-4 bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-4">
            <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase">MOST POPULAR SERVICES</h3>
            <div className="h-56 w-full relative">
              {data.popularServices && data.popularServices.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.popularServices}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.popularServices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#121813', border: '1px solid #1E261F' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-xs">
                  No popular service data seeded yet
                </div>
              )}
            </div>
            {/* Small Legend listing */}
            <div className="flex flex-col gap-1.5 text-[10px] text-stone-400 font-sans mt-2">
              {data.popularServices?.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="truncate max-w-[150px] uppercase font-outfit tracking-wide">{entry.name}</span>
                  </div>
                  <span className="font-bold text-white font-outfit">{entry.value} bookings</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. ACTIONS / RECENT BOOKINGS & MASTER BARBERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Bookings Queue (col-span-7 or 12 depending on view) */}
        <div className={`bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-4 ${
          isFinancialVisible ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          <div className="flex items-center justify-between border-b border-luxury-gray pb-3">
            <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase">APPOINTMENTS APPROVAL QUEUE</h3>
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-outfit">Action Needed</span>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="py-12 text-center text-stone-500 font-outfit text-xs select-none">
              No pending or confirmed appointments in queue.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-luxury-gray">
              {recentAppointments.map(appt => (
                <div key={appt._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-forest/40 border border-gold/15 text-gold flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-outfit uppercase">
                      {appt.customerName.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0 font-sans">
                      <span className="text-xs font-bold text-white uppercase">{appt.customerName}</span>
                      <span className="text-[10px] text-stone-400 mt-1 uppercase truncate">
                        {appt.serviceName} with <span className="text-gold">{appt.barberName}</span>
                      </span>
                      <span className="text-[9px] text-stone-500 mt-1 uppercase">
                        {appt.date} @ {appt.time} ({appt.duration}m)
                      </span>
                    </div>
                  </div>
                  
                  {/* Status buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {appt.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                          className="p-1.5 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Confirm Appointment"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                          className="p-1.5 rounded bg-rose-950/20 text-rose-400 border border-rose-500/25 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Reject / Cancel"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : appt.status === 'confirmed' ? (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'completed')}
                        className="px-3 py-1.5 rounded bg-gold/15 text-gold border border-gold/30 font-outfit text-[10px] font-bold uppercase tracking-wider hover:bg-gold hover:text-forest transition-all"
                      >
                        Complete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Performing Barbers (col-span-5) - Financial View only */}
        {isFinancialVisible && data && (
          <div className="lg:col-span-5 bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-luxury-gray pb-3">
              <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase">ARTISTS PERFORMANCE</h3>
              <span className="text-[10px] text-gold uppercase tracking-widest font-outfit">Top Performers</span>
            </div>

            <div className="flex flex-col gap-4">
              {data.bestBarbers?.map((barber, index) => {
                const maxRevenue = Math.max(...data.bestBarbers.map(b => b.revenue)) || 1;
                const percentage = (barber.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-outfit uppercase font-semibold">
                      <span className="text-stone-300">{barber.name}</span>
                      <span className="text-white">${barber.revenue.toFixed(2)}</span>
                    </div>
                    {/* Visual custom bar chart */}
                    <div className="w-full h-2 bg-luxury-gray rounded overflow-hidden">
                      <div 
                        className="h-full gold-gradient-bg rounded" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
};
export default Overview;

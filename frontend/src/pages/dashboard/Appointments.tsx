import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Clock, User, Phone, 
  Search, SlidersHorizontal, Plus, X, Check, XSquare, Trash 
} from 'lucide-react';

export const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterBarber, setFilterBarber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Add booking modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    barberId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const fetchAppointments = async () => {
    try {
      let url = `/appointments?date=${filterDate}`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterBarber) url += `&barberId=${filterBarber}`;
      
      const response = await apiFetch(url);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOptions = async () => {
    try {
      const [svcRes, barberRes] = await Promise.all([
        apiFetch('/services').then(res => res.json()),
        apiFetch('/auth/barbers').then(res => res.json())
      ]);
      if (svcRes.success) setServices(svcRes.services);
      if (barberRes.success) setBarbers(barberRes.barbers);

      setNewBooking(prev => ({
        ...prev,
        serviceId: svcRes.services?.[0]?._id || '',
        barberId: barberRes.barbers?.[0]?._id || ''
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchOptions()])
      .then(() => setLoading(false));
  }, [filterDate, filterBarber, filterStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const response = await apiFetch(`/appointments/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newBooking.customerName || !newBooking.customerPhone || !newBooking.date || !newBooking.time) {
      setErrorMsg('Please populate name, phone, date, and select a time slot.');
      return;
    }

    const selectedSvc = services.find(s => s._id === newBooking.serviceId);
    const selectedBarber = barbers.find(b => b._id === newBooking.barberId);

    if (!selectedSvc || !selectedBarber) {
      setErrorMsg('Invalid service or barber selection.');
      return;
    }

    try {
      const response = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...newBooking,
          serviceName: selectedSvc.name,
          barberName: selectedBarber.name,
          price: selectedSvc.price,
          duration: selectedSvc.duration
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setNewBooking({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          serviceId: services?.[0]?._id || '',
          barberId: barbers?.[0]?._id || '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          notes: ''
        });
        fetchAppointments();
      } else {
        setErrorMsg(data.message || 'Failed to schedule appointment.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-stone-200">
      
      {/* Page header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">SHIFTS CALENDAR</h1>
          <span className="text-xs text-stone-400 font-sans mt-1">Review scheduled services and process pending client requests.</span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest rounded shadow-md flex items-center gap-2"
        >
          <Plus size={14} /> Schedule Phone Booking
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-luxury-dark border border-luxury-gray p-5 rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gold" />
          <span className="font-outfit text-xs font-bold text-white tracking-wider uppercase">Filter Schedule</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-outfit uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 font-semibold tracking-wide">SHIFTS DATE</span>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 font-semibold tracking-wide">ASSIGNED ARTIST</span>
            <select
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded text-xs w-44"
            >
              <option value="">-- All Barbers --</option>
              {barbers.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 font-semibold tracking-wide">BOOKING STATUS</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded text-xs w-36"
            >
              <option value="">-- All Status --</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main listings */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-luxury-dark border border-luxury-gray py-16 text-center text-stone-500 font-outfit text-xs rounded-lg select-none">
          No appointments logged for {filterDate} matching the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map(appt => (
            <div 
              key={appt._id} 
              className={`bg-luxury-dark border rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 ${
                appt.status === 'completed' ? 'border-luxury-gray opacity-70' : 
                appt.status === 'confirmed' ? 'border-emerald-500/20' : 
                appt.status === 'cancelled' ? 'border-rose-500/20' : 'border-gold/25'
              }`}
            >
              {/* Status Banner */}
              <div className="absolute top-0 right-0 left-0 h-[3px]" style={{
                backgroundColor: 
                  appt.status === 'completed' ? '#444' : 
                  appt.status === 'confirmed' ? '#10b981' : 
                  appt.status === 'cancelled' ? '#ef4444' : '#C8A96B'
              }} />

              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="font-outfit text-sm font-bold text-white uppercase truncate">{appt.customerName}</h3>
                  <span className="text-[10px] text-stone-400 font-sans tracking-wide">{appt.customerPhone}</span>
                </div>
                <span className={`font-outfit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  appt.status === 'completed' ? 'bg-stone-800 text-stone-400' : 
                  appt.status === 'confirmed' ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-500/20' : 
                  appt.status === 'cancelled' ? 'bg-rose-950/45 text-rose-400 border border-rose-500/20' : 'bg-gold/10 text-gold border border-gold/20'
                }`}>
                  {appt.status}
                </span>
              </div>

              {/* Time and details info */}
              <div className="flex flex-col gap-2 border-y border-luxury-gray py-3 text-xs font-sans text-stone-300">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-gold" />
                  <span>{appt.time} ({appt.duration} Min Session)</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={13} className="text-gold" />
                  <span className="truncate">Service: {appt.serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={13} className="text-gold" />
                  <span className="truncate">Barber: <span className="text-white font-semibold">{appt.barberName}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={13} className="text-gold" />
                  <span>Ticket Cost: <span className="text-white font-semibold">${appt.price}</span></span>
                </div>
              </div>

              {/* Special notes */}
              {appt.notes && (
                <div className="bg-luxury-black/60 p-2.5 rounded border border-luxury-gray text-[10px] font-sans text-stone-400 leading-relaxed italic">
                  Notes: {appt.notes}
                </div>
              )}

              {/* Action operations footer */}
              <div className="flex items-center justify-between mt-1 pt-1">
                <div className="flex items-center gap-2">
                  {appt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                        className="px-2.5 py-1.5 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold uppercase tracking-wider font-outfit hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                        className="p-1.5 rounded bg-rose-950/20 text-rose-400 border border-rose-500/25 hover:bg-rose-50 hover:text-white transition-colors"
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </>
                  )}
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(appt._id, 'completed')}
                      className="px-4 py-1.5 rounded bg-gold/15 text-gold border border-gold/30 text-[10px] font-bold uppercase tracking-wider font-outfit hover:bg-gold hover:text-forest transition-all"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
                
                {/* Delete button (Owner / Manager only) */}
                {(user?.role === 'owner' || user?.role === 'manager') && (
                  <button 
                    onClick={() => handleDelete(appt._id)}
                    className="p-1.5 rounded text-rose-400/60 hover:text-rose-400 hover:bg-rose-950/10 transition-colors"
                    title="Delete Record"
                  >
                    <Trash size={13} />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD APPOINTMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-luxury-dark border-2 border-gold max-w-lg w-full rounded-lg overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-5 border-b border-luxury-gray flex items-center justify-between">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">SCHEDULE APPOINTMENT</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4 font-sans text-xs text-stone-300">
              {errorMsg && (
                <div className="bg-rose-950/30 border border-rose-500/35 text-rose-300 p-2.5 rounded">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Doe"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.customerPhone}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+1 (555) 012-3456"
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newBooking.customerEmail}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="john@example.com"
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Grooming Service *</label>
                  <select
                    value={newBooking.serviceId}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, serviceId: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded text-xs focus:outline-none focus:border-gold"
                  >
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.name} (${s.price})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Assigned Barber *</label>
                  <select
                    value={newBooking.barberId}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, barberId: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded text-xs focus:outline-none focus:border-gold"
                  >
                    {barbers.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Booking Date *</label>
                  <input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Booking Time *</label>
                  <select
                    value={newBooking.time}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded text-xs focus:outline-none focus:border-gold"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Special Requests / Notes</label>
                <textarea
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Scissor cut details, coffee request..."
                  rows={2}
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-4 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded font-outfit text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest shadow"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Appointments;

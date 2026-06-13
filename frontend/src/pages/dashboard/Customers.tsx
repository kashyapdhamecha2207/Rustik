import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Search, User, Phone, Mail, Award, Clock, FileEdit, Plus, Check } from 'lucide-react';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notesText, setNotesText] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  // Manual addition state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', notes: '' });
  const [addError, setAddError] = useState('');

  const fetchCustomers = async (search = '') => {
    try {
      const response = await apiFetch(`/customers?search=${search}`);
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
        if (data.customers.length > 0 && !selectedCustomer) {
          setSelectedCustomer(data.customers[0]);
          setNotesText(data.customers[0].notes || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery).then(() => setLoading(false));
  }, [searchQuery]);

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setNotesText(cust.notes || '');
  };

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
        setSelectedCustomer(data.customer);
        // Refresh customer list
        fetchCustomers(searchQuery);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newCust.name || !newCust.phone) {
      setAddError('Customer Name and Phone are required.');
      return;
    }

    try {
      const response = await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify(newCust)
      });
      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setNewCust({ name: '', phone: '', email: '', notes: '' });
        fetchCustomers(searchQuery);
      } else {
        setAddError(data.message || 'Failed to add customer.');
      }
    } catch (err) {
      setAddError('Network error.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-stone-200">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">CLIENT FILES</h1>
          <span className="text-xs text-stone-400 font-sans mt-1">Audit customer logs, visit counts, spend totals, and styling notes.</span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest rounded shadow-md flex items-center gap-2"
        >
          <Plus size={14} /> Register New Client
        </button>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Search & Customers list (col-span-5) */}
        <div className="lg:col-span-5 bg-luxury-dark border border-luxury-gray rounded-lg p-5 flex flex-col gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone..."
              className="w-full bg-luxury-black border border-luxury-gray text-white p-2.5 pl-10 text-xs rounded focus:outline-none focus:border-gold font-sans"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs font-outfit select-none">
              No customers found.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-luxury-gray max-h-[450px] overflow-y-auto pr-1">
              {customers.map((cust) => {
                const isSelected = selectedCustomer?._id === cust._id;
                return (
                  <div
                    key={cust._id}
                    onClick={() => handleSelectCustomer(cust)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-gold/10 text-gold' : 'hover:bg-stone-800/40 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-stone-800 border border-luxury-gray text-stone-300 flex items-center justify-center shrink-0 text-xs font-bold font-outfit uppercase">
                        {cust.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0 leading-tight">
                        <span className="text-xs font-semibold uppercase truncate text-white">{cust.name}</span>
                        <span className="text-[10px] text-stone-500 mt-1">{cust.phone}</span>
                      </div>
                    </div>
                    <span className="font-outfit text-[10px] font-bold text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded tracking-wide shrink-0">
                      {cust.visits?.length || 0} VISITS
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Customer Details & Timeline logs (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {selectedCustomer ? (
            <div className="bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-6">
              
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-gray pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-outfit text-lg font-bold uppercase">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-outfit text-base font-bold text-white uppercase tracking-wide">{selectedCustomer.name}</h3>
                    <span className="text-[10px] text-stone-500 font-sans mt-1">Database ID: {selectedCustomer._id}</span>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center bg-luxury-black/60 px-3.5 py-1.5 rounded border border-luxury-gray text-center min-w-[70px]">
                    <span className="text-xs font-bold text-white font-outfit">{selectedCustomer.visits?.length || 0}</span>
                    <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Visits</span>
                  </div>
                  <div className="flex flex-col items-center bg-luxury-black/60 px-3.5 py-1.5 rounded border border-luxury-gray text-center min-w-[70px]">
                    <span className="text-xs font-bold text-gold font-outfit">
                      ${selectedCustomer.visits?.reduce((sum, v) => sum + v.amount, 0) || 0}
                    </span>
                    <span className="text-[8px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Spent</span>
                  </div>
                </div>
              </div>

              {/* Profile Details Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gold shrink-0" />
                  <span>Phone: {selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gold shrink-0" />
                  <span className="truncate">Email: {selectedCustomer.email || 'N/A'}</span>
                </div>
              </div>

              {/* Styling Notes editor */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider font-outfit border-b border-luxury-gray pb-1.5">
                  <span className="flex items-center gap-1.5"><FileEdit size={12} /> Styling Preferences & Notes</span>
                  <button 
                    onClick={handleUpdateNotes}
                    disabled={updatingNotes}
                    className="text-gold hover:underline font-bold"
                  >
                    {updatingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  placeholder="e.g. Scissor fade only, sensitive scalp, requests tea on arrival..."
                  className="w-full bg-luxury-black border border-luxury-gray text-stone-200 text-xs p-3 rounded focus:outline-none focus:border-gold font-sans leading-relaxed"
                />
              </div>

              {/* Visits history timeline */}
              <div className="flex flex-col gap-3">
                <h4 className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-luxury-gray pb-1.5 flex items-center gap-1.5">
                  <Clock size={12} /> Visit History Timeline
                </h4>
                
                {!selectedCustomer.visits || selectedCustomer.visits.length === 0 ? (
                  <div className="text-stone-500 text-xs italic py-4">
                    No visit transactions logged in history database.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5 max-h-[200px] overflow-y-auto pr-1">
                    {selectedCustomer.visits.map((visit, idx) => (
                      <div key={idx} className="bg-luxury-black/60 border border-luxury-gray p-3 rounded flex items-center justify-between gap-4 font-sans">
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-xs font-semibold text-white uppercase truncate">
                            {visit.services?.join(', ') || 'Grooming treatment'}
                          </span>
                          <span className="text-[10px] text-stone-400 mt-1 uppercase">
                            Artist: {visit.barberName}
                          </span>
                        </div>
                        <div className="text-right shrink-0 flex flex-col gap-1 items-end leading-none">
                          <span className="text-xs font-bold text-gold font-outfit">${visit.amount}</span>
                          <span className="text-[9px] text-stone-500 mt-1">{visit.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-luxury-dark border border-luxury-gray py-20 text-center text-stone-500 font-outfit text-xs rounded-lg select-none">
              Select a customer from the left directory list to view profile files.
            </div>
          )}
        </div>

      </div>

      {/* MANUALLY REGISTER CUSTOMER MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-luxury-dark border-2 border-gold max-w-md w-full rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-luxury-gray flex items-center justify-between">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">ADD NEW CLIENT</h3>
              <button onClick={() => setShowAddForm(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4 font-sans text-xs text-stone-300">
              {addError && (
                <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-2 rounded">
                  {addError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newCust.phone}
                  onChange={(e) => setNewCust(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 012-3456"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={newCust.email}
                  onChange={(e) => setNewCust(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Styling Notes</label>
                <textarea
                  value={newCust.notes}
                  onChange={(e) => setNewCust(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Sensitive scalp, scissor cuts only..."
                  rows={2}
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-white uppercase tracking-wider font-outfit text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Customers;

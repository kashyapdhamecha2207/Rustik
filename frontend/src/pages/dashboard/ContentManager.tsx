import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Settings, FileEdit, Plus, Trash, Check, Sparkles } from 'lucide-react';

export const ContentManager = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // CMS Homepage fields
  const [homepage, setHomepage] = useState({
    heroTitle: 'CRAFTING LEGACY THROUGH LUXURY GROOMING',
    heroSubtitle: 'Rustik Academy provides custom haircutting, straight-razor work, and premium facial therapies in a forest-obsidian atmosphere.',
    introText: 'Established in 2020, Rustik Academy is a master-tier grooming lounge catering to gentlemen of high standard.',
    studioHours: {
      weekdays: '09:00 AM - 08:00 PM',
      saturday: '09:00 AM - 06:00 PM',
      sunday: '10:00 AM - 04:00 PM'
    },
    address: '42 Royal Oak Crescent, Sector 5, Metropolitan'
  });

  // Services catalog list
  const [services, setServices] = useState([]);
  const [newSvc, setNewSvc] = useState({
    name: '',
    category: 'haircut',
    price: '',
    duration: '30',
    description: '',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=300'
  });

  const fetchCMS = async () => {
    try {
      const [cmsRes, svcRes] = await Promise.all([
        apiFetch('/cms/homepage').then(res => res.json()),
        apiFetch('/services').then(res => res.json())
      ]);

      if (cmsRes.success && cmsRes.data) setHomepage(cmsRes.data);
      if (svcRes.success) setServices(svcRes.services);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCMS().then(() => setLoading(false));
  }, []);

  const handleCMSChange = (e) => {
    const { name, value } = e.target;
    setHomepage(prev => ({ ...prev, [name]: value }));
  };

  const handleCMSHoursChange = (name, value) => {
    setHomepage(prev => ({
      ...prev,
      studioHours: { ...prev.studioHours, [name]: value }
    }));
  };

  const handleCMSSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaveLoading(true);

    try {
      const response = await apiFetch('/cms/homepage', {
        method: 'POST',
        body: JSON.stringify({ data: homepage })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Homepage content updated successfully!');
      } else {
        setErrorMsg('Failed to update homepage content.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newSvc.name || !newSvc.price || !newSvc.duration) {
      setErrorMsg('Service Name, Price, and Duration are required.');
      return;
    }

    try {
      const response = await apiFetch('/services', {
        method: 'POST',
        body: JSON.stringify(newSvc)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Service "${newSvc.name}" created successfully.`);
        setNewSvc({
          name: '',
          category: 'haircut',
          price: '',
          duration: '30',
          description: '',
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=300'
        });
        // refresh list
        apiFetch('/services')
          .then(res => res.json())
          .then(res => { if (res.success) setServices(res.services); });
      } else {
        setErrorMsg(data.message || 'Failed to create service.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await apiFetch(`/services/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Service deleted.');
        setServices(services.filter(s => s._id !== id));
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full text-stone-200">
      
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">WEBSITE BUILDER CMS</h1>
        <span className="text-xs text-stone-400 font-sans mt-1">Configure landing copy, schedule hours, and build grooming service catalogs.</span>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-500/35 text-emerald-400 p-3 rounded font-sans text-xs flex items-center gap-2">
          <Check size={16} /> <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-3 rounded font-sans text-xs">
          {errorMsg}
        </div>
      )}

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Homepage editor (col-span-7) */}
        <form onSubmit={handleCMSSubmit} className="lg:col-span-7 bg-luxury-dark border border-luxury-gray rounded-lg p-6 flex flex-col gap-5">
          <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase border-b border-luxury-gray pb-3 flex items-center gap-2">
            <Settings size={14} className="text-gold" /> Homepage Content Editor
          </h3>

          <div className="flex flex-col gap-1.5 font-sans text-xs">
            <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">HERO MAIN TITLE</label>
            <input
              type="text"
              name="heroTitle"
              value={homepage.heroTitle}
              onChange={handleCMSChange}
              className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-sans text-xs">
            <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">HERO SUBTITLE / COPY</label>
            <textarea
              name="heroSubtitle"
              rows={2}
              value={homepage.heroSubtitle}
              onChange={handleCMSChange}
              className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded focus:outline-none focus:border-gold leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-sans text-xs">
            <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">STUDIO INTRODUCTION TEXT</label>
            <textarea
              name="introText"
              rows={3}
              value={homepage.introText}
              onChange={handleCMSChange}
              className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded focus:outline-none focus:border-gold leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5 font-sans text-xs">
            <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">STUDIO ADDRESS</label>
            <input
              type="text"
              name="address"
              value={homepage.address}
              onChange={handleCMSChange}
              className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">WEEKDAY HOURS</label>
              <input
                type="text"
                value={homepage.studioHours?.weekdays}
                onChange={(e) => handleCMSHoursChange('weekdays', e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">SATURDAY HOURS</label>
              <input
                type="text"
                value={homepage.studioHours?.saturday}
                onChange={(e) => handleCMSHoursChange('saturday', e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">SUNDAY HOURS</label>
              <input
                type="text"
                value={homepage.studioHours?.sunday}
                onChange={(e) => handleCMSHoursChange('sunday', e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saveLoading}
            className="mt-2 py-3 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-md flex items-center justify-center gap-2"
          >
            {saveLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest" />
            ) : (
              <>
                <Sparkles size={13} /> Save Copy Settings
              </>
            )}
          </button>
        </form>

        {/* Right Side: Services Manager & Creator (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Add Service */}
          <form onSubmit={handleCreateService} className="bg-luxury-dark border border-luxury-gray rounded-lg p-5 flex flex-col gap-4 font-sans text-xs text-stone-300">
            <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase border-b border-luxury-gray pb-3 flex items-center gap-2">
              <Plus size={14} className="text-gold" /> Add New Therapy Service
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Service Name *</label>
              <input
                type="text"
                required
                value={newSvc.name}
                onChange={(e) => setNewSvc(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Royal Scalp Massage"
                className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Category *</label>
                <select
                  value={newSvc.category}
                  onChange={(e) => setNewSvc(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-luxury-black border border-luxury-gray text-stone-300 p-2 rounded bg-white focus:outline-none"
                >
                  <option value="haircut">Haircut</option>
                  <option value="beard">Beard</option>
                  <option value="coloring">Coloring</option>
                  <option value="facial">Facial</option>
                  <option value="grooming">combo</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Price ($) *</label>
                <input
                  type="number"
                  required
                  value={newSvc.price}
                  onChange={(e) => setNewSvc(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="55"
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Duration (Mins) *</label>
                <input
                  type="number"
                  required
                  value={newSvc.duration}
                  onChange={(e) => setNewSvc(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Image Link URL</label>
                <input
                  type="text"
                  value={newSvc.image}
                  onChange={(e) => setNewSvc(prev => ({ ...prev, image: e.target.value }))}
                  className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Description</label>
              <textarea
                value={newSvc.description}
                onChange={(e) => setNewSvc(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of grooming therapy..."
                rows={2}
                className="bg-luxury-black border border-luxury-gray text-white p-2 rounded focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest shadow"
            >
              Add Service offering
            </button>
          </form>

          {/* Delete service catalog list */}
          <div className="bg-luxury-dark border border-luxury-gray rounded-lg p-5 flex flex-col gap-3">
            <h4 className="font-outfit text-xs font-bold text-white tracking-wider uppercase border-b border-luxury-gray pb-2">Active Tariff Catalog</h4>
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
              {services.map(s => (
                <div key={s._id} className="flex items-center justify-between gap-4 p-2 bg-luxury-black/40 border border-luxury-gray rounded text-xs">
                  <span className="truncate max-w-[150px] uppercase font-outfit font-semibold tracking-wide">{s.name} (${s.price})</span>
                  <button 
                    onClick={() => handleDeleteService(s._id)}
                    className="text-rose-400 hover:text-rose-300 font-bold"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default ContentManager;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Mail, Phone, Clock, MessageCircle, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [searchParams] = useSearchParams();
  const bookParam = searchParams.get('book');
  const serviceParam = searchParams.get('service');
  const barberParam = searchParams.get('barber');

  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  });

  // Options fetched from API
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Status states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Times slots grid
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    // Fetch options
    Promise.all([
      apiFetch('/services').then(res => res.json()),
      apiFetch('/auth/barbers').then(res => res.json())
    ])
      .then(([serviceRes, barberRes]) => {
        if (serviceRes.success) setServices(serviceRes.services);
        if (barberRes.success) setBarbers(barberRes.barbers);
        
        // Auto-select parameters if they exist in query URL
        setFormData(prev => ({
          ...prev,
          serviceId: serviceParam || (serviceRes.services?.[0]?._id || ''),
          barberId: barberParam || (barberRes.barbers?.[0]?._id || '')
        }));
        
        setLoadingOptions(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingOptions(false);
      });
  }, [serviceParam, barberParam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.customerName || !formData.customerPhone || !formData.date || !formData.time || !formData.serviceId || !formData.barberId) {
      setErrorMessage('Please fill in all mandatory fields and select a time slot.');
      return;
    }

    // Resolve service name and barber name
    const selectedSvc = services.find(s => s._id === formData.serviceId);
    const selectedBarber = barbers.find(b => b._id === formData.barberId);

    if (!selectedSvc || !selectedBarber) {
      setErrorMessage('Invalid service or barber selection.');
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          serviceName: selectedSvc.name,
          barberName: selectedBarber.name,
          price: selectedSvc.price,
          duration: selectedSvc.duration
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          serviceId: services?.[0]?._id || '',
          barberId: barbers?.[0]?._id || '',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        setErrorMessage(data.message || 'Failed to request appointment.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error, please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-off-white min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-forest text-white py-16 px-6 text-center relative overflow-hidden border-b-2 border-gold">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-outfit text-xs font-semibold tracking-widest text-gold uppercase">GET IN TOUCH</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">CONTACT & BOOKINGS</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-outfit text-xs font-bold uppercase tracking-widest text-stone-400">STUDIO DIRECTORY</span>
            <h2 className="text-2xl font-bold text-forest uppercase">GET IN TOUCH</h2>
            <p className="font-sans text-xs text-stone-500 leading-relaxed mt-2">
              For press inquiries, corporate events, bespoke wedding bookings, or general questions, please call us directly or drop an email.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 bg-white p-5 rounded-lg border border-stone-200">
              <Phone className="text-gold w-5 h-5 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">CALL DIRECTLY</span>
                <span className="font-outfit text-sm font-bold text-stone-800 mt-1.5">+1 (555) 019-2834</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-5 rounded-lg border border-stone-200">
              <Mail className="text-gold w-5 h-5 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">EMAIL INQUIRIES</span>
                <span className="font-outfit text-sm font-bold text-stone-800 mt-1.5">hello@rustikacademy.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-5 rounded-lg border border-stone-200">
              <Clock className="text-gold w-5 h-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">DOWNTOWN HOURS</span>
                <span className="font-sans text-xs text-stone-600 mt-1.5">Mon - Fri: 09:00 AM - 08:00 PM</span>
                <span className="font-sans text-xs text-stone-600">Sat - Sun: 09:00 AM - 06:00 PM</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Integration Button */}
          <div className="bg-forest text-white border-2 border-gold rounded-lg p-6 flex flex-col gap-4 shadow-md mt-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-gold w-5 h-5" />
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">WHATSAPP CHATLINE</h3>
            </div>
            <p className="font-sans text-[11px] text-stone-300 leading-relaxed">
              Prefer instant booking updates over mobile? Launch a chat session directly with our support desk on WhatsApp for fast reservations.
            </p>
            <a 
              href="https://wa.me/15550192834"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} /> Start WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Online Booking Form (col-span-7) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 shadow-sm">
            {submitSuccess ? (
              /* Success Panel */
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-fade-in">
                <CheckCircle2 size={56} className="text-forest animate-float" />
                <h3 className="font-outfit text-xl font-bold tracking-wider text-forest uppercase">RESERVATION REQUESTED</h3>
                <div className="w-12 h-[2px] bg-gold" />
                <p className="font-sans text-xs text-stone-600 max-w-sm leading-relaxed mt-2">
                  Thank you! Your grooming slot has been recorded as <span className="font-semibold text-gold">pending confirmation</span>. We will send an approval notification/text shortly!
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 px-6 py-2.5 font-outfit text-xs font-bold uppercase tracking-widest bg-forest text-white rounded hover:bg-forest-dark transition-all"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              /* Main Booking Form */
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Calendar className="text-gold w-5 h-5" />
                  <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-forest">REQUEST A RESERVATION</h3>
                </div>

                {errorMessage && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded font-sans">
                    {errorMessage}
                  </div>
                )}

                {loadingOptions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">YOUR NAME *</label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. John Doe"
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">PHONE NUMBER *</label>
                        <input
                          type="text"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. +1 (555) 012-3456"
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">EMAIL ADDRESS (OPTIONAL)</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        placeholder="e.g. john@example.com"
                        className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    {/* Services and Barbers selections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">SELECT THERAPY *</label>
                        <select
                          name="serviceId"
                          value={formData.serviceId}
                          onChange={handleInputChange}
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold bg-white"
                        >
                          {services.map(s => (
                            <option key={s._id} value={s._id}>{s.name} (${s.price})</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">CHOOSE ARTIST *</label>
                        <select
                          name="barberId"
                          value={formData.barberId}
                          onChange={handleInputChange}
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold bg-white"
                        >
                          {barbers.map(b => (
                            <option key={b._id} value={b._id}>{b.name} ({b.rating.toFixed(1)} ★)</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date and Time selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">APPOINTMENT DATE *</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">APPOINTMENT TIME *</label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold bg-white"
                        >
                          <option value="">-- Select Time Slot --</option>
                          {timeSlots.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-outfit text-[10px] font-semibold text-stone-500 uppercase tracking-wider">SPECIAL REQUESTS / SYMPTOMS / NOTES</label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Scissor cut only, beard conditioning preferred..."
                        className="border border-stone-300 p-2.5 text-xs rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full mt-4 py-3 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-md transition-luxury hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      {submitLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest" />
                      ) : (
                        <>
                          <Sparkles size={14} /> Request Session Reservation
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

      </section>

    </div>
  );
};
export default Contact;

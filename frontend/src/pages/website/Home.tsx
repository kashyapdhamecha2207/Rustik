import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Star, Shield, Award, Sparkles, Clock, MapPin, Phone } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState({
    heroTitle: 'CRAFTING LEGACY THROUGH LUXURY GROOMING',
    heroSubtitle: 'Rustik Academy provides custom haircutting, straight-razor work, and premium facial therapies in a forest-obsidian atmosphere.',
    introText: 'Established in 2020, Rustik Academy is a master-tier grooming lounge catering to gentlemen of high standard. Our studio is built on the foundations of heritage barbering and luxury wellness.',
    studioHours: {
      weekdays: '09:00 AM - 08:00 PM',
      saturday: '09:00 AM - 06:00 PM',
      sunday: '10:00 AM - 04:00 PM'
    },
    address: '42 Royal Oak Crescent, Sector 5, Metropolitan'
  });
  const [testimonials, setTestimonials] = useState([
    { name: 'Bruce Wayne', role: 'Business Executive', rating: 5, comment: 'The level of service here is unmatched. It is more than a haircut — it is a therapeutic ritual. The forest-obsidian atmosphere feels private and extremely exclusive.' },
    { name: 'Tony Stark', role: 'Tech Investor', rating: 5, comment: 'Alexander Cutz has absolute surgical precision. Straight-razor beard lineups are incredibly clean. My permanent go-to grooming lounge.' }
  ]);
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch CMS Homepage content
    apiFetch('/cms/homepage')
      .then(res => res.json())
      .then(res => { if (res.success && res.data) setCmsData(res.data); })
      .catch(err => console.error(err));

    // Fetch CMS Testimonials
    apiFetch('/cms/testimonials')
      .then(res => res.json())
      .then(res => { if (res.success && res.data) setTestimonials(res.data); })
      .catch(err => console.error(err));

    // Fetch active services (limit to 3 for featured display)
    apiFetch('/services')
      .then(res => res.json())
      .then(res => { if (res.success) setServices(res.services.slice(0, 3)); })
      .catch(err => console.error(err));

    // Fetch active barbers (limit to 3 for featured display)
    apiFetch('/auth/barbers')
      .then(res => res.json())
      .then(res => { if (res.success) setBarbers(res.barbers.slice(0, 3)); })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-forest-dark via-forest to-stone-950 text-white px-6 overflow-hidden">
        {/* Abstract Gold Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div className="relative max-w-4xl text-center flex flex-col items-center gap-6 z-10">
          <div className="inline-flex items-center gap-2 border border-gold/40 px-3 py-1 rounded bg-gold/5 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-outfit text-xs font-semibold uppercase tracking-[0.25em] text-gold">EXCLUSIVITY DEFINED</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-wider leading-[1.15] text-white">
            {cmsData.heroTitle}
          </h1>

          <p className="font-sans text-stone-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {cmsData.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <button 
              onClick={() => navigate('/contact?book=true')}
              className="px-8 py-3.5 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-lg transition-luxury hover:scale-105"
            >
              Book Reservation
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="px-8 py-3.5 font-outfit text-xs font-bold uppercase tracking-widest border border-gold/40 text-gold rounded hover:bg-gold/10 transition-luxury"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-luxury-black border-y border-gold/20 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col">
            <span className="font-outfit text-2xl md:text-3xl font-bold text-gold">15K+</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Groomed Clients</span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-2xl md:text-3xl font-bold text-gold">8+ Yrs</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Experience</span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-2xl md:text-3xl font-bold text-gold">4.9 / 5</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Customer Rating</span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-2xl md:text-3xl font-bold text-gold">6 Chairs</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Active Studios</span>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION / WHY CHOOSE US */}
      <section className="py-20 px-6 bg-stone-50 text-stone-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="font-outfit text-xs font-bold uppercase tracking-widest text-gold">THE LOUNGE PHILOSOPHY</span>
            <h2 className="text-3xl md:text-4xl font-bold text-forest leading-tight">
              A SACRED SPACE FOR THE MODERN GENTLEMAN
            </h2>
            <p className="font-sans text-stone-600 text-sm leading-relaxed">
              {cmsData.introText}
            </p>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-forest/5 text-forest border border-forest/10">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-outfit text-sm font-semibold uppercase tracking-wider text-stone-800">Hygiene & Safety</h4>
                  <p className="text-xs text-stone-500 mt-1">All blades autoclaved; barber chairs sanitized between every service.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-forest/5 text-forest border border-forest/10">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-outfit text-sm font-semibold uppercase tracking-wider text-stone-800">Master-Level Barbers</h4>
                  <p className="text-xs text-stone-500 mt-1">Every artist carries state and international grooming certifications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury visual card */}
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-stone-200">
            <img 
              src="https://images.unsplash.com/photo-1593702295094-aec22597af65?auto=format&fit=crop&q=80&w=800" 
              alt="Premium Salon Barbering"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <h3 className="font-display text-xl font-bold">Uncompromising Quality</h3>
              <p className="font-sans text-xs text-stone-300 mt-1">Relax in top-tier Italian leather recliner chairs with complimentary beverages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES */}
      <section className="py-20 px-6 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="font-outfit text-xs font-bold uppercase tracking-widest text-gold">GROOMING CATALOGUE</span>
            <h2 className="text-3xl font-bold text-forest">SIGNATURE THERAPIES</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-2" />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div key={svc._id} className="group flex flex-col border border-stone-200/60 rounded overflow-hidden shadow-sm transition-luxury hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden relative">
                  <img src={svc.image} alt={svc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-forest text-gold px-3 py-1 font-outfit text-xs font-bold rounded">
                    ${svc.price}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-forest">{svc.name}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed min-h-[48px]">{svc.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-100 font-outfit text-[11px] font-semibold text-stone-400">
                    <span>DURATION: {svc.duration} MINS</span>
                    <span className="text-gold group-hover:underline cursor-pointer" onClick={() => navigate('/services')}>VIEW ALL</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MASTER ARTISTS */}
      <section className="py-20 px-6 bg-forest text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <span className="font-outfit text-xs font-bold uppercase tracking-widest text-gold">MEET THE ARTISTS</span>
            <h2 className="text-3xl font-bold">OUR MASTER TEAM</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-2" />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {barbers.map((barber) => (
              <div key={barber._id} className="bg-forest-dark border border-gold/15 rounded-lg overflow-hidden flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img src={barber.avatar} alt={barber.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-forest/90 backdrop-blur px-3 py-1 font-outfit text-[10px] font-semibold uppercase tracking-widest text-gold rounded border border-gold/20">
                    {barber.experience} YRS EXP
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-outfit text-base font-bold uppercase tracking-wider text-white">{barber.name}</h3>
                    <div className="flex items-center gap-1 text-gold">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold font-outfit">{barber.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{barber.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {barber.specialties.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="text-[9px] font-outfit font-semibold uppercase tracking-wider bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/20">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate(`/contact?book=true&barber=${barber._id}`)}
                    className="w-full mt-2 py-2 font-outfit text-[10px] font-bold uppercase tracking-widest border border-gold/30 text-gold hover:bg-gold hover:text-forest transition-luxury"
                  >
                    Select Artist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
          <div className="text-center flex flex-col gap-2">
            <span className="font-outfit text-xs font-bold uppercase tracking-widest text-gold">TESTIMONIALS</span>
            <h2 className="text-2xl font-bold text-forest uppercase">Vetted by Sovereigns</h2>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-8 rounded shadow-sm flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-1 text-gold">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center font-outfit text-xs font-bold border border-gold/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-forest">{t.name}</h4>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUICK INFO CARD BAR */}
      <section className="py-12 px-6 bg-forest text-white border-t border-gold/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <Clock className="text-gold w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-outfit text-xs font-bold tracking-widest uppercase text-gold">BUSINESS HOURS</h4>
              <p className="text-xs text-stone-300 mt-1">Mon - Fri: {cmsData.studioHours?.weekdays || '9AM - 8PM'}</p>
              <p className="text-xs text-stone-300">Sat - Sun: {cmsData.studioHours?.saturday || '9AM - 6PM'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="text-gold w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-outfit text-xs font-bold tracking-widest uppercase text-gold">OUR STUDIO</h4>
              <p className="text-xs text-stone-300 mt-1">{cmsData.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="text-gold w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-outfit text-xs font-bold tracking-widest uppercase text-gold">GET IN TOUCH</h4>
              <p className="text-xs text-stone-300 mt-1">PH: +1 (555) 019-2834</p>
              <p className="text-xs text-stone-300">hello@rustikacademy.com</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};
export default Home;

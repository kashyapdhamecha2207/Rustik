import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Star, Shield, Instagram, Award, MessageSquare } from 'lucide-react';

export const Artists = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/auth/barbers')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setBarbers(res.barbers);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full bg-off-white min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-forest text-white py-16 px-6 text-center relative overflow-hidden border-b-2 border-gold">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-outfit text-xs font-semibold tracking-widest text-gold uppercase">THE TEAM MASTERCLASS</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">OUR STYLISTS & BARBERS</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Artists listing content */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-16 text-stone-500 font-outfit text-sm">
            No active barbers registered at the moment.
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {barbers.map((barber) => (
              <div 
                key={barber._id}
                className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Avatar and Info grid left */}
                <div className="flex flex-col items-center shrink-0 w-full md:w-56 text-center md:text-left gap-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gold/40 shadow-inner relative group">
                    <img 
                      src={barber.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'} 
                      alt={barber.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(barber.rating) ? 'currentColor' : 'none'} 
                          className="stroke-gold"
                        />
                      ))}
                      <span className="text-xs font-bold font-outfit text-stone-700 ml-1">({barber.rating.toFixed(1)})</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">EXPERIENCE: {barber.experience} YRS</span>
                  </div>
                </div>

                {/* Bio detail right */}
                <div className="flex-grow flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-3">
                      <div>
                        <h3 className="font-outfit text-xl font-bold tracking-wider text-forest uppercase">{barber.name}</h3>
                        <span className="text-xs text-gold font-medium uppercase tracking-widest mt-1 block">Master Barber & Artist</span>
                      </div>
                      
                      {/* Social handles */}
                      {barber.instagram && (
                        <a 
                          href={`https://instagram.com/${barber.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-outfit text-xs font-semibold text-stone-600 hover:text-gold transition-colors"
                        >
                          <Instagram size={14} className="text-gold" />
                          <span>{barber.instagram}</span>
                        </a>
                      )}
                    </div>

                    <p className="font-sans text-stone-600 text-xs leading-relaxed">
                      {barber.bio || `${barber.name} is a master stylist dedicated to modern, high-precision grooming. Specializing in customized scissor cuts and premium shave therapies.`}
                    </p>

                    {/* Specialties listing */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="font-outfit text-[10px] font-bold uppercase tracking-widest text-stone-400">ARTIST SPECIALTIES</span>
                      <div className="flex flex-wrap gap-2">
                        {barber.specialties && barber.specialties.length > 0 ? (
                          barber.specialties.map((spec, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-outfit font-semibold uppercase tracking-wider bg-forest/5 text-forest px-3 py-1 rounded border border-forest/10"
                            >
                              {spec}
                            </span>
                          ))
                        ) : (
                          ['Classic Shaves', 'Precision Cuts'].map((spec, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-outfit font-semibold uppercase tracking-wider bg-forest/5 text-forest px-3 py-1 rounded border border-forest/10"
                            >
                              {spec}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => navigate(`/contact?book=true&barber=${barber._id}`)}
                      className="px-6 py-3 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-sm hover:scale-105 transition-luxury"
                    >
                      Book With {barber.name.split(' ')[0]}
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      className="px-6 py-3 font-outfit text-xs font-bold uppercase tracking-widest border border-stone-300 text-stone-600 rounded hover:bg-stone-50 transition-luxury"
                    >
                      Inquire / Message
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
export default Artists;

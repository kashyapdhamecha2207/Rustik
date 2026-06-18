import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Sparkles, Clock, DollarSign, ArrowRight } from 'lucide-react';

export const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    apiFetch('/services')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setServices(res.services);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'haircut', label: 'Haircuts' },
    { key: 'beard', label: 'Beard & Shaves' },
    { key: 'coloring', label: 'Coloring' },
    { key: 'facial', label: 'Facial Treatments' },
    { key: 'grooming', label: 'Signature Combos' }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <div className="flex flex-col w-full bg-off-white min-h-screen">
      
      {/* Page Header banner */}
      <section className="bg-forest text-white py-16 px-6 text-center relative overflow-hidden border-b-2 border-gold">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-outfit text-xs font-semibold tracking-widest text-gold uppercase">OUR SPA BOOK</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">GROOMING THERAPIES & TARIFFS</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Services Menu Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Category Tabs list */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-stone-200 pb-6">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-5 py-2.5 rounded font-outfit text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === cat.key
                  ? 'gold-gradient-bg text-forest shadow'
                  : 'text-stone-500 hover:text-forest hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Listing grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 text-stone-500 font-outfit text-sm">
            No services found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map(svc => (
              <div 
                key={svc._id} 
                className="bg-white border border-stone-200/80 p-6 rounded shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-5 relative group"
              >
                {/* Image thumb */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0 border border-stone-100">
                  <img src={svc.image} alt={svc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>

                {/* Content details */}
                <div className="flex-grow flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-outfit text-sm font-bold tracking-wider text-forest uppercase leading-tight group-hover:text-gold transition-colors">
                      {svc.name}
                    </h3>
                    <span className="font-outfit text-base font-bold text-forest whitespace-nowrap bg-gold/10 text-gold px-2.5 py-0.5 rounded border border-gold/15">
                      ₹{svc.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-sans line-clamp-2">
                    {svc.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <span className="font-outfit text-[10px] font-semibold text-stone-400 tracking-wider flex items-center gap-1 uppercase">
                      <Clock size={12} className="text-gold" />
                      {svc.duration} MINS
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action card */}
        <div className="mt-16 bg-forest text-white border-2 border-gold rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col gap-3 max-w-xl text-center md:text-left">
            <span className="font-outfit text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1 justify-center md:justify-start">
              <Sparkles size={12} /> Bespoke Luxury Packages
            </span>
            <h3 className="text-2xl font-bold font-display uppercase tracking-wide">Custom Grooming Consultations</h3>
            <p className="font-sans text-xs text-stone-300 leading-relaxed">
              Don't see exactly what you're looking for? Our master barbers offer tailored styles and hair treatments during consultation. Get in touch to design your signature look.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3.5 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shrink-0 shadow-md transition-luxury hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </section>

    </div>
  );
};
export default Services;

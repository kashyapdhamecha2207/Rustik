import React from 'react';
import { MapPin, Phone, Car, Clock } from 'lucide-react';

export const Locations = () => {
  const branches = [
    {
      id: 1,
      name: 'Metro Downtown (HQ Studio)',
      address: '42 Royal Oak Crescent, Sector 5, Metropolitan',
      phone: '+1 (555) 019-2834',
      manager: 'Arthur Pendelton',
      parking: 'Valet parking is complimentary for customers. Public parking garage is located adjacent to the building.',
      hours: 'Mon - Fri: 09:00 AM - 08:00 PM | Sat: 09:00 AM - 06:00 PM | Sun: 10:00 AM - 04:00 PM',
      coordinates: { x: 45, y: 40 }
    },
    {
      id: 2,
      name: 'Oakridge Elite Studio',
      address: '891 Golden Boulevard, West End, Metropolitan',
      phone: '+1 (555) 019-8877',
      manager: 'Clarissa Gold',
      parking: 'Reserved underground parking (Slots 12-18) available. Elevators take you directly to the studio lobby.',
      hours: 'Mon - Sat: 10:00 AM - 09:00 PM | Sunday: Closed',
      coordinates: { x: 65, y: 60 }
    }
  ];

  return (
    <div className="flex flex-col w-full bg-off-white min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-forest text-white py-16 px-6 text-center relative overflow-hidden border-b-2 border-gold">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-outfit text-xs font-semibold tracking-widest text-gold uppercase">FIND OUR LOUNGES</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">BRANCH LOCATIONS</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Locations layout */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Branches list (left side) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {branches.map(branch => (
            <div 
              key={branch.id}
              className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-3">
                <h3 className="font-outfit text-lg font-bold tracking-wide text-forest uppercase">{branch.name}</h3>
                <span className="text-xs text-gold font-medium uppercase tracking-widest">MANAGED BY: {branch.manager}</span>
              </div>

              <div className="flex flex-col gap-3 font-sans text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                  <p>{branch.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gold shrink-0 mt-0.5" />
                  <p>{branch.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gold shrink-0 mt-0.5" />
                  <p>{branch.hours}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Car size={16} className="text-gold shrink-0 mt-0.5" />
                  <p className="leading-relaxed"><span className="font-semibold text-stone-700">Parking Info: </span>{branch.parking}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-4 border-t border-stone-100">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 font-outfit text-[10px] font-bold uppercase tracking-widest border border-gold/40 text-gold hover:bg-gold/5 transition-all rounded"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* MOCK INTERACTIVE GOOGLE MAPS PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="font-outfit text-xs font-bold uppercase tracking-widest text-stone-400">STUDIO RADAR</span>
          <div className="bg-forest-dark border-2 border-gold h-[420px] rounded-lg overflow-hidden relative shadow-lg flex flex-col items-center justify-center">
            
            {/* SVG Interactive Map Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <path d="M 0,20 L 100,20 M 0,40 L 100,40 M 0,60 L 100,60 M 0,80 L 100,80" stroke="#1c3b24" strokeWidth="0.25" />
              <path d="M 20,0 L 20,100 M 40,0 L 40,100 M 60,0 L 60,100 M 80,0 L 80,100" stroke="#1c3b24" strokeWidth="0.25" />
              
              {/* Major Mock Highways */}
              <path d="M 0,30 Q 30,50 100,20" fill="none" stroke="#254d31" strokeWidth="1" />
              <path d="M 50,0 Q 55,50 80,100" fill="none" stroke="#254d31" strokeWidth="1.2" />

              {/* Glowing Branch Pin 1 */}
              <circle cx="45" cy="40" r="1.5" fill="#C8A96B" />
              <circle cx="45" cy="40" r="5" fill="none" stroke="#C8A96B" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="r" values="3;8;3" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Glowing Branch Pin 2 */}
              <circle cx="65" cy="60" r="1.5" fill="#C8A96B" />
              <circle cx="65" cy="60" r="5" fill="none" stroke="#C8A96B" strokeWidth="0.5" opacity="0.8">
                <animate attributeName="r" values="3;8;3" dur="3s" repeatCount="indefinite" begin="1.5s" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </circle>
            </svg>

            {/* Hover details overlay */}
            <div className="absolute top-4 left-4 bg-luxury-dark/95 border border-gold/30 p-3 rounded font-outfit text-[10px] tracking-wide text-stone-300 max-w-[200px] shadow-md z-10">
              <span className="font-bold text-white block uppercase">STUDIO COORDINATES</span>
              <span className="text-gold block mt-1">● HQ Downtown [45.1, 40.2]</span>
              <span className="text-stone-400 block">● Oakridge Elite [65.4, 60.9]</span>
            </div>

            <div className="relative z-10 text-center px-8 flex flex-col items-center gap-3">
              <span className="font-outfit text-[10px] font-bold text-gold uppercase tracking-[0.25em] bg-forest/80 border border-gold/20 px-2.5 py-1 rounded">Interactive Live Radar</span>
              <p className="font-display text-white text-base leading-snug">Metropolitan Transit Service Coverage</p>
              <p className="font-sans text-[10px] text-stone-400 leading-relaxed max-w-xs mt-1">
                Both studio branches are located within a 5-minute walk from the Downtown Metro Central Station.
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
export default Locations;

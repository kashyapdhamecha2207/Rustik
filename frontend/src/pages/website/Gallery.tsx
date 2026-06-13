import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Eye, Film, Sparkles, Sliders } from 'lucide-react';

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([
    { type: 'image', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600', title: 'Slick Back Pompadour Fade', barberName: 'Marcus Gold', category: 'cuts' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600', title: 'Modern Textured French Crop', barberName: 'Alexander Cutz', category: 'cuts' },
    { type: 'before-after', beforeUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', afterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', title: 'Total Grooming Transformation', barberName: 'Marcus Gold', category: 'before-after' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600', title: 'Precision Straight Razor Lineup', barberName: 'Marcus Gold', category: 'beards' },
    { type: 'video', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600', title: 'Signature Dye & Bleach Styling', barberName: 'Sophia Blend', category: 'videos' }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    apiFetch('/cms/gallery')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          // Add default categories if missing
          const withCats = res.data.map(item => {
            let category = 'cuts';
            if (item.type === 'before-after') category = 'before-after';
            else if (item.type === 'video') category = 'videos';
            else if (item.title?.toLowerCase().includes('beard') || item.title?.toLowerCase().includes('shave')) category = 'beards';
            return { ...item, category };
          });
          setGalleryItems(withCats);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filters = [
    { key: 'all', label: 'All Showcase' },
    { key: 'cuts', label: 'Precision Cuts' },
    { key: 'beards', label: 'Beards & Shaves' },
    { key: 'before-after', label: 'Transformations' },
    { key: 'videos', label: 'Video Reels' }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="flex flex-col w-full bg-off-white min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-forest text-white py-16 px-6 text-center relative overflow-hidden border-b-2 border-gold">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#C8A96B 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-outfit text-xs font-semibold tracking-widest text-gold uppercase">PORTFOLIO LOGS</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">THE SHOWCASE GALLERY</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Gallery Showcase Content */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-stone-200/60 pb-6">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2.5 rounded font-outfit text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === f.key
                  ? 'gold-gradient-bg text-forest shadow'
                  : 'text-stone-500 hover:text-forest hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grids */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => {
              if (item.type === 'before-after') {
                return (
                  /* 1. Before & After Slider Card */
                  <div key={idx} className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm flex flex-col h-[400px]">
                    <div className="relative flex-grow overflow-hidden select-none" style={{ height: '300px' }}>
                      {/* After Image */}
                      <img 
                        src={item.afterUrl} 
                        alt="After Cut" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Before Image with Clip Path */}
                      <div 
                        className="absolute inset-0 overflow-hidden" 
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                      >
                        <img 
                          src={item.beforeUrl} 
                          alt="Before Cut" 
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                      {/* Range Slider handle */}
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderPosition} 
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      />
                      {/* Visual separator line */}
                      <div 
                        className="absolute top-0 bottom-0 w-[2px] bg-gold z-10 pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-forest text-gold border border-gold/40 flex items-center justify-center shadow-md">
                          <Sliders size={12} />
                        </div>
                      </div>
                      {/* Labels */}
                      <span className="absolute bottom-4 left-4 bg-forest/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wider font-outfit z-10">BEFORE</span>
                      <span className="absolute bottom-4 right-4 bg-gold/90 px-2 py-0.5 rounded text-[10px] font-bold text-forest tracking-wider font-outfit z-10">AFTER</span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 border-t border-stone-100">
                      <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-forest">{item.title}</h4>
                      <span className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">ARTIST: {item.barberName}</span>
                    </div>
                  </div>
                );
              } else if (item.type === 'video') {
                return (
                  /* 2. Video Card */
                  <div 
                    key={idx} 
                    className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm flex flex-col h-[400px] group cursor-pointer"
                    onClick={() => setActiveVideo(item)}
                  >
                    <div className="relative flex-grow overflow-hidden bg-black" style={{ height: '300px' }}>
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gold/90 text-forest border border-gold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Film size={20} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 border-t border-stone-100">
                      <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5 justify-between">
                        <span>{item.title}</span>
                        <span className="text-[9px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded uppercase tracking-wider border border-gold/20">REEL</span>
                      </h4>
                      <span className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">ARTIST: {item.barberName}</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  /* 3. Image Card */
                  <div key={idx} className="bg-white border border-stone-200 rounded overflow-hidden shadow-sm flex flex-col h-[400px] group">
                    <div className="relative flex-grow overflow-hidden" style={{ height: '300px' }}>
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="w-10 h-10 rounded-full bg-forest/80 text-gold border border-gold/20 flex items-center justify-center">
                          <Eye size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 border-t border-stone-100">
                      <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-forest">{item.title}</h4>
                      <span className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">ARTIST: {item.barberName}</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </section>

      {/* Video reel playback mockup modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-luxury-dark border-2 border-gold max-w-lg w-full rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-gold z-10 bg-black/40 p-1.5 rounded-full"
            >
              ✕
            </button>
            <div className="h-96 relative bg-stone-900 flex items-center justify-center">
              <img src={activeVideo.url} alt={activeVideo.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-full border border-gold/50 bg-forest/30 flex items-center justify-center text-gold animate-ping">
                  <Film size={28} />
                </div>
                <div className="flex flex-col mt-2">
                  <h4 className="font-outfit text-sm font-semibold uppercase tracking-wider text-white">Playing Masterclass Reel</h4>
                  <p className="text-xs text-stone-400 mt-1">Grooming session detailing: {activeVideo.title}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-forest text-white border-t border-gold flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-outfit text-xs font-bold uppercase tracking-wider">{activeVideo.title}</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest">by {activeVideo.barberName}</span>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="px-5 py-2 font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-md"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Gallery;

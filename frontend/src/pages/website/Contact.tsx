import React from 'react';
import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';

export const Contact = () => {
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
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide uppercase">CONTACT US</h1>
          <div className="w-12 h-[2px] bg-gold mt-2" />
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto w-full flex flex-col items-center gap-12">
        
        <div className="text-center flex flex-col items-center gap-2 max-w-xl">
          <span className="font-outfit text-xs font-bold uppercase tracking-widest text-stone-400">STUDIO DIRECTORY</span>
          <h2 className="text-3xl font-bold text-forest uppercase">GET IN TOUCH</h2>
          <p className="font-sans text-xs text-stone-500 leading-relaxed mt-2 text-center">
            For press inquiries, corporate events, bespoke wedding bookings, or general questions, please call us directly or drop an email.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/20">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">CALL DIRECTLY</span>
            <span className="font-outfit text-base font-bold text-stone-800 mt-1">+1 (555) 019-2834</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/20">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">EMAIL INQUIRIES</span>
            <span className="font-outfit text-base font-bold text-stone-800 mt-1">hello@rustiksalon.com</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/20">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">STUDIO HOURS</span>
            <span className="font-sans text-xs text-stone-600 mt-1 leading-normal">
              Mon - Fri: 09:00 AM - 08:00 PM <br />
              Sat - Sun: 09:00 AM - 06:00 PM
            </span>
          </div>
        </div>

        {/* WhatsApp Integration Button */}
        <div className="max-w-md w-full bg-forest text-white border-2 border-gold rounded-lg p-6 flex flex-col gap-4 shadow-md text-center items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-gold w-5 h-5" />
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">WHATSAPP CHATLINE</h3>
          </div>
          <p className="font-sans text-[11px] text-stone-300 leading-relaxed">
            Need quick answers? Launch a chat session directly with our support desk on WhatsApp for instant assistance.
          </p>
          <a 
            href="https://wa.me/15550192834"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform"
          >
            <MessageCircle size={14} /> Start WhatsApp Chat
          </a>
        </div>
      </section>

    </div>
  );
};

export default Contact;

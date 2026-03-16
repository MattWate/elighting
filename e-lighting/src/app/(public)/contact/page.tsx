"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Netlify Form Submission logic for AJAX/Next.js
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Transmission failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[70vh] bg-zinc-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-white">
          <Send size={32} />
        </div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-zinc-900">Transmission Received</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest max-w-md">
          Our technical team will review your enquiry and respond shortly.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        
        {/* Contact Details & Operating Hours */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 text-zinc-900">
              Connect <br /> <span className="text-zinc-400">With Us</span>
            </h1>
          </div>

          <div className="space-y-8 font-mono text-xs md:text-sm uppercase tracking-widest">
            {/* Clickable Phone Number */}
            <a href="tel:0114523964" className="flex items-center gap-6 group">
              <div className="w-12 h-12 border border-zinc-300 bg-white flex items-center justify-center text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-all">
                <Phone size={20} />
              </div>
              <div>
                <span className="block text-zinc-400 text-[10px] mb-1">Direct Line</span>
                <span className="text-zinc-900 font-bold underline decoration-zinc-300">011 452 3964</span>
              </div>
            </a>

            {/* Clickable Email */}
            <a href="mailto:info@elighting.co.za" className="flex items-center gap-6 group">
              <div className="w-12 h-12 border border-zinc-300 bg-white flex items-center justify-center text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-all">
                <Mail size={20} />
              </div>
              <div>
                <span className="block text-zinc-400 text-[10px] mb-1">Email</span>
                <span className="text-zinc-900 font-bold underline decoration-zinc-300">info@elighting.co.za</span>
              </div>
            </a>

            {/* Map Link */}
            <a href="https://www.google.com/maps/search/?api=1&query=51+Brunton+Street+Founders+Hill+Edenvale" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
              <div className="w-12 h-12 border border-zinc-300 bg-white flex items-center justify-center text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-all">
                <MapPin size={20} />
              </div>
              <div>
                <span className="block text-zinc-400 text-[10px] mb-1">HQ Location</span>
                <span className="text-zinc-900 font-bold leading-normal">51 Brunton Street, Founders Hill, <br /> Edenvale, South Africa</span>
                <span className="flex items-center gap-1 text-[8px] mt-2 text-zinc-400 group-hover:text-zinc-900 uppercase">
                  <ExternalLink size={10} /> View Map
                </span>
              </div>
            </a>

            {/* Trading Hours */}
            <div className="flex items-start gap-6 pt-4">
              <div className="w-12 h-12 border border-zinc-300 bg-white flex items-center justify-center text-zinc-400">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <span className="block text-zinc-400 text-[10px] mb-3 font-bold">Trading Hours</span>
                <div className="grid grid-cols-2 gap-y-2 text-[11px] text-zinc-600">
                  <span>Mon — Thu</span> <span className="text-zinc-900 font-bold">07:30 – 16:00</span>
                  <span>Fri</span> <span className="text-zinc-900 font-bold">07:30 – 15:00</span>
                  <span>Sat — Sun</span> <span className="text-zinc-400">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Netlify Standard Format Form */}
        <div className="bg-white border border-zinc-200 p-8 md:p-12 shadow-sm">
          <form 
            name="contact" 
            method="POST" 
            data-netlify="true" 
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Hidden field for Netlify form-name matching */}
            <input type="hidden" name="form-name" value="contact" />
            
            <p className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest font-bold block">
                Name <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-zinc-50 border border-zinc-200 p-4 mt-2 text-zinc-900 focus:border-zinc-900 outline-none transition-all" 
                />
              </label>
            </p>
            
            <p className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest font-bold block">
                Email <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-zinc-50 border border-zinc-200 p-4 mt-2 text-zinc-900 focus:border-zinc-900 outline-none transition-all" 
                />
              </label>
            </p>

            <p className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest font-bold block">
                Enquiry <textarea 
                  name="message" 
                  required 
                  rows={5} 
                  className="w-full bg-zinc-50 border border-zinc-200 p-4 mt-2 text-zinc-900 focus:border-zinc-900 outline-none transition-all resize-none" 
                />
              </label>
            </p>

            <p>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-5 font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

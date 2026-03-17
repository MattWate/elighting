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
    // Add the form name manually to the data being sent
    formData.append("form-name", "contact");

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[70vh] bg-zinc-100 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-zinc-900">Transmission Received</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        {/* Contact Info (Left Side) */}
        <div className="space-y-12">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-zinc-900">Connect</h1>
            <div className="space-y-4 font-mono text-sm">
                <p>Tel: 011 452 3964</p>
                <p>Email: info@elighting.co.za</p>
            </div>
        </div>

        {/* The Form (Right Side) */}
        <div className="bg-white border border-zinc-200 p-8 shadow-sm">
          {/* CRITICAL CHANGE: 
            We removed 'data-netlify' and 'netlify' attributes.
            We use a standard onSubmit handler.
          */}
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Name</label>
              <input name="name" required className="w-full bg-zinc-50 border border-zinc-200 p-4" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Email</label>
              <input name="email" type="email" required className="w-full bg-zinc-50 border border-zinc-200 p-4" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Message</label>
              <textarea name="message" required rows={5} className="w-full bg-zinc-50 border border-zinc-200 p-4" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white py-5 font-bold uppercase text-xs tracking-widest">
              {loading ? 'SENDING...' : 'SEND'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

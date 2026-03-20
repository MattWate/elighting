"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    // 1. Save to Database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([payload]);

    if (dbError) {
      alert("Database error. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Trigger the Email Function
    // First, get the recipient from settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_recipient_email')
      .single();

    await supabase.functions.invoke('send-contact-email', {
      body: { ...payload, recipient: settings?.value || 'info@elighting.co.za' },
    });

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-[70vh] bg-zinc-100 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold uppercase text-zinc-900">Enquiry Logged</h1>
        <p className="text-zinc-500 font-mono mt-4">We will be in touch shortly.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
           <h1 className="text-7xl font-bold uppercase tracking-tighter text-zinc-900">Contact</h1>
           <p className="mt-8 text-zinc-600 font-light text-lg">Your data is stored securely and transmitted directly to our sales team.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-12 border border-zinc-200 shadow-sm space-y-6">
          <input name="name" placeholder="Name" required className="w-full p-4 border border-zinc-200" />
          <input name="email" type="email" placeholder="Email" required className="w-full p-4 border border-zinc-200" />
          <textarea name="message" placeholder="Message" rows={5} required className="w-full p-4 border border-zinc-200" />
          <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white py-5 font-bold uppercase">
            {loading ? 'Processing...' : 'Send Enquiry'}
          </button>
        </form>
      </div>
    </main>
  );
}

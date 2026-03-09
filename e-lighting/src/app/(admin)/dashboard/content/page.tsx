"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContentManager() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*').order('key');
    if (data) setSettings(data);
  }

  async function handleUpdate(id: string, newValue: string) {
    setLoading(true);
    await supabase.from('site_settings').update({ value: newValue }).eq('id', id);
    setLoading(false);
  }

  return (
    <main className="p-12 max-w-4xl mx-auto">
      <header className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Site Content</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Full CMS Control Panel</p>
      </header>

      <div className="space-y-10">
        {settings.map((s) => (
          <div key={s.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{s.description || s.key}</label>
              <span className="text-[8px] text-zinc-800 font-mono uppercase">Key: {s.key}</span>
            </div>
            <textarea 
              defaultValue={s.value}
              onBlur={(e) => handleUpdate(s.id, e.target.value)}
              className="w-full bg-black border border-zinc-900 p-4 text-white font-mono text-sm focus:border-zinc-500 outline-none transition-all resize-none"
              rows={s.value.length > 100 ? 4 : 2}
            />
          </div>
        ))}
      </div>
      {loading && <p className="fixed bottom-10 right-10 text-white font-mono text-xs animate-pulse">SAVING TO DATABASE...</p>}
    </main>
  );
}

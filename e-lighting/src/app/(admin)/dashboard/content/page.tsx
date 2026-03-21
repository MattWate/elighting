"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

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
    fetchSettings();
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
          <div key={s.id} className="space-y-3 p-6 border border-zinc-900 bg-black">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{s.description || s.key}</label>
            </div>

            {s.key.includes('image') ? (
              <div className="space-y-4">
                {s.value && (
                  <div className="w-full h-40 border border-zinc-800 overflow-hidden">
                    <img src={s.value} className="w-full h-full object-cover grayscale" alt="Preview" />
                  </div>
                )}
                <ImageUploader 
                  bucket="category-images" 
                  onUploadComplete={(url) => handleUpdate(s.id, url)} 
                />
              </div>
            ) : (
              <textarea 
                defaultValue={s.value}
                onBlur={(e) => handleUpdate(s.id, e.target.value)}
                className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-sm focus:border-zinc-500 outline-none transition-all resize-none"
                rows={s.value.length > 100 ? 4 : 2}
              />
            )}
          </div>
        ))}
      </div>
      {loading && <p className="fixed bottom-10 right-10 text-white font-mono text-xs animate-pulse">SYNCING ASSETS...</p>}
    </main>
  );
}

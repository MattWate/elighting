"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus } from 'lucide-react';

export default function ManageApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newApp, setNewApp] = useState({ title: '', description: '', image_url: '' });

  useEffect(() => { fetchApps(); }, []);

  async function fetchApps() {
    const { data } = await supabase.from('applications').select('*').order('created_at');
    if (data) setApps(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from('applications').insert([newApp]);
    setNewApp({ title: '', description: '', image_url: '' });
    fetchApps();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    await supabase.from('applications').delete().eq('id', id);
    fetchApps();
  }

  return (
    <main className="p-12 max-w-7xl mx-auto">
      <header className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Applications</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Manage Use Cases</p>
      </header>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-[#0c0c0c] border border-zinc-900 p-8 mb-12 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input 
              required
              placeholder="Application Title (e.g. Industrial Warehousing)"
              className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500"
              value={newApp.title}
              onChange={(e) => setNewApp({...newApp, title: e.target.value})}
            />
            <textarea 
              placeholder="Brief description of how lighting is applied here..."
              className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 resize-none"
              rows={3}
              value={newApp.description}
              onChange={(e) => setNewApp({...newApp, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-600 uppercase mb-2 font-mono">Reference Image</label>
            <ImageUploader 
              bucket="category-images" 
              onUploadComplete={(url) => setNewApp({...newApp, image_url: url})} 
            />
          </div>
        </div>
        <button className="bg-white text-black px-8 py-3 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
          <Plus size={14} /> Add Application
        </button>
      </form>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="border border-zinc-900 bg-black overflow-hidden group">
            <div className="h-40 bg-zinc-900 relative">
              {app.image_url && <img src={app.image_url} className="w-full h-full object-cover opacity-50" />}
              <button 
                onClick={() => handleDelete(app.id)}
                className="absolute top-2 right-2 p-2 bg-red-900/80 text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold uppercase tracking-tight text-white">{app.title}</h3>
              <p className="text-zinc-500 text-xs mt-2 font-mono">{app.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

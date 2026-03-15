"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus, Star } from 'lucide-react';

export default function ManageApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newApp, setNewApp] = useState({ 
    title: '', 
    description: '', 
    image_url: '', 
    is_featured: false 
  });

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setApps(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('applications')
      .insert([newApp]);

    if (error) {
      alert(`Error adding application: ${error.message}`);
    } else {
      setNewApp({ title: '', description: '', image_url: '', is_featured: false });
      fetchApps();
    }
    setLoading(false);
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('applications')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      fetchApps();
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the "${title}" application?`)) return;
    
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      fetchApps();
    }
  }

  return (
    <main className="p-12 max-w-7xl mx-auto">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Applications</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Manage Industry Use Cases</p>
        </div>
      </header>

      {/* Add New Application Form */}
      <section className="bg-[#0c0c0c] border border-zinc-900 p-8 mb-16">
        <h2 className="text-white font-bold uppercase tracking-widest text-xs mb-8 border-b border-zinc-800 pb-4">Register New Application</h2>
        <form onSubmit={handleAdd} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Application Title</label>
                <input 
                  required
                  placeholder="e.g. Industrial Warehousing"
                  className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 transition-all"
                  value={newApp.title}
                  onChange={(e) => setNewApp({...newApp, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Description</label>
                <textarea 
                  required
                  placeholder="Describe the lighting requirements for this application..."
                  className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 resize-none h-32 leading-relaxed"
                  value={newApp.description}
                  onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Cover Image</label>
                <ImageUploader 
                  bucket="category-images" 
                  onUploadComplete={(url) => setNewApp({...newApp, image_url: url})} 
                />
                {newApp.image_url && (
                  <div className="mt-4 w-full h-32 border border-zinc-800 relative">
                    <img src={newApp.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 border border-zinc-900 bg-black">
                <input 
                  type="checkbox" 
                  id="feat_app"
                  checked={newApp.is_featured}
                  className="w-4 h-4 accent-white cursor-pointer"
                  onChange={(e) => setNewApp({...newApp, is_featured: e.target.checked})}
                />
                <label htmlFor="feat_app" className="text-zinc-400 text-[10px] uppercase font-mono tracking-widest cursor-pointer">
                  Feature on Homepage Slider
                </label>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="bg-white text-black px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            <Plus size={16} /> {loading ? 'Processing...' : 'Deploy Application'}
          </button>
        </form>
      </section>

      {/* Active Applications List */}
      <h2 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-6">Current Applications Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apps.map((app) => (
          <div key={app.id} className="group border border-zinc-900 bg-[#080808] flex flex-col overflow-hidden hover:border-zinc-700 transition-all">
            <div className="h-48 bg-zinc-900 relative">
              {app.image_url ? (
                <img src={app.image_url} className="w-full h-full object-cover opacity-60" alt={app.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-mono text-[10px]">No Image Linked</div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => toggleFeatured(app.id, app.is_featured)}
                  className={`p-2 border transition-all ${app.is_featured ? 'bg-white text-black border-white' : 'bg-black/50 text-white border-zinc-700 hover:border-white'}`}
                  title={app.is_featured ? "Remove from Home Slider" : "Add to Home Slider"}
                >
                  <Star size={14} fill={app.is_featured ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => handleDelete(app.id, app.title)}
                  className="p-2 bg-red-900/80 text-white hover:bg-red-600 border border-transparent transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">{app.title}</h3>
              <p className="text-zinc-500 text-xs font-mono leading-relaxed line-clamp-3">
                {app.description}
              </p>
            </div>
          </div>
        ))}
        {apps.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-900">
            <p className="text-zinc-700 font-mono text-xs uppercase tracking-widest">No applications registered in database.</p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2, Plus, Package, Image as ImageIcon } from 'lucide-react';

export default function AdminApplicationsManager() {
  const [apps, setApps] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  
  const [newApp, setNewApp] = useState({
    title: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: appsData } = await supabase.from('applications').select('*, application_products(product_id)').order('created_at', { ascending: false });
    const { data: prodData } = await supabase.from('products').select('id, name');
    if (appsData) setApps(appsData);
    if (prodData) setProducts(prodData);
  }

  async function handleCreateApp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('applications').insert([newApp]);
    if (error) alert(error.message);
    else {
      setNewApp({ title: '', description: '', image_url: '', is_featured: false });
      setActiveTab('list');
      fetchData();
    }
    setLoading(false);
  }

  async function toggleProductLink(appId: string, productId: string, isLinked: boolean) {
    if (isLinked) {
      await supabase.from('application_products').delete().eq('application_id', appId).eq('product_id', productId);
    } else {
      await supabase.from('application_products').insert([{ application_id: appId, product_id: productId }]);
    }
    fetchData();
  }

  async function deleteApp(id: string) {
    if (!confirm("Delete this application? Linked product references will be removed.")) return;
    await supabase.from('applications').delete().eq('id', id);
    fetchData();
  }

  return (
    <main className="p-12 max-w-7xl mx-auto text-zinc-300">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Application Manager</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Connect use-cases to hardware</p>
        </div>
        <div className="flex bg-zinc-900 p-1">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'list' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>Inventory</button>
          <button onClick={() => setActiveTab('add')} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'add' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>Create New</button>
        </div>
      </header>

      {activeTab === 'add' ? (
        <section className="bg-[#0c0c0c] border border-zinc-900 p-8 animate-in fade-in slide-in-from-bottom-4">
          <form onSubmit={handleCreateApp} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Application Title</label>
                  <input required value={newApp.title} onChange={e => setNewApp({...newApp, title: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 transition-all" placeholder="e.g. Sports Stadiums" />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Description</label>
                  <textarea required value={newApp.description} onChange={e => setNewApp({...newApp, description: e.target.value})} rows={4} className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 transition-all resize-none" />
                </div>
              </div>
              <div className="space-y-6">
                <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Hero Image Asset</label>
                <ImageUploader bucket="category-images" onUploadComplete={url => setNewApp({...newApp, image_url: url})} />
                {newApp.image_url && <div className="h-40 border border-zinc-800 overflow-hidden"><img src={newApp.image_url} className="w-full h-full object-cover" alt="Preview" /></div>}
              </div>
            </div>
            <button disabled={loading} className="w-full bg-white text-black py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">{loading ? 'DEPLOYING...' : 'REGISTER APPLICATION'}</button>
          </form>
        </section>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => (
            <div key={app.id} className="bg-[#0c0c0c] border border-zinc-900 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto bg-zinc-900 relative">
                  {app.image_url ? <img src={app.image_url} className="w-full h-full object-cover opacity-60" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="text-zinc-800" /></div>}
                  <button onClick={() => deleteApp(app.id)} className="absolute top-4 right-4 p-2 bg-red-900/80 text-white hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                </div>
                <div className="flex-1 p-8">
                  <h2 className="text-2xl font-bold uppercase text-white mb-2">{app.title}</h2>
                  <p className="text-zinc-500 text-xs font-mono mb-8 line-clamp-2">{app.description}</p>
                  
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={12} /> Linked Lighting Solutions</h3>
                    <div className="flex flex-wrap gap-2">
                      {products.map(prod => {
                        const isLinked = app.application_products.some((ap: any) => ap.product_id === prod.id);
                        return (
                          <button
                            key={prod.id}
                            onClick={() => toggleProductLink(app.id, prod.id, isLinked)}
                            className={`px-3 py-1.5 text-[9px] font-mono uppercase border transition-all ${isLinked ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}
                          >
                            {prod.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';

export default function AddProductForm({ onComplete }: { onComplete: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: 0,
    description: '',
    data_sheet_url: '',
    images: [] as string[],
    specs: {} as any
  });

  useEffect(() => {
    async function getCategories() {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    }
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Auto-generate URL-friendly slug
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const { error } = await supabase.from('products').insert([
      { ...formData, slug }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Product successfully added to inventory.");
      onComplete();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f0f0f] p-8 border border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-zinc-900 pb-2">Identification</h3>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Product Model Name</label>
            <input 
              required
              placeholder="e.g. Titan LED Modular"
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none transition-all font-mono"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Category Assignment</label>
            <select 
              required
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none appearance-none cursor-pointer"
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Standard Pricing ($)</label>
            <input 
              type="number"
              step="0.01"
              className="w-full bg-black border border-zinc-800 p-4 text-white font-mono"
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-zinc-900 pb-2">Technical Assets</h3>
          
          <label className="block text-zinc-400 text-xs uppercase">Specification Sheet (PDF)</label>
          <ImageUploader 
            bucket="product-assets" 
            onUploadComplete={(url) => setFormData({...formData, data_sheet_url: url})}
          />
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Marketing Description</label>
            <textarea 
              rows={5}
              placeholder="Enter industrial value proposition..."
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full bg-white text-black font-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-zinc-300 transition-all disabled:opacity-20 flex justify-center items-center gap-2"
      >
        {loading ? 'Committing Data...' : 'Deploy Product to Live Site'}
      </button>
    </form>
  );
}

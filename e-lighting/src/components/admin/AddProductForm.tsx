"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';
import { Trash2, Plus, Film } from 'lucide-react';

export default function AddProductForm({ onComplete, productToEdit }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    category_id: productToEdit?.category_id || '',
    description: productToEdit?.description || '',
    images: productToEdit?.images || [] as string[],
    video_url: productToEdit?.video_url || '',
    video_type: productToEdit?.video_type || 'youtube',
    specs: productToEdit?.specs || {} as any,
    is_featured: productToEdit?.is_featured || false
  });

  useEffect(() => {
    async function getCategories() {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    }
    getCategories();
  }, []);

  const addImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  // FIXED: Explicitly typed the '_' parameter as string to avoid "implicit any" error
  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_: string, i: number) => i !== index) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const productData = { ...formData, slug };

    let error;
    if (productToEdit) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productToEdit.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);
      error = insertError;
    }

    if (error) {
      alert(`Database Error: ${error.message}`);
    } else {
      onComplete();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f0f0f] p-8 border border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">Product Details</h3>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Model Name</label>
            <input 
              required 
              value={formData.name}
              className="w-full bg-black border border-zinc-800 p-4 text-white outline-none font-mono"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Category</label>
            <select 
              required 
              value={formData.category_id}
              className="w-full bg-black border border-zinc-800 p-4 text-white outline-none"
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Description</label>
            <textarea 
              rows={5} 
              value={formData.description}
              className="w-full bg-black border border-zinc-800 p-4 text-white outline-none resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="flex items-center gap-3 p-4 border border-zinc-900 bg-black">
            <input 
              type="checkbox" 
              id="featured"
              checked={formData.is_featured}
              className="w-4 h-4 accent-white cursor-pointer"
              onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
            />
            <label htmlFor="featured" className="text-zinc-400 text-[10px] uppercase font-mono tracking-widest cursor-pointer">
              Feature on Homepage
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">Media Assets</h3>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Image Gallery</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {formData.images.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square border border-zinc-800">
                  <img src={img} className="w-full h-full object-cover" alt="Unit" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-900 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed border-zinc-800 flex items-center justify-center aspect-square">
                <ImageUploader bucket="product-assets" onUploadComplete={addImage} />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-black border border-zinc-900">
            <div className="flex gap-4 mb-2">
              <button 
                type="button"
                onClick={() => setFormData({...formData, video_type: 'youtube'})}
                className={`text-[9px] uppercase font-bold tracking-widest ${formData.video_type === 'youtube' ? 'text-white underline' : 'text-zinc-600'}`}
              >
                YouTube Link
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, video_type: 'upload'})}
                className={`text-[9px] uppercase font-bold tracking-widest ${formData.video_type === 'upload' ? 'text-white underline' : 'text-zinc-600'}`}
              >
                Direct Upload
              </button>
            </div>

            {formData.video_type === 'youtube' ? (
              <input 
                placeholder="YouTube URL"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-white"
              />
            ) : (
              <ImageUploader bucket="product-assets" onUploadComplete={(url) => setFormData({...formData, video_url: url})} />
            )}
          </div>
        </div>
      </div>

      <button 
        disabled={loading} 
        className="w-full bg-white text-black py-5 font-black uppercase text-xs tracking-widest hover:bg-zinc-300 transition-all disabled:opacity-20"
      >
        {loading ? 'DEPLOYING...' : 'Save Product Assets'}
      </button>
    </form>
  );
}

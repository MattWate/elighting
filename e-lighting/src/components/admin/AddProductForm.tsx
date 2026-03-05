"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';

interface AddProductFormProps {
  onComplete: () => void;
  productToEdit?: any;
}

export default function AddProductForm({ onComplete, productToEdit }: AddProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    category_id: productToEdit?.category_id || '',
    price: productToEdit?.price || 0,
    description: productToEdit?.description || '',
    data_sheet_url: productToEdit?.data_sheet_url || '',
    is_featured: productToEdit?.is_featured || false,
    images: productToEdit?.images || [] as string[], // Already in schema
    specs: productToEdit?.specs || {} as any
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
      alert(productToEdit ? "Product successfully updated." : "Product added to inventory.");
      onComplete();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f0f0f] p-8 border border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-zinc-900 pb-2">Identification</h3>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Model Name</label>
            <input 
              required 
              value={formData.name}
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none transition-all font-mono"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Category Assignment</label>
            <select 
              required 
              value={formData.category_id}
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none cursor-pointer"
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
              value={formData.price}
              className="w-full bg-black border border-zinc-800 p-4 text-white font-mono"
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} 
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

        {/* Assets Section */}
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] border-b border-zinc-900 pb-2">Visuals & Data</h3>
          
          {/* PRODUCT IMAGE UPLOAD */}
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Primary Product Image</label>
            <ImageUploader 
              bucket="product-assets" 
              onUploadComplete={(url) => setFormData({...formData, images: [url]})} 
            />
            {formData.images.length > 0 && (
              <div className="mt-2 relative w-20 h-20 border border-zinc-800">
                <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* DATA SHEET UPLOAD */}
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Specification Sheet (PDF)</label>
            <ImageUploader 
              bucket="product-assets" 
              onUploadComplete={(url) => setFormData({...formData, data_sheet_url: url})} 
            />
            {formData.data_sheet_url && <p className="text-[9px] text-green-500 font-mono truncate mt-1">PDF LINKED</p>}
          </div>
          
          <div>
            <label className="block text-zinc-400 text-xs uppercase mb-2">Unit Description</label>
            <textarea 
              rows={3} 
              value={formData.description}
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-zinc-500 outline-none resize-none leading-relaxed"
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>
        </div>
      </div>

      <button 
        disabled={loading} 
        className="w-full bg-white text-black font-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-zinc-300 transition-all disabled:opacity-20 flex justify-center items-center gap-2"
      >
        {loading ? 'PROCESSING...' : productToEdit ? 'UPDATE UNIT DATA' : 'DEPLOY PRODUCT TO LIVE SITE'}
      </button>
    </form>
  );
}

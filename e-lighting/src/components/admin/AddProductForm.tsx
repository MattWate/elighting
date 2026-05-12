"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';
import { Trash2, Settings, Package, Info } from 'lucide-react';

export default function AddProductForm({ onComplete, productToEdit, canSubmit = true }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    sku: productToEdit?.sku || '',
    category_id: productToEdit?.category_id || '',
    description: productToEdit?.description || '',
    images: productToEdit?.images || [] as string[],
    data_sheet_url: productToEdit?.data_sheet_url || '',
    video_url: productToEdit?.video_url || '',
    video_type: productToEdit?.video_type || 'youtube',
    is_featured: productToEdit?.is_featured || false,
    specs: {
      nominal_power: productToEdit?.specs?.nominal_power || '',
      luminous_flux: productToEdit?.specs?.luminous_flux || '',
      luminous_efficacy: productToEdit?.specs?.luminous_efficacy || '',
      cct: productToEdit?.specs?.cct || '',
      led_lifetime: productToEdit?.specs?.led_lifetime || '',
      cri: productToEdit?.specs?.cri || '',
      nominal_input_voltage: productToEdit?.specs?.nominal_input_voltage || '',
      operating_temperature: productToEdit?.specs?.operating_temperature || '',
      surge_protection: productToEdit?.specs?.surge_protection || '',
      ip_rating: productToEdit?.specs?.ip_rating || '',
      ik_rating: productToEdit?.specs?.ik_rating || '',
      compliance: productToEdit?.specs?.compliance || '',
      diffuser: productToEdit?.specs?.diffuser || '',
      housing: productToEdit?.specs?.housing || '',
      mounting: productToEdit?.specs?.mounting || '',
      emergency: productToEdit?.specs?.emergency || ''
    }
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

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_: string, i: number) => i !== index) 
    }));
  };

  const updateSpec = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      alert('You do not have permission to save product changes.');
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-12 bg-[#0c0c0c] p-8 border border-zinc-900 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-900 pb-2">
            <Package size={14} />
            <h3 className="font-mono text-[10px] uppercase tracking-widest">Identification</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-2 font-mono">Model Name</label>
              <input 
                required 
                value={formData.name}
                className="w-full bg-black border border-zinc-800 p-4 text-white outline-none font-mono focus:border-zinc-500 transition-all"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-2 font-mono">SKU / Product Code</label>
              <input 
                value={formData.sku}
                className="w-full bg-black border border-zinc-800 p-4 text-white outline-none font-mono focus:border-zinc-500 transition-all"
                onChange={(e) => setFormData({...formData, sku: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-2 font-mono">Category</label>
              <select 
                required 
                value={formData.category_id}
                className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 transition-all"
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-2 font-mono">Description</label>
              <textarea 
                rows={5} 
                value={formData.description}
                className="w-full bg-black border border-zinc-800 p-4 text-white outline-none resize-none focus:border-zinc-500 transition-all"
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
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-900 pb-2">
            <Info size={14} />
            <h3 className="font-mono text-[10px] uppercase tracking-widest">Media Gallery</h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-4 font-mono tracking-widest">Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
                {formData.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square border border-zinc-800 bg-black group overflow-hidden">
                    <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Unit" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-900 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed border-zinc-800 bg-black hover:border-zinc-500 transition-colors">
                  <ImageUploader bucket="product-assets" onUploadComplete={addImage} acceptedTypes="image/*" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-2 font-mono">Data Sheet URL</label>
              <input 
                placeholder="Paste PDF URL or upload below"
                value={formData.data_sheet_url}
                onChange={(e) => setFormData({...formData, data_sheet_url: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-zinc-500 transition-all"
              />
              <div className="mt-3 h-24 border border-dashed border-zinc-800 bg-black">
                <ImageUploader bucket="product-assets" acceptedTypes="application/pdf" onUploadComplete={(url) => setFormData({...formData, data_sheet_url: url})} />
              </div>
            </div>

            <div className="space-y-4 p-6 bg-black border border-zinc-900">
              <div className="flex gap-6 mb-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, video_type: 'youtube'})}
                  className={`text-[10px] uppercase font-bold tracking-widest transition-all ${formData.video_type === 'youtube' ? 'text-white underline' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  YouTube Link
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, video_type: 'upload'})}
                  className={`text-[10px] uppercase font-bold tracking-widest transition-all ${formData.video_type === 'upload' ? 'text-white underline' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  Direct Upload
                </button>
              </div>

              {formData.video_type === 'youtube' ? (
                <input 
                  placeholder="Paste YouTube URL"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs text-white outline-none focus:border-zinc-500"
                />
              ) : (
                <div className="bg-zinc-900 p-2 border border-zinc-800 h-24">
                  <ImageUploader bucket="product-assets" acceptedTypes="video/*" onUploadComplete={(url) => setFormData({...formData, video_url: url})} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-zinc-500">
          <Settings size={14} />
          <h3 className="font-mono text-[10px] uppercase tracking-widest">Engineering Specifications</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(formData.specs).map((key) => (
            <div key={key}>
              <label className="block text-zinc-500 text-[9px] uppercase mb-2 font-mono tracking-wider">
                {key.replace(/_/g, ' ')}
              </label>
              <input 
                value={(formData.specs as any)[key]}
                onChange={(e) => updateSpec(key, e.target.value)}
                className="w-full bg-black border border-zinc-800 p-3 text-white text-xs outline-none focus:border-zinc-500 transition-colors"
                placeholder="N/A"
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        disabled={loading || !canSubmit} 
        className="w-full bg-white text-black py-6 font-black uppercase text-xs tracking-widest hover:bg-zinc-300 transition-all disabled:opacity-20 sticky bottom-0 z-10 shadow-2xl"
      >
        {loading ? 'SYNCHRONIZING DATA...' : canSubmit ? 'Confirm Changes & Deploy' : 'Permission Required'}
      </button>
    </form>
  );
}

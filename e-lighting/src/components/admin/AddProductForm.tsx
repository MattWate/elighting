"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';
import { Trash2, Plus, Film } from 'lucide-react';

export default function AddProductForm({ onComplete, productToEdit }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    category_id: productToEdit?.category_id || '',
    description: productToEdit?.description || '',
    images: productToEdit?.images || [] as string[],
    video_url: productToEdit?.video_url || '',
    video_type: productToEdit?.video_type || 'youtube',
    specs: productToEdit?.specs || {},
    is_featured: productToEdit?.is_featured || false
  });

  const addImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const { error } = productToEdit 
      ? await supabase.from('products').update({ ...formData, slug }).eq('id', productToEdit.id)
      : await supabase.from('products').insert([{ ...formData, slug }]);

    if (error) alert(error.message);
    else onComplete();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f0f0f] p-8 border border-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">Product Details</h3>
          <input 
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-sm"
          />
          <textarea 
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-black border border-zinc-800 p-4 text-white text-sm h-32"
          />
        </div>

        {/* Media Gallery Section */}
        <div className="space-y-6">
          <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">Media Gallery</h3>
          
          {/* Multi-Image Upload */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square border border-zinc-800">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-900 text-white"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
            <div className="border-2 border-dashed border-zinc-800 flex items-center justify-center aspect-square">
              <ImageUploader bucket="product-assets" onUploadComplete={addImage} />
            </div>
          </div>

          {/* Video Integration */}
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
                placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
                value={formData.video_url}
                onChange={e => setFormData({...formData, video_url: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-white"
              />
            ) : (
              <ImageUploader bucket="product-assets" onUploadComplete={(url) => setFormData({...formData, video_url: url})} />
            )}
            {formData.video_url && <p className="text-[8px] text-green-500 font-mono truncate">Video source linked: {formData.video_url}</p>}
          </div>
        </div>
      </div>

      <button className="w-full bg-white text-black py-5 font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">
        Save Product Assets
      </button>
    </form>
  );
}

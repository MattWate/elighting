"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (data) setCategories(data);
  }

  async function updateCategoryImage(categoryId: string, url: string) {
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .update({ image_url: url })
      .eq('id', categoryId);

    if (error) {
      alert(error.message);
    } else {
      fetchCategories();
    }
    setLoading(false);
  }

  return (
    <main className="p-12 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Categories</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Visual Asset Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="p-6 border border-zinc-900 bg-[#0c0c0c] flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold uppercase text-white">{cat.name}</h3>
              {cat.image_url ? (
                <div className="w-20 h-20 border border-zinc-800">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center">
                  <span className="text-[8px] text-zinc-600 uppercase font-mono">No Image</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] uppercase mb-2 font-mono">Upload Category Image</label>
              <ImageUploader 
                bucket="category-images" 
                onUploadComplete={(url) => updateCategoryImage(cat.id, url)} 
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

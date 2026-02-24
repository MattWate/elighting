"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*, categories(name)');
    if (data) setProducts(data);
  }

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Inventory</h1>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white text-black px-6 py-2 font-bold text-xs uppercase"
        >
          {isAdding ? 'Cancel' : 'Add New Unit'}
        </button>
      </header>

      {isAdding ? (
        <div className="p-10 border border-zinc-800 bg-zinc-900/30">
          <h2 className="text-sm font-mono text-zinc-500 mb-4 uppercase">Upload Product PDF/Image</h2>
          <ImageUploader bucket="product-assets" onUploadComplete={(url) => console.log(url)} />
          <p className="mt-4 text-xs text-zinc-600">Product form logic coming in next step.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 border border-zinc-800 flex justify-between items-center">
              <span className="font-bold">{p.name}</span>
              <span className="text-zinc-500 text-xs font-mono">${p.price}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

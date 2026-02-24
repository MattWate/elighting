// src/app/(admin)/dashboard/manage-products/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AddProductForm from '@/components/admin/AddProductForm';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  return (
    <main className="p-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-16 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tighter">Inventory</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Active Catalogue Control</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-8 py-3 font-bold text-[10px] uppercase tracking-widest transition-all ${
            isAdding ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {isAdding ? 'Cancel Entry' : 'Add New Unit'}
        </button>
      </header>

      {isAdding ? (
        <AddProductForm onComplete={() => {
          setIsAdding(false);
          fetchProducts();
        }} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((p) => (
            <div key={p.id} className="group p-6 border border-zinc-900 bg-[#0c0c0c] hover:border-zinc-700 transition-all flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight">{p.name}</h3>
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mt-1">
                  {p.categories?.name} — ${p.price}
                </p>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-zinc-500 hover:text-white text-[10px] uppercase font-bold tracking-widest">Edit</button>
                <button className="text-red-900 hover:text-red-500 text-[10px] uppercase font-bold tracking-widest">Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="py-20 text-center border border-dashed border-zinc-900">
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No active units in database</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

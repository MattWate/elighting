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
          <p className="text-zinc-500 text-xs font-mono uppercase mt-1">Global Product Database</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white text-black px-6 py-2 font-bold text-xs uppercase hover:bg-zinc-200"
        >
          {isAdding ? 'Cancel' : 'Add New Unit'}
        </button>
      </header>

      {isAdding ? (
        <section className="bg-[#111] border border-zinc-800 p-8 mb-10">
          <h2 className="text-lg font-bold mb-6 uppercase">Product Specification Entry</h2>
          {/* We will build the Form Component next */}
          <p className="text-zinc-500 italic">Form loader initializing...</p>
        </section>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest">
                <th className="py-4 px-2">Unit Name</th>
                <th className="py-4 px-2">Category</th>
                <th className="py-4 px-2">Price</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/50 group">
                  <td className="py-4 px-2 font-bold">{p.name}</td>
                  <td className="py-4 px-2 text-zinc-400">{p.categories?.name}</td>
                  <td className="py-4 px-2 font-mono text-zinc-500">${p.price}</td>
                  <td className="py-4 px-2 text-right">
                    <button className="text-zinc-600 hover:text-white mr-4 transition-colors">Edit</button>
                    <button className="text-red-900 hover:text-red-500 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export default function ApplicationProductManager({ appId }: { appId: string }) {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    fetchData();
  }, [appId]);

  async function fetchData() {
    // Get all products for the dropdown
    const { data: products } = await supabase.from('products').select('id, name');
    if (products) setAllProducts(products);

    // Get currently linked products
    const { data: linked } = await supabase
      .from('application_products')
      .select('product_id, products(name)')
      .eq('application_id', appId);
    if (linked) setRelatedProducts(linked);
  }

  async function linkProduct() {
    if (!selectedProductId) return;
    await supabase.from('application_products').insert([{ 
      application_id: appId, 
      product_id: selectedProductId 
    }]);
    fetchData();
  }

  async function unlinkProduct(productId: string) {
    await supabase.from('application_products')
      .delete()
      .eq('application_id', appId)
      .eq('product_id', productId);
    fetchData();
  }

  return (
    <div className="mt-8 pt-8 border-t border-zinc-800">
      <h3 className="text-white font-bold uppercase text-xs mb-4">Linked Products</h3>
      <div className="flex gap-4 mb-6">
        <select 
          className="flex-1 bg-black border border-zinc-800 p-3 text-white text-sm"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Select a product to link...</option>
          {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={linkProduct} className="bg-white text-black px-6 font-bold uppercase text-xs">Link</button>
      </div>

      <div className="space-y-2">
        {relatedProducts.map((rp: any) => (
          <div key={rp.product_id} className="flex justify-between bg-zinc-900/50 p-3 border border-zinc-800">
            <span className="text-sm text-zinc-300">{rp.products.name}</span>
            <button onClick={() => unlinkProduct(rp.product_id)} className="text-red-500 hover:text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

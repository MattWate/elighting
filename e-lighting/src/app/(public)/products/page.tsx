// src/app/(public)/products/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CataloguePage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 border-l-4 border-zinc-500 pl-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">Product Catalogue</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">Browse industrial solutions.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/category/${category.slug}`}
            className="group relative block h-64 overflow-hidden border border-zinc-800 bg-[#111]"
          >
            {/* Background Image */}
            {category.image_url && (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url('${category.image_url}')` }}
              />
            )}
            
            <div className="relative h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">{category.name}</h2>
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase">View</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

// src/app/(public)/products/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CataloguePage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    // Changed main background to light grey (zinc-100)
    <main className="min-h-screen bg-zinc-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-l-4 border-zinc-900 pl-6">
          {/* Inverted text to dark (zinc-900) for light background */}
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-zinc-900">
            Product Catalogue
          </h1>
          <p className="text-zinc-600 mt-2 font-mono text-sm">
            Browse our industrial lighting solutions by category.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((category) => (
            <Link 
              key={category.id} 
              href={`/products/category/${category.slug}`}
              className="group relative block h-80 overflow-hidden border border-zinc-300 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Background Image from category-images bucket */}
              {category.image_url && (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  style={{ backgroundImage: `url('${category.image_url}')` }}
                />
              )}
              
              {/* Overlay with light-to-dark gradient for text readability */}
              <div className="relative h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                      {category.name}
                    </h2>
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase border border-white px-2 py-1">
                      View
                    </span>
                  </div>
                  
                  {/* Category Description */}
                  <p className="text-zinc-200 text-xs font-mono uppercase tracking-wider line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {category.description || `High-performance ${category.name} solutions.`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

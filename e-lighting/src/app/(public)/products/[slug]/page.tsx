// e-lighting/src/app/(public)/products/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CataloguePage() {
  // Fetch all categories from the database
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 border-l-4 border-zinc-500 pl-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">
          Product Catalogue
        </h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">
          Browse our industrial lighting solutions by category.
        </p>
      </header>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/category/${category.slug}`}
            className="group relative block bg-[#111] border border-zinc-800 p-8 hover:border-zinc-500 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                {category.name}
              </h2>
              <span className="text-zinc-700 font-mono text-xs uppercase tracking-widest">
                View
              </span>
            </div>
            
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              {category.description || `Professional ${category.name} solutions.`}
            </p>

            <div className="w-12 h-[1px] bg-zinc-800 group-hover:w-full transition-all duration-500" />
          </Link>
        ))}
      </div>
    </main>
  );
}

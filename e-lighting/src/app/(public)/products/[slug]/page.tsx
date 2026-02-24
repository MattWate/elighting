import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CataloguePage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 uppercase">Product Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/category/${category.slug}`}
            className="border border-zinc-800 p-10 hover:border-white transition-colors bg-[#111]"
          >
            <h2 className="text-xl font-bold">{category.name}</h2>
            <p className="text-zinc-500 mt-2 text-sm">{category.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

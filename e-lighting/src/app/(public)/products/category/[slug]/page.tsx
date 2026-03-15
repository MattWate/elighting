// src/app/(public)/products/category/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', params.slug)
    .single();/page.tsx]

  if (!category) return <div className="p-20 text-center bg-zinc-100 text-zinc-900">Category not found.</div>;

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);/page.tsx]

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-l-4 border-zinc-900 pl-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-zinc-900">
            {category.name}
          </h1>
          <p className="text-zinc-600 mt-2 font-mono text-sm max-w-2xl">{category.description}</p>
        </header>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 italic font-mono text-sm">No products found in this category yet.</p>
        )}
      </div>
    </main>
  );
}

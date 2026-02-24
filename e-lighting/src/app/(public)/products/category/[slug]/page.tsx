// src/app/(public)/products/category/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // 1. Get the category details based on the slug from the URL
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) return <div className="p-20 text-center">Category not found.</div>;

  // 2. Fetch all products belonging to this category ID
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 border-l-4 border-white pl-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">
          {category.name}
        </h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">{category.description}</p>
      </header>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-600 italic">No products found in this category yet.</p>
      )}
    </main>
  );
}

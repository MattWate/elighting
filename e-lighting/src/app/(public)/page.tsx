import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

export default async function HomePage() {
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="text-center mb-16 py-20">
        <h1 className="text-6xl font-bold mb-4 uppercase tracking-tighter">Illuminating Your Space.</h1>
        <p className="text-zinc-500 text-xl font-mono">Premium Industrial Solutions.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest border-b border-zinc-800 pb-4">Featured Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

// src/app/(public)/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

export default async function HomePage() {
  // Fetch products where is_featured is true
  const { data: featuredProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  if (error) console.error('Error fetching products:', error);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Illuminating Your Space.</h1>
        <p className="text-gray-600 text-xl">Discover the eLighting collection.</p>
      </section>

      {/* Featured Products Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">Featured Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts?.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover mb-4" />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-orange-600">${product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

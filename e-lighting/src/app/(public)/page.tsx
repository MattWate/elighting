// src/app/(public)/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

export default async function HomePage() {
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  return (
    <main className="bg-[#0a0a0a]">
      {/* Dynamic Industrial Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden border-b border-zinc-800">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.5] brightness-[0.4]"
          style={{ backgroundImage: "url('/hero-industrial.jpg')" }}
        />
        
        {/* Content Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <div className="border-l-2 border-white pl-8 py-4">
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-none">
              Engineered <br /> 
              <span className="text-zinc-500">Luminance</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-xl font-mono uppercase tracking-widest">
              High-performance industrial lighting for the South African landscape.
            </p>
            <div className="mt-10 flex gap-4">
              <Link 
                href="/products" 
                className="bg-white text-black px-8 py-3 font-bold uppercase text-sm hover:bg-zinc-200 transition-all"
              >
                View Catalogue
              </Link>
              <Link 
                href="/contact" 
                className="border border-zinc-700 text-white px-8 py-3 font-bold uppercase text-sm hover:bg-white hover:text-black transition-all"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {/* Featured Collection Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Featured Systems</h2>
          <Link href="/products" className="text-xs text-zinc-500 uppercase hover:text-white font-mono">
            View All Series →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

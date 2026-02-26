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
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden border-b border-zinc-800">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.4] brightness-[0.3]"
          style={{ backgroundImage: "url('/hero-industrial.jpg')" }}
        />
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <div className="border-l-2 border-white pl-8 py-4 max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-none mb-6">
              Redefining <br /> 
              <span className="text-zinc-500">Illumination</span>
            </h1>
            <p className="text-lg text-zinc-400 font-mono uppercase tracking-widest leading-relaxed">
              Guided by innovation, sustainability, and unwavering quality.
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/products" className="bg-white text-black px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">
                Explore Catalogue
              </Link>
              <Link href="/contact" className="border border-zinc-700 text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 border-b border-zinc-900 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] mb-4">Our Journey</h2>
            <h3 className="text-3xl font-bold uppercase tracking-tighter text-white mb-6">Founded with a vision to illuminate lives.</h3>
            <p className="text-zinc-400 leading-relaxed font-light">
              Founded in 2011, eLighting brought together engineers to address the need for eco-friendly alternatives. 
              We are dedicated to transforming how Southern Africa lights its surroundings through cutting-edge technology.
            </p>
          </div>
          <div className="space-y-8">
            <div className="p-8 border border-zinc-800 bg-black/50">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-3">Our Mission</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Enhancing lives through cutting-edge locally manufactured LED lighting solutions.
              </p>
            </div>
            <div className="p-8 border border-zinc-800 bg-black/50">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-3">Excellence in Production</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Every stage, from design to production, is permeated with accuracy and toughness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-6">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Featured Units</h2>
          <Link href="/products" className="text-[10px] text-zinc-500 uppercase hover:text-white font-mono tracking-widest">
            Full Inventory →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Standards Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-black text-xl font-black uppercase tracking-tighter max-w-md">
            Our products undergo stringent quality control to surpass industry standards.
          </h2>
          <div className="flex gap-12 grayscale opacity-60 font-mono text-black font-bold uppercase text-xs tracking-[0.2em]">
            <span>Reliable</span>
            <span>Effective</span>
            <span>Long-lasting</span>
          </div>
        </div>
      </section>
    </main>
  );
}

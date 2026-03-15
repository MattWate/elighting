// src/app/(public)/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0; 

export default async function HomePage() {
  const { data: content } = await supabase.from('site_settings').select('key, value');
  const find = (key: string) => content?.find(s => s.key === key)?.value || "";

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  const { data: featuredApps } = await supabase
    .from('applications')
    .select('*')
    .eq('is_featured', true)
    .limit(5);

  return (
    <main className="bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:h-[90vh] w-full flex items-center overflow-hidden border-b border-zinc-800">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.4] brightness-[0.3]"
          style={{ backgroundImage: "url('/hero-industrial.jpg')" }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-20">
          <div className="border-l-2 border-white pl-4 md:pl-8 py-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-none mb-6 whitespace-pre-line">
              {find('hero_title')}
            </h1>
            <p className="text-sm sm:text-lg text-zinc-400 font-mono uppercase tracking-widest leading-relaxed max-w-xl">
              {find('hero_subtitle')}
            </p>
            <div className="mt-10">
              <Link href="/products" className="inline-block bg-white text-black px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">
                Explore Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Applications Slider */}
      <section className="py-24 border-b border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 text-white">Lighting In Practice</h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white">Applications</h3>
          </div>
          <Link href="/applications" className="text-zinc-500 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-widest flex items-center gap-2">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 px-6 no-scrollbar snap-x">
          {featuredApps?.map((app) => (
            <div key={app.id} className="min-w-[300px] md:min-w-[450px] h-[300px] bg-zinc-900 relative group snap-center overflow-hidden border border-zinc-800">
              {app.image_url && (
                <img 
                  src={app.image_url} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                />
              )}
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
                <h4 className="text-xl font-bold uppercase text-white mb-2">{app.title}</h4>
                <p className="text-zinc-400 text-xs font-mono line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-zinc-900 pb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">Featured Units</h2>
          <Link href="/products" className="text-[10px] text-zinc-500 uppercase hover:text-white font-mono tracking-widest transition-colors">
            Full Inventory →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {(!featuredProducts || featuredProducts.length === 0) && (
             <p className="text-zinc-600 font-mono text-xs uppercase">No featured units selected in database.</p>
          )}
        </div>
      </section>

      {/* Standards Bar */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <h2 className="text-black text-lg md:text-xl font-black uppercase tracking-tighter max-w-md">
            Our products undergo stringent quality control to surpass industry standards.
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 grayscale opacity-60 font-mono text-black font-bold uppercase text-[10px] md:text-xs tracking-[0.2em]">
            <span>Reliable</span>
            <span>Effective</span>
            <span>Long-lasting</span>
          </div>
        </div>
      </section>
    </main>
  );
}

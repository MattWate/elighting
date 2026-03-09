import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

export const revalidate = 0; 

export default async function HomePage() {
  // Fetch site content settings
  const { data: content } = await supabase.from('site_settings').select('key, value');
  const find = (key: string) => content?.find(s => s.key === key)?.value || "";

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  return (
    <main className="bg-[#0a0a0a]">
      <section className="relative min-h-[80vh] md:h-[90vh] w-full flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.4] brightness-[0.3]"
          style={{ backgroundImage: "url('/hero-industrial.jpg')" }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-20">
          <div className="border-l-2 border-white pl-4 md:pl-8 py-4 max-w-3xl">
            {/* Dynamic Hero Title */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-none mb-6 whitespace-pre-line">
              {find('hero_title')}
            </h1>
            <p className="text-sm sm:text-lg text-zinc-400 font-mono uppercase tracking-widest leading-relaxed max-w-xl">
              {find('hero_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="bg-white text-black px-8 py-4 font-bold uppercase text-xs tracking-widest text-center">Explore Catalogue</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#0c0c0c] border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Our Journey</h2>
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-white mb-6">
              {find('journey_text')}
            </h3>
          </div>
          <div className="p-6 md:p-8 border border-zinc-800 bg-black/50">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-3">Our Mission</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">{find('mission_statement')}</p>
          </div>
        </div>
      </section>
      {/* ... rest of the featured products section remains the same ... */}
    </main>
  );
}

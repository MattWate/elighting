// src/app/(public)/products/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', params.slug)
    .single();/page.tsx]

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-zinc-100 px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs - Updated for light theme */}
        <nav className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-8 md:mb-12">
          <Link href="/products" className="hover:text-zinc-900 transition-colors">Catalogue</Link>
          <ChevronRight size={10} />
          <Link href={`/products/category/${product.categories?.slug}`} className="hover:text-zinc-900 transition-colors">
            {product.categories?.name}
          </Link>
          <ChevronRight size={10} />
          <span className="text-zinc-900 font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image - Added white border and shadow */}
          <div className="w-full aspect-square bg-white border border-zinc-300 shadow-sm relative overflow-hidden">
            <img 
              src={product.images?.[0] || '/hero-industrial.jpg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details - Updated typography to dark zinc */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-zinc-900">{product.name}</h1>
            <p className="text-zinc-600 font-mono text-xs md:text-sm mb-8 leading-relaxed max-w-lg">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10">
              <div className="p-4 border border-zinc-200 bg-white shadow-sm">
                <span className="block text-[9px] text-zinc-500 uppercase mb-1 font-bold">Standard Price</span>
                <span className="text-lg md:text-xl font-bold text-zinc-900">${product.price}</span>
              </div>
              <div className="p-4 border border-zinc-200 bg-white shadow-sm">
                <span className="block text-[9px] text-zinc-500 uppercase mb-1 font-bold">Stock Status</span>
                <span className="text-lg md:text-xl font-bold text-green-600">Available</span>
              </div>
            </div>

            {/* Technical Specifications - Dark borders on light background */}
            <div className="border-t border-zinc-300 pt-8 mb-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Technical Specifications</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-zinc-200 pb-2">
                    <dt className="text-[9px] uppercase text-zinc-500 font-mono font-bold">{key.replace('_', ' ')}</dt>
                    <dd className="text-xs font-bold text-zinc-900">{value as string}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-auto space-y-3">
              {product.data_sheet_url && (
                <a 
                  href={product.data_sheet_url} 
                  target="_blank" 
                  className="flex items-center justify-center gap-3 w-full bg-zinc-800 text-white py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-900 transition-all shadow-sm"
                >
                  <FileText size={14} />
                  Download Data Sheet (PDF)
                </a>
              )}
              <Link 
                href="/contact" 
                className="flex items-center justify-center w-full bg-zinc-900 text-white py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-sm"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

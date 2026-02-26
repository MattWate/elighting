// e-lighting/src/app/(public)/products/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ChevronRight, Zap, Shield, Clock } from 'lucide-react';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', params.slug)
    .single();

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-[#0a0a0a]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-12">
        <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
        <ChevronRight size={10} />
        <Link href={`/products/category/${product.categories?.slug}`} className="hover:text-white transition-colors">
          {product.categories?.name}
        </Link>
        <ChevronRight size={10} />
        <span className="text-zinc-400">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="aspect-square bg-[#111] border border-zinc-800 relative overflow-hidden group">
            <img 
              src={product.images?.[0] || '/hero-industrial.jpg'} 
              alt={product.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold uppercase tracking-tighter mb-4">{product.name}</h1>
          <p className="text-zinc-500 font-mono text-sm mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 border border-zinc-900 bg-[#0c0c0c]">
              <span className="block text-[10px] text-zinc-600 uppercase mb-1">Standard Price</span>
              <span className="text-xl font-bold">${product.price}</span>
            </div>
            <div className="p-4 border border-zinc-900 bg-[#0c0c0c]">
              <span className="block text-[10px] text-zinc-600 uppercase mb-1">Stock Status</span>
              <span className="text-xl font-bold text-green-500">Available</span>
            </div>
          </div>

          {/* Technical Specifications from JSONB */}
          <div className="border-t border-zinc-800 pt-8 mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">Technical Specifications</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-zinc-900 pb-2">
                  <dt className="text-[10px] uppercase text-zinc-600 font-mono">{key.replace('_', ' ')}</dt>
                  <dd className="text-xs font-bold text-zinc-300">{value as string}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-4">
            {product.data_sheet_url && (
              <a 
                href={product.data_sheet_url} 
                target="_blank" 
                className="flex items-center justify-center gap-3 w-full bg-zinc-800 text-white py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-700 transition-all"
              >
                <FileText size={16} />
                Download Data Sheet (PDF)
              </a>
            )}
            <Link 
              href="/contact" 
              className="flex items-center justify-center w-full bg-white text-black py-4 font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

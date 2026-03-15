// src/app/(public)/applications/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  // 1. Fetch Application Details
  const { data: application } = await supabase
    .from('applications')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!application) notFound();

  // 2. Fetch Related Products via Join Table
  const { data: relatedData } = await supabase
    .from('application_products')
    .select('products(*)')
    .eq('application_id', params.id);

  const products = relatedData?.map(item => item.products) || [];

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Hero Section - Uses Application-specific Image */}
      <section className="relative h-[60vh] bg-black flex items-center overflow-hidden">
        {application.image_url && (
          <img 
            src={application.image_url} 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[0.2]" 
            alt={application.title}
          />
        )}
        <div className="relative w-full max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-8">
            <Link href="/applications" className="hover:text-white transition-colors">Applications</Link>
            <ChevronRight size={10} />
            <span className="text-white font-bold">{application.title}</span>
          </nav>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white max-w-4xl leading-none">
            {application.title}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          {/* Detailed Description */}
          <div className="lg:col-span-1">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6 border-b border-zinc-200 pb-2">
              Application Scope
            </h2>
            <div className="prose prose-zinc">
              <p className="text-zinc-900 text-lg leading-relaxed font-light whitespace-pre-line">
                {application.description}
              </p>
            </div>
            <div className="mt-12 p-6 bg-white border border-zinc-200 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-4">Need a Custom Quote?</h3>
              <Link href="/contact" className="text-xs font-mono uppercase text-zinc-500 hover:text-black border-b border-zinc-900 pb-1 transition-all">
                Contact Technical Sales →
              </Link>
            </div>
          </div>

          {/* Related Lighting Solutions Grid */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                Recommended Units
              </h2>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {products.length} Units Found
              </span>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-zinc-200">
                <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
                  No specific units linked to this use case.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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

  // Flatten the join results into a simple products array
  const products = relatedData?.map(item => item.products) || [];

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Hero Section - Uses Application-specific Image */}
      <section className="relative h-[50vh] bg-black flex items-center overflow-hidden">
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
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white max-w-4xl leading-tight">
            {application.title}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          
          {/* Sidebar: Context & CTA */}
          <div className="lg:col-span-1">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6 border-b border-zinc-200 pb-2">
              The Challenge
            </h2>
            <p className="text-zinc-900 text-lg leading-relaxed font-light whitespace-pre-line mb-10">
              {application.description}
            </p>
            
            <div className="p-8 bg-white border border-zinc-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4">Project Support</h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Need technical assistance selecting the correct units for your {application.title.toLowerCase()} project?
              </p>
              <Link href="/contact" className="inline-block w-full bg-zinc-900 text-white text-center py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
                Request Expert Consultation
              </Link>
            </div>
          </div>

          {/* Product Grid: Linked Solutions */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                Engineered Solutions
              </h2>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {products.length} Units Matching Criteria
              </span>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-zinc-200 bg-white/50">
                <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
                  Our technical team is currently curating units for this application.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

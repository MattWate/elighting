// src/app/(public)/applications/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { notFound } from 'next/navigation';

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
      {/* Hero Section for the Application */}
      <div className="relative h-[50vh] bg-black">
        {application.image_url && (
          <img 
            src={application.image_url} 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            alt={application.title}
          />
        )}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white">
            {application.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Description Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Overview</h2>
            <p className="text-zinc-900 text-lg leading-relaxed font-light whitespace-pre-line">
              {application.description}
            </p>
          </div>

          {/* Related Products Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-8">
              Recommended Lighting Solutions
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 font-mono text-sm uppercase">No specific products linked to this application yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, PlayCircle, ChevronDown } from 'lucide-react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', params.slug)
        .single();
        
      if (data) {
        setProduct(data);
        setActiveMedia(data.images?.[0] || null);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (!product) return <div className="min-h-screen bg-zinc-100 p-20 text-center font-mono">Initializing unit data...</div>;

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Visual Assets Column */}
          <div className="space-y-6">
            <div className="aspect-square bg-white border border-zinc-300 shadow-sm overflow-hidden">
              <img 
                src={activeMedia || '/hero-industrial.jpg'} 
                className="w-full h-full object-cover transition-all duration-700" 
                alt={product.name} 
              />
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {product.images?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveMedia(img)}
                  className={`aspect-square border-2 transition-all ${
                    activeMedia === img ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name} gallery ${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-4">
                {product.categories?.name}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-zinc-900 mb-6">
                {product.name}
              </h1>
              <p className="text-zinc-600 font-light text-lg leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Video Section */}
            {product.video_url && (
              <div className="mb-12">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PlayCircle size={14} /> Product Demonstration
                </h3>
                <div className="aspect-video bg-black border border-zinc-300 shadow-lg">
                  {product.video_type === 'youtube' ? (
                    <iframe 
                      src={product.video_url.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={product.video_url} controls className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            )}

            {/* Specifications Section - Accordion Style */}
            <div className="border-t border-zinc-300 pt-12 mb-12">
              <h2 className="text-3xl font-bold uppercase tracking-tighter text-zinc-900 mb-8">
                Specifications
              </h2>
              <div className="space-y-0">
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <details key={key} className="group border-b border-zinc-300">
                    <summary className="flex justify-between items-center cursor-pointer py-5 hover:bg-zinc-200/50 transition-colors list-none">
                      <span className="text-xs md:text-sm font-bold text-zinc-900 uppercase tracking-widest">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-zinc-900 font-light text-2xl transition-transform group-open:rotate-45 leading-none">
                        +
                      </span>
                    </summary>
                    <div className="pb-6 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-sm font-mono text-zinc-600 tracking-tight">
                        {value ? (value as string) : "Request data sheet for full technical details."}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="flex-1 bg-zinc-900 text-white py-5 text-center font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-all"
              >
                Request Technical Quote
              </a>
              {product.data_sheet_url && (
                <a 
                  href={product.data_sheet_url}
                  target="_blank"
                  className="flex-1 border border-zinc-300 bg-white text-zinc-900 py-5 text-center font-bold uppercase text-xs tracking-[0.3em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-3"
                >
                  <FileText size={16} />
                  Data Sheet
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

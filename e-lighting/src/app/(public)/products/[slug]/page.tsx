"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, PlayCircle } from 'lucide-react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*, categories(name)').eq('slug', params.slug).single();
      if (data) {
        setProduct(data);
        setActiveMedia(data.images?.[0] || null);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (!product) return <div className="min-h-screen bg-zinc-100 p-20 text-center font-mono">Initializing unit data...</div>;

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Visual Assets Column */}
        <div className="space-y-6">
          <div className="aspect-square bg-white border border-zinc-300 shadow-sm overflow-hidden">
            <img src={activeMedia || '/hero-industrial.jpg'} className="w-full h-full object-cover transition-all duration-700" alt={product.name} />
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {product.images?.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveMedia(img)}
                className={`aspect-square border-2 transition-all ${activeMedia === img ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Column */}
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold uppercase tracking-tighter text-zinc-900 mb-6">{product.name}</h1>
          <p className="text-zinc-600 font-light text-lg leading-relaxed mb-10">{product.description}</p>

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

          <div className="mt-auto space-y-4">
            <a href="/contact" className="block w-full bg-zinc-900 text-white py-5 text-center font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-all">
              Request Technical Quote
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

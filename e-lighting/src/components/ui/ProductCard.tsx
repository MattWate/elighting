// src/components/ui/ProductCard.tsx
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group relative bg-[#111] border border-zinc-800 p-4 transition-all hover:border-zinc-500 block w-full"
    >
      <div className="overflow-hidden bg-zinc-900 aspect-square mb-4">
        <img 
          src={product.images?.[0] || '/hero-industrial.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
      </div>
      <h3 className="text-xs md:text-sm uppercase tracking-widest font-bold text-zinc-200 line-clamp-1">{product.name}</h3>
      <div className="flex justify-between items-center mt-3">
        <p className="text-zinc-500 text-xs md:text-sm font-mono">${product.price}</p>
        <span className="text-[9px] md:text-[10px] text-zinc-400 uppercase font-bold group-hover:text-white transition-colors">
          View Specs →
        </span>
      </div>
    </Link>
  );
}

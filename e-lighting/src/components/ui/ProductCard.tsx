import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link 
      href={`/products/${product.slug}`} // Points to our dynamic [slug] route 
      className="group relative bg-[#111] border border-zinc-800 p-4 rounded-sm transition-all hover:border-zinc-500 block"
    >
      <div className="overflow-hidden bg-zinc-900 aspect-square mb-4">
        <img 
          src={product.images?.[0] || '/hero-industrial.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
      </div>
      <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-200">{product.name}</h3>
      <div className="flex justify-between items-center mt-2">
        <p className="text-zinc-500 text-sm font-mono">${product.price}</p>
        <span className="text-[10px] text-zinc-400 uppercase font-bold group-hover:text-white transition-colors">
          View Specs →
        </span>
      </div>
    </Link>
  );
}

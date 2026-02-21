// e-lighting/src/components/shared/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white uppercase">
          e<span className="text-zinc-500">Lighting</span>
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <Link 
          href="/admin/dashboard" 
          className="text-xs border border-zinc-700 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all"
        >
          Admin Portal
        </Link>
      </div>
    </nav>
  );
}

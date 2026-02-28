// src/components/shared/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image 
            src="/logo.png"
            alt="eLighting Logo"
            width={120}
            height={32}
            className="h-6 md:h-8 w-auto object-contain"
            priority
          />
        </Link>
        
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <Link 
          href="/dashboard" 
          className="text-[9px] md:text-xs border border-zinc-700 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-all uppercase font-bold tracking-tighter"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}

// e-lighting/src/components/shared/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Link to Homepage */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image 
            src="/logo.png" // Ensure this matches your filename in the public folder
            alt="eLighting Logo"
            width={150}      // Adjust width to fit your logo's aspect ratio
            height={40}      // Adjust height accordingly
            className="h-8 w-auto object-contain" // Limits height to 2rem (32px)
            priority         // Ensures the logo loads immediately
          />
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <Link 
          href="/dashboard" 
          className="text-xs border border-zinc-700 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all"
        >
          Admin Portal
        </Link>
      </div>
    </nav>
  );
}


"use client"; 
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo - Increased width and height */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image 
            src="/logo.png"
            alt="eLighting Logo"
            width={180} // Increased from 120
            height={48} // Increased from 32
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>
        
        {/* Desktop Links - Changed from text-[10px] to text-sm */}
        <div className="hidden md:flex gap-10 text-sm font-bold uppercase tracking-widest text-zinc-300">
          <Link href="/products" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/applications">Applications</Link>
          <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-xs md:text-sm border border-zinc-700 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all uppercase font-bold tracking-tight"
          >
            Admin
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-8 gap-8 text-base font-bold uppercase tracking-[0.2em] text-zinc-400">
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-white border-b border-zinc-900 pb-4"
            >
              Catalogue
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-white border-b border-zinc-900 pb-4"
            >
              Our Story
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-white pb-2"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

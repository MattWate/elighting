import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6 grayscale brightness-200">
              <Image 
                src="/logo.png" 
                alt="eLighting" 
                width={140} 
                height={40} 
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-[10px] uppercase tracking-widest leading-relaxed font-mono">
              High-performance LED solutions for industrial and commercial applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Catalogue</h4>
            <ul className="space-y-4 text-xs uppercase tracking-wider font-mono">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/applications" className="hover:text-white transition-colors">Applications</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Contact</h4>
            <ul className="space-y-4 text-xs font-mono uppercase tracking-wider">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-zinc-600" />
                <a href="tel:0114523964" className="hover:text-white transition-colors">011 452 3964</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-zinc-600" />
                <a href="mailto:info@elighting.co.za" className="hover:text-white transition-colors">info@elighting.co.za</a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Headquarters</h4>
            <div className="flex items-start gap-3 text-xs font-mono uppercase tracking-wider leading-relaxed">
              <MapPin size={14} className="text-zinc-600 mt-1 shrink-0" />
              <span>
                51 Brunton Street, <br />
                Founders Hill, Edenvale <br />
                South Africa
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest font-mono">
            © {currentYear} eLighting (Pty) Ltd. All Rights Reserved.
          </div>
          
          <div className="flex gap-6 grayscale opacity-50 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:text-white"><Linkedin size={18} /></a>
            <a href="#" className="hover:text-white"><Instagram size={18} /></a>
            <a href="#" className="hover:text-white"><Facebook size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

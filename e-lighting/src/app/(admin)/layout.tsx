"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      if (!session && pathname !== '/login') {
        router.push('/login');
      }
    };
    checkUser();
  }, [router, pathname]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying Credentials...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex">
        {session && pathname !== '/login' && (
          <aside className="w-64 border-r border-zinc-800 min-h-screen p-6 hidden md:block">
            <div className="mb-10 px-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">Control Center</div>
            <nav className="space-y-2 text-sm">
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-zinc-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/manage-products" className="block px-4 py-2 hover:bg-zinc-900 transition-colors">
                Inventory
              </Link>
              {/* Added Categories Link */}
              <Link href="/dashboard/categories" className="block px-4 py-2 hover:bg-zinc-900 transition-colors">
                Categories
              </Link>
              <Link href="/dashboard/content" className="block px-4 py-2 hover:bg-zinc-900 transition-colors">
                Site Content
              </Link>
              <Link href="/dashboard/applications" className="block px-4 py-2 hover:bg-zinc-900 transition-colors">
                Applications
              </Link>
              <button 
                onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                className="w-full text-left px-4 py-2 text-red-900 hover:text-red-500 transition-colors mt-10 uppercase text-[10px] font-bold tracking-widest"
              >
                Logout
              </button>
            </nav>
          </aside>
        )}
        <section className="flex-1">{children}</section>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserPermissions, getRequiredPermissionForPath, hasPermission, Permission } from '@/lib/permissions';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import AccessDenied from '@/components/admin/AccessDenied';

const adminLinks: { href: string; label: string; permission: Permission | null }[] = [
  { href: '/dashboard', label: 'Dashboard', permission: null },
  { href: '/dashboard/manage-products', label: 'Inventory', permission: 'products.view' },
  { href: '/dashboard/categories', label: 'Categories', permission: 'categories.view' },
  { href: '/dashboard/content', label: 'Site Content', permission: 'content.view' },
  { href: '/dashboard/applications', label: 'Applications', permission: 'applications.view' },
  { href: '/dashboard/enquiries', label: 'Enquiries', permission: 'enquiries.view' },
  { href: '/dashboard/stock', label: 'Stock & Manager.io', permission: 'stock.view' },
  { href: '/dashboard/users', label: 'Users & Roles', permission: 'users.view' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session && pathname !== '/login') {
        setLoading(false);
        router.push('/login');
        return;
      }

      if (session && pathname !== '/login') {
        const userPermissions = await getCurrentUserPermissions();
        setPermissions(userPermissions);
      }

      setLoading(false);
    };

    checkUser();
  }, [router, pathname]);

  const visibleLinks = useMemo(() => {
    return adminLinks.filter((link) => !link.permission || hasPermission(permissions, link.permission));
  }, [permissions]);

  const requiredPermission = pathname === '/login' ? null : getRequiredPermissionForPath(pathname);
  const lacksRequiredPermission = Boolean(
    session && requiredPermission && !hasPermission(permissions, requiredPermission)
  );

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying Credentials...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex">
        {session && pathname !== '/login' && (
          <aside className="w-64 border-r border-zinc-800 min-h-screen p-6 hidden md:block sticky top-0">
            <div className="mb-10 px-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">Control Center</div>
            <nav className="space-y-2 text-sm">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 transition-colors ${
                      isActive ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button 
                onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                className="w-full text-left px-4 py-2 text-red-900 hover:text-red-500 transition-colors mt-10 uppercase text-[10px] font-bold tracking-widest"
              >
                Logout
              </button>
            </nav>
          </aside>
        )}
        <section className="flex-1">
          {lacksRequiredPermission ? (
            <AccessDenied message={`This area requires the ${requiredPermission} permission.`} />
          ) : (
            children
          )}
        </section>
      </div>
    </div>
  );
}

// e-lighting/src/app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex">
        {/* Simple Admin Sidebar */}
        <aside className="w-64 border-r border-zinc-800 min-h-screen p-6 hidden md:block">
          <div className="mb-10 px-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Control Center
          </div>
          <nav className="space-y-2">
            <a href="/admin/dashboard" className="block px-4 py-2 hover:bg-zinc-900 rounded transition-colors text-sm">Dashboard</a>
            <a href="/admin/dashboard/manage-products" className="block px-4 py-2 bg-zinc-900 border-l-2 border-white rounded transition-colors text-sm">Products</a>
            <a href="/admin/dashboard/categories" className="block px-4 py-2 hover:bg-zinc-900 rounded transition-colors text-sm">Categories</a>
          </nav>
        </aside>
        
        <section className="flex-1">
          {children}
        </section>
      </div>
    </div>
  );
}

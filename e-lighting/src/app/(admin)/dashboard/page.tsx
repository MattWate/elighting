"use client"; // This MUST be the very first line

export default function AdminDashboard() {
  return (
    <main className="p-10 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-4">Admin Dashboard</h1>
      <p className="text-zinc-500 font-mono text-sm mb-10">System Status: Active</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/dashboard/manage-products" className="p-8 border border-zinc-800 bg-[#111] hover:border-white transition-all">
          <h2 className="text-xl font-bold mb-2">Manage Products</h2>
          <p className="text-zinc-500 text-sm">Update inventory, specs, and PDFs.</p>
        </a>
        {/* Placeholder for future Category management */}
        <div className="p-8 border border-zinc-900 bg-[#0c0c0c] opacity-50 cursor-not-allowed">
          <h2 className="text-xl font-bold mb-2 text-zinc-700">Manage Categories</h2>
          <p className="text-zinc-800 text-sm">Coming Soon.</p>
        </div>
      </div>
    </main>
  );
}

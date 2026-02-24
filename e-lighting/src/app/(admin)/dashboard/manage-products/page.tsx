// e-lighting/src/app/(admin)/dashboard/manage-products/page.tsx
import Link from 'next/link';

export default function ManageProductsPage() {
  return (
    <main className="p-10">
      <div className="mb-8">
        <Link 
          href="/admin/dashboard" 
          className="text-zinc-500 hover:text-white transition-colors text-sm font-mono"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-4">
        Manage Products
      </h1>
      <p className="text-zinc-400">
        Inventory management system coming soon.
      </p>
    </main>
  );
}

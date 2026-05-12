import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied({ message = 'You do not have permission to access this admin area.' }: { message?: string }) {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full border border-zinc-900 bg-[#0c0c0c] p-8 text-center">
        <div className="mx-auto mb-6 w-14 h-14 border border-zinc-800 flex items-center justify-center text-red-500">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-tighter mb-4">Access Denied</h1>
        <p className="text-zinc-500 text-sm font-mono leading-relaxed mb-8">{message}</p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

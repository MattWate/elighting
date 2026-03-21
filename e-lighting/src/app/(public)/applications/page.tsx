import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function ApplicationsPage() {
  const { data: apps } = await supabase
    .from('applications')
    .select('*')
    .order('created_at');

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-16 border-l-4 border-white pl-8">
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white">
          Applications
        </h1>
        <p className="text-zinc-500 font-mono text-sm mt-4 uppercase tracking-[0.2em]">
          Versatile Lighting Solutions
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
        {apps?.map((app) => (
          /* The Link component below enables clickability to the detail page */
          <Link 
            key={app.id} 
            href={`/applications/${app.id}`} 
            className="relative h-[400px] bg-black group overflow-hidden block"
          >
            {app.image_url && (
              <img 
                src={app.image_url} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105" 
                alt={app.title}
              />
            )}
            <div className="relative h-full p-12 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
              <h2 className="text-3xl font-bold uppercase tracking-tighter text-white mb-4">
                {app.title}
              </h2>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed max-w-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                {app.description}
              </p>
              <span className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white border-b border-white w-fit opacity-0 group-hover:opacity-100 transition-opacity">
                View Solutions →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

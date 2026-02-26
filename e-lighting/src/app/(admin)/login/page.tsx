"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md p-8 border border-zinc-800 bg-[#111]">
        <h1 className="text-2xl font-bold uppercase tracking-tighter mb-8 text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase mb-2 font-mono">Username / Email</label>
            <input 
              type="email" 
              required 
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase mb-2 font-mono">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </main>
  );
}

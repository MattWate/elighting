"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserPermissions, hasPermission, Permission } from '@/lib/permissions';
import { Mail, Clock, User, MessageSquare, Trash2, CheckCircle } from 'lucide-react';

export default function EnquiryInbox() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const canUpdate = hasPermission(permissions, 'enquiries.update');

  useEffect(() => {
    initialise();
  }, []);

  async function initialise() {
    const userPermissions = await getCurrentUserPermissions();
    setPermissions(userPermissions);
    await fetchEnquiries();
  }

  async function fetchEnquiries() {
    setLoading(true);
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setEnquiries(data);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    if (!canUpdate) {
      alert('You do not have permission to update enquiries.');
      return;
    }

    await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', id);
    fetchEnquiries();
  }

  async function deleteEnquiry(id: string) {
    if (!canUpdate) {
      alert('You do not have permission to delete enquiries.');
      return;
    }

    if (!confirm("Permanently delete this enquiry?")) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    fetchEnquiries();
  }

  return (
    <main className="p-12 max-w-5xl mx-auto">
      <header className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Enquiry Inbox</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">
          Customer Leads & Project Requests
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-zinc-500">
          Syncing Transmissions...
        </div>
      ) : (
        <div className="space-y-6">
          {enquiries.map((item) => (
            <div 
              key={item.id} 
              className={`border p-8 transition-all ${
                item.status === 'unread' ? 'bg-[#0f0f0f] border-white' : 'bg-black border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-white mb-2">
                    <User size={14} className="text-zinc-500" />
                    <span className="font-bold uppercase tracking-tight">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 font-mono text-[10px] uppercase">
                    <Mail size={12} />
                    <a href={`mailto:${item.email}`} className="hover:text-white underline">{item.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600 font-mono text-[10px] uppercase">
                    <Clock size={12} />
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>

                {canUpdate && (
                  <div className="flex gap-4">
                    {item.status === 'unread' && (
                      <button 
                        onClick={() => updateStatus(item.id, 'read')}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2"
                      >
                        <CheckCircle size={14} /> Mark Read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteEnquiry(item.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-900 hover:text-red-500 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-black/50 border border-zinc-900 p-6">
                <div className="flex items-start gap-3 mb-2 text-zinc-500">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Message Body:</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            </div>
          ))}

          {enquiries.length === 0 && (
            <div className="py-20 text-center border border-dashed border-zinc-900">
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">Inbox Empty</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AddProductForm from '@/components/admin/AddProductForm';
import { getCurrentUserPermissions, hasPermission, Permission } from '@/lib/permissions';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const canCreate = hasPermission(permissions, 'products.create');
  const canUpdate = hasPermission(permissions, 'products.update');
  const canDelete = hasPermission(permissions, 'products.delete');

  useEffect(() => {
    initialise();
  }, []);

  async function initialise() {
    const userPermissions = await getCurrentUserPermissions();
    setPermissions(userPermissions);
    fetchProducts();
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  async function handleDelete(id: string, name: string) {
    if (!canDelete) {
      alert('You do not have permission to delete products.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`);
    
    if (confirmed) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        alert(`Error deleting product: ${error.message}`);
      } else {
        fetchProducts();
      }
    }
  }

  function startEdit(product: any) {
    if (!canUpdate) {
      alert('You do not have permission to edit products.');
      return;
    }
    setEditingProduct(product);
  }

  function startAdd() {
    if (!canCreate) {
      alert('You do not have permission to create products.');
      return;
    }
    setIsAdding(!isAdding);
    setEditingProduct(null);
  }

  return (
    <main className="p-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-16 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Inventory</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Active Catalogue Control</p>
        </div>
        {(canCreate || isAdding || editingProduct) && (
          <button 
            onClick={startAdd}
            className={`px-8 py-3 font-bold text-[10px] uppercase tracking-widest transition-all ${
              isAdding || editingProduct ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isAdding || editingProduct ? 'Cancel Action' : 'Add New Unit'}
          </button>
        )}
      </header>

      {isAdding || editingProduct ? (
        <AddProductForm 
          productToEdit={editingProduct}
          canSubmit={editingProduct ? canUpdate : canCreate}
          onComplete={() => {
            setIsAdding(false);
            setEditingProduct(null);
            fetchProducts();
          }} 
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((p) => (
            <div key={p.id} className="group p-6 border border-zinc-900 bg-[#0c0c0c] hover:border-zinc-700 transition-all flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white">{p.name}</h3>
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mt-1">
                  {p.categories?.name} — Specs Only Mode
                </p>
              </div>
              {(canUpdate || canDelete) && (
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {canUpdate && (
                    <button 
                      onClick={() => startEdit(p)}
                      className="text-zinc-500 hover:text-white text-[10px] uppercase font-bold tracking-widest"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-red-900 hover:text-red-500 text-[10px] uppercase font-bold tracking-widest"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {products.length === 0 && (
            <div className="py-20 text-center border border-dashed border-zinc-900">
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No active units in database</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

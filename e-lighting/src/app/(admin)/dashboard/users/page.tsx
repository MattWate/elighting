"use client";
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserPermissions, hasPermission, Permission } from '@/lib/permissions';
import AccessDenied from '@/components/admin/AccessDenied';
import { ShieldCheck, UserCog } from 'lucide-react';

type Role = {
  id: string;
  name: string;
  description: string | null;
};

type AdminProfile = {
  id: string;
  full_name: string | null;
  email: string;
  is_active: boolean;
  admin_user_roles?: { role_id: string }[];
};

export default function AdminUsersPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const canView = hasPermission(permissions, 'users.view');
  const canUpdate = hasPermission(permissions, 'users.update');
  const canDisable = hasPermission(permissions, 'users.disable');

  useEffect(() => {
    async function initialise() {
      const userPermissions = await getCurrentUserPermissions();
      setPermissions(userPermissions);
      await fetchData();
      setLoading(false);
    }

    initialise();
  }, []);

  async function fetchData() {
    const [usersResponse, rolesResponse] = await Promise.all([
      supabase
        .from('admin_profiles')
        .select('id, full_name, email, is_active, admin_user_roles(role_id)')
        .order('email', { ascending: true }),
      supabase
        .from('roles')
        .select('id, name, description')
        .order('name', { ascending: true }),
    ]);

    if (usersResponse.error) {
      console.error(usersResponse.error);
      alert(`Could not load admin users: ${usersResponse.error.message}`);
    } else {
      setUsers((usersResponse.data || []) as AdminProfile[]);
    }

    if (rolesResponse.error) {
      console.error(rolesResponse.error);
      alert(`Could not load roles: ${rolesResponse.error.message}`);
    } else {
      setRoles((rolesResponse.data || []) as Role[]);
    }
  }

  const roleById = useMemo(() => {
    return roles.reduce<Record<string, Role>>((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {});
  }, [roles]);

  function userHasRole(user: AdminProfile, roleId: string) {
    return Boolean(user.admin_user_roles?.some((assignment) => assignment.role_id === roleId));
  }

  async function toggleRole(user: AdminProfile, role: Role) {
    if (!canUpdate) return;
    setSavingUserId(user.id);

    const alreadyAssigned = userHasRole(user, role.id);

    const response = alreadyAssigned
      ? await supabase
          .from('admin_user_roles')
          .delete()
          .eq('user_id', user.id)
          .eq('role_id', role.id)
      : await supabase
          .from('admin_user_roles')
          .insert([{ user_id: user.id, role_id: role.id }]);

    if (response.error) {
      alert(`Could not update role assignment: ${response.error.message}`);
    } else {
      await fetchData();
    }

    setSavingUserId(null);
  }

  async function toggleActive(user: AdminProfile) {
    if (!canDisable) return;

    const confirmed = window.confirm(
      user.is_active
        ? `Disable admin access for ${user.email}?`
        : `Re-enable admin access for ${user.email}?`
    );

    if (!confirmed) return;

    setSavingUserId(user.id);

    const { error } = await supabase
      .from('admin_profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);

    if (error) {
      alert(`Could not update user status: ${error.message}`);
    } else {
      await fetchData();
    }

    setSavingUserId(null);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading users...</div>;
  }

  if (!canView) {
    return <AccessDenied message="This page requires the users.view permission." />;
  }

  return (
    <main className="p-12 max-w-7xl mx-auto text-zinc-300">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tighter text-white">Users & Roles</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">
            Assign admin users to permission-controlled roles
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-mono text-zinc-500 border border-zinc-900 px-4 py-3 bg-black">
          <ShieldCheck size={14} />
          {canUpdate ? 'Role management enabled' : 'Read-only access'}
        </div>
      </header>

      <section className="mb-10 p-6 border border-zinc-900 bg-[#0c0c0c]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-3">Current limitation</h2>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-3xl">
          This screen assigns roles to users who already exist in Supabase Auth. Creating/inviting new users should be handled through a secure server-side route or Supabase admin function next, because the service role key must never be exposed in the browser.
        </p>
      </section>

      <div className="space-y-6">
        {users.map((user) => (
          <article key={user.id} className={`border bg-[#0c0c0c] p-6 ${user.is_active ? 'border-zinc-900' : 'border-red-950 opacity-70'}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <UserCog size={18} className="text-zinc-500" />
                  <h2 className="text-xl font-bold uppercase tracking-tight text-white truncate">
                    {user.full_name || user.email}
                  </h2>
                </div>
                <p className="text-zinc-500 font-mono text-xs">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.admin_user_roles && user.admin_user_roles.length > 0 ? (
                    user.admin_user_roles.map((assignment) => (
                      <span key={assignment.role_id} className="px-3 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-widest">
                        {roleById[assignment.role_id]?.name || 'Unknown Role'}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-700">No roles assigned</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${user.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                  {user.is_active ? 'Active' : 'Disabled'}
                </span>
                {canDisable && (
                  <button
                    disabled={savingUserId === user.id}
                    onClick={() => toggleActive(user)}
                    className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white disabled:opacity-30"
                  >
                    {user.is_active ? 'Disable access' : 'Enable access'}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900">
              <h3 className="text-[10px] uppercase tracking-widest font-mono text-zinc-500 mb-4">Role assignments</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => {
                  const assigned = userHasRole(user, role.id);
                  return (
                    <button
                      key={role.id}
                      disabled={!canUpdate || savingUserId === user.id}
                      onClick={() => toggleRole(user, role)}
                      title={role.description || role.name}
                      className={`px-3 py-2 text-[9px] font-mono uppercase border transition-all disabled:cursor-not-allowed ${
                        assigned
                          ? 'bg-white text-black border-white'
                          : 'border-zinc-800 text-zinc-600 hover:border-zinc-500 hover:text-zinc-300 disabled:hover:border-zinc-800 disabled:hover:text-zinc-600'
                      }`}
                    >
                      {role.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}

        {users.length === 0 && (
          <div className="py-20 text-center border border-dashed border-zinc-900">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">No admin users found</p>
          </div>
        )}
      </div>
    </main>
  );
}

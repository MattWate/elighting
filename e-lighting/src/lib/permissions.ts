import { supabase } from '@/lib/supabase';

export type Permission = string;

export interface PermissionRow {
  permission_key: string;
}

export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase.rpc('current_user_permissions');

  if (error) {
    console.error('Failed to load user permissions:', error.message);
    return [];
  }

  return ((data || []) as PermissionRow[]).map((row) => row.permission_key);
}

export function hasPermission(permissions: Permission[], permission: Permission) {
  return permissions.includes(permission);
}

export function hasAnyPermission(permissions: Permission[], requiredPermissions: Permission[]) {
  return requiredPermissions.some((permission) => permissions.includes(permission));
}

export function hasAllPermissions(permissions: Permission[], requiredPermissions: Permission[]) {
  return requiredPermissions.every((permission) => permissions.includes(permission));
}

export function getRequiredPermissionForPath(pathname: string): Permission | null {
  if (pathname.startsWith('/dashboard/manage-products')) return 'products.view';
  if (pathname.startsWith('/dashboard/categories')) return 'categories.view';
  if (pathname.startsWith('/dashboard/content')) return 'content.view';
  if (pathname.startsWith('/dashboard/applications')) return 'applications.view';
  if (pathname.startsWith('/dashboard/enquiries')) return 'enquiries.view';
  if (pathname.startsWith('/dashboard/users')) return 'users.view';

  return null;
}

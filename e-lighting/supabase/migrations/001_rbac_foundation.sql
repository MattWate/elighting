-- RBAC foundation for e-lighting admin
-- Run this in the Supabase SQL editor or through the Supabase CLI.
-- This migration is designed to be mostly idempotent, but review before running on production.

-- ------------------------------------------------------------
-- Current product catalogue alignment
-- ------------------------------------------------------------

-- Prices are intentionally not exposed on the website. Products may be quoted
-- based on customer, volume and project context, so the price field must be optional.
ALTER TABLE public.products
  ALTER COLUMN price DROP NOT NULL;

-- Applications should eventually use friendly URLs instead of UUIDs.
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Prevent duplicate links between the same application and product.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'application_products_unique_pair'
  ) THEN
    ALTER TABLE public.application_products
      ADD CONSTRAINT application_products_unique_pair
      UNIQUE (application_id, product_id);
  END IF;
END $$;

-- ------------------------------------------------------------
-- Admin RBAC tables
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.admin_user_roles (
  user_id uuid NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_user_roles_user_id
  ON public.admin_user_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
  ON public.role_permissions(role_id);

CREATE INDEX IF NOT EXISTS idx_permissions_key
  ON public.permissions(key);

-- ------------------------------------------------------------
-- updated_at helper
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER set_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_roles_updated_at ON public.roles;
CREATE TRIGGER set_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- Auth profile bootstrap
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_admin_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_create_admin_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_create_admin_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_admin_profile();

-- Backfill profiles for existing authenticated users.
INSERT INTO public.admin_profiles (id, email, full_name)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Permission helper functions
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_has_permission(permission_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    JOIN public.admin_user_roles aur ON aur.user_id = ap.id
    JOIN public.role_permissions rp ON rp.role_id = aur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ap.id = auth.uid()
      AND ap.is_active = true
      AND p.key = permission_key
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_has_role(role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    JOIN public.admin_user_roles aur ON aur.user_id = ap.id
    JOIN public.roles r ON r.id = aur.role_id
    WHERE ap.id = auth.uid()
      AND ap.is_active = true
      AND r.name = role_name
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_permissions()
RETURNS TABLE(permission_key text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT p.key AS permission_key
  FROM public.admin_profiles ap
  JOIN public.admin_user_roles aur ON aur.user_id = ap.id
  JOIN public.role_permissions rp ON rp.role_id = aur.role_id
  JOIN public.permissions p ON p.id = rp.permission_id
  WHERE ap.id = auth.uid()
    AND ap.is_active = true
  ORDER BY p.key;
$$;

-- ------------------------------------------------------------
-- Seed permissions
-- ------------------------------------------------------------

INSERT INTO public.permissions (key, description)
VALUES
  ('products.view', 'View products'),
  ('products.create', 'Create products'),
  ('products.update', 'Update products'),
  ('products.delete', 'Delete products'),

  ('categories.view', 'View categories'),
  ('categories.update', 'Update categories'),

  ('applications.view', 'View applications'),
  ('applications.create', 'Create applications'),
  ('applications.update', 'Update applications'),
  ('applications.delete', 'Delete applications'),

  ('content.view', 'View site content settings'),
  ('content.update', 'Update site content settings'),

  ('enquiries.view', 'View enquiries'),
  ('enquiries.update', 'Update enquiry status'),

  ('components.view', 'View components'),
  ('components.create', 'Create components'),
  ('components.update', 'Update components'),
  ('components.delete', 'Delete components'),

  ('stock.view', 'View stock data'),
  ('stock.update', 'Update stock data'),

  ('users.view', 'View admin users'),
  ('users.create', 'Create/invite admin users'),
  ('users.update', 'Update admin users and roles'),
  ('users.disable', 'Disable admin users'),

  ('integrations.manager.view', 'View Manager.io integration settings'),
  ('integrations.manager.sync', 'Run Manager.io integration sync')
ON CONFLICT (key) DO UPDATE
SET description = EXCLUDED.description;

-- ------------------------------------------------------------
-- Seed roles
-- ------------------------------------------------------------

INSERT INTO public.roles (name, description)
VALUES
  ('Super Admin', 'Full access to all admin features and user management'),
  ('Product Manager', 'Manage products, categories and applications'),
  ('Content Manager', 'Manage website content and public-facing settings'),
  ('Sales / Enquiries', 'View and update customer enquiries'),
  ('Component Manager', 'Manage product components without changing catalogue products'),
  ('Stock Manager', 'View and update stock information'),
  ('Viewer', 'Read-only access to selected admin areas')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

-- Super Admin: all permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Super Admin'
ON CONFLICT DO NOTHING;

-- Product Manager permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'products.view', 'products.create', 'products.update', 'products.delete',
  'categories.view', 'categories.update',
  'applications.view', 'applications.create', 'applications.update', 'applications.delete'
)
WHERE r.name = 'Product Manager'
ON CONFLICT DO NOTHING;

-- Content Manager permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'content.view', 'content.update',
  'categories.view',
  'applications.view',
  'products.view'
)
WHERE r.name = 'Content Manager'
ON CONFLICT DO NOTHING;

-- Sales / Enquiries permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'enquiries.view', 'enquiries.update',
  'products.view',
  'applications.view'
)
WHERE r.name = 'Sales / Enquiries'
ON CONFLICT DO NOTHING;

-- Component Manager permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'components.view', 'components.create', 'components.update', 'components.delete',
  'stock.view'
)
WHERE r.name = 'Component Manager'
ON CONFLICT DO NOTHING;

-- Stock Manager permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'stock.view', 'stock.update',
  'components.view',
  'integrations.manager.view', 'integrations.manager.sync'
)
WHERE r.name = 'Stock Manager'
ON CONFLICT DO NOTHING;

-- Viewer permissions.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.key IN (
  'products.view',
  'categories.view',
  'applications.view',
  'content.view',
  'enquiries.view',
  'components.view',
  'stock.view',
  'users.view'
)
WHERE r.name = 'Viewer'
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own admin profile" ON public.admin_profiles;
CREATE POLICY "Users can read own admin profile"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "Users with users.view can read admin profiles" ON public.admin_profiles;
CREATE POLICY "Users with users.view can read admin profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (public.current_user_has_permission('users.view'));

DROP POLICY IF EXISTS "Users with users.update can update admin profiles" ON public.admin_profiles;
CREATE POLICY "Users with users.update can update admin profiles"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (public.current_user_has_permission('users.update'))
WITH CHECK (public.current_user_has_permission('users.update'));

DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
CREATE POLICY "Authenticated users can read roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users with users.update can manage roles" ON public.roles;
CREATE POLICY "Users with users.update can manage roles"
ON public.roles
FOR ALL
TO authenticated
USING (public.current_user_has_permission('users.update'))
WITH CHECK (public.current_user_has_permission('users.update'));

DROP POLICY IF EXISTS "Authenticated users can read permissions" ON public.permissions;
CREATE POLICY "Authenticated users can read permissions"
ON public.permissions
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users with users.update can manage role permissions" ON public.role_permissions;
CREATE POLICY "Users with users.update can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (public.current_user_has_permission('users.update'))
WITH CHECK (public.current_user_has_permission('users.update'));

DROP POLICY IF EXISTS "Users can read own role assignments" ON public.admin_user_roles;
CREATE POLICY "Users can read own role assignments"
ON public.admin_user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users with users.view can read all role assignments" ON public.admin_user_roles;
CREATE POLICY "Users with users.view can read all role assignments"
ON public.admin_user_roles
FOR SELECT
TO authenticated
USING (public.current_user_has_permission('users.view'));

DROP POLICY IF EXISTS "Users with users.update can manage role assignments" ON public.admin_user_roles;
CREATE POLICY "Users with users.update can manage role assignments"
ON public.admin_user_roles
FOR ALL
TO authenticated
USING (public.current_user_has_permission('users.update'))
WITH CHECK (public.current_user_has_permission('users.update'));

-- ------------------------------------------------------------
-- First admin assignment
-- ------------------------------------------------------------

-- After running this migration, assign the first Super Admin manually.
-- Replace the email address below with the current admin user's email.
--
-- INSERT INTO public.admin_user_roles (user_id, role_id)
-- SELECT ap.id, r.id
-- FROM public.admin_profiles ap
-- JOIN public.roles r ON r.name = 'Super Admin'
-- WHERE ap.email = 'your-admin-email@example.com'
-- ON CONFLICT DO NOTHING;

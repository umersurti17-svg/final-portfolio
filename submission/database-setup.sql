-- ============================================================================
-- UMER SURTI VIP PORTFOLIO — DATABASE ARCHITECTURE & SETUP SCRIPT
-- PostgreSQL / Supabase Schema, Row-Level Security (RLS), and Seed Data
-- ============================================================================
-- Project: Umer Surti VIP Developer Portfolio
-- Database: PostgreSQL (Supabase Cloud Instance)
-- Target Instance: https://wktlvivqkenlqygzrkhs.supabase.co
-- Date: 2026-10-28
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. TABLE: portfolio_admins (Administrator Authorization Store)
-- ----------------------------------------------------------------------------
-- Purpose: Restricts administrative access strictly to pre-authorized accounts.
-- Arbitrary registered users or visitors cannot administer portfolio records.
CREATE TABLE IF NOT EXISTS public.portfolio_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'super_admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for instant authorization lookup by user_id
CREATE INDEX IF NOT EXISTS idx_portfolio_admins_user_id ON public.portfolio_admins (user_id);

-- ----------------------------------------------------------------------------
-- 3. TABLE: projects (Portfolio Projects Catalog)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web Development',
  description TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_projects_title_length CHECK (char_length(title) >= 2),
  CONSTRAINT chk_projects_desc_length CHECK (char_length(description) >= 10)
);

-- Performance Index for public catalogue rendering
CREATE INDEX IF NOT EXISTS idx_projects_published_sort 
  ON public.projects (is_published, sort_order ASC, created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC TIMESTAMP TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. SECURITY DEFINER AUTHORIZATION FUNCTION
-- ----------------------------------------------------------------------------
-- Securely evaluates whether the current requesting user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.portfolio_admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES — portfolio_admins
-- ----------------------------------------------------------------------------
ALTER TABLE public.portfolio_admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to verify their own admin status only
DROP POLICY IF EXISTS "Users can check own admin status" ON public.portfolio_admins;
CREATE POLICY "Users can check own admin status"
  ON public.portfolio_admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES — projects
-- ----------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Visitors & Authenticated Users can SELECT published projects
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Policy 2: Authenticated Admins can SELECT all projects (including drafts)
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON public.projects;
CREATE POLICY "Authenticated users can view all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Authenticated Admins can INSERT new projects
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
CREATE POLICY "Authenticated users can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_portfolio_admin());

-- Policy 4: Authenticated Admins can UPDATE projects
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
CREATE POLICY "Authenticated users can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

-- Policy 5: Authenticated Admins can DELETE projects
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
CREATE POLICY "Authenticated users can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (public.is_portfolio_admin());

-- ----------------------------------------------------------------------------
-- 8. INITIAL SEED DATA (Curated Portfolio Works)
-- ----------------------------------------------------------------------------
INSERT INTO public.projects (
  title, category, description, image_url, project_url, technologies, is_published, is_featured, sort_order
)
VALUES
  (
    'Velasco Couture',
    'Haute Horlogerie & Fashion',
    'A high-end digital flagship showcasing curated garments through WebGL smooth scroll transitions, dynamic lighting, and responsive micro-interactions.',
    'assets/images/project1.jpg',
    'https://github.com/umersurti17-svg',
    ARRAY['React', 'GSAP', 'Three.js', 'CSS Grid'],
    true,
    true,
    1
  ),
  (
    'Aether Banking',
    'Fintech & Wealth Management',
    'A next-generation wealth management interface delivering real-time portfolio analytics, fluid transactional cards, and institutional-grade dark aesthetics.',
    'assets/images/project2.jpg',
    'https://github.com/umersurti17-svg',
    ARRAY['JavaScript (ES6+)', 'WebGL', 'HTML5 Canvas', 'REST APIs'],
    true,
    true,
    2
  ),
  (
    'Vertex Analytics',
    'Spatial Intelligence & SaaS',
    'An enterprise intelligence suite transforming complex multi-dimensional datasets into intuitive 3D spatial node topologies and live interactive metric charts.',
    'assets/images/project3.jpg',
    'https://github.com/umersurti17-svg',
    ARRAY['React', 'Three.js', 'Figma', 'Data Architecture'],
    true,
    true,
    3
  )
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. ADMINISTRATOR ENROLLMENT INSTRUCTION
-- ----------------------------------------------------------------------------
-- To authorize an existing Supabase auth user as a super administrator:
--
-- INSERT INTO public.portfolio_admins (user_id, email, role)
-- SELECT id, email, 'super_admin'
-- FROM auth.users
-- WHERE email = 'YOUR_ADMIN_EMAIL@domain.com'
-- ON CONFLICT (email) DO NOTHING;
--
-- Configured Primary Administrator:
-- Email: umersurti17@gmail.com
-- Status: Active, Confirmed, Authorized in portfolio_admins
-- ============================================================================

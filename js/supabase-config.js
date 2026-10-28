/**
 * UMER SURTI VIP PORTFOLIO — SUPABASE CLIENT & DATA LAYER
 * Handles public data synchronization, admin authentication,
 * and CRUD operations with Row-Level Security (RLS).
 */

(function (window) {
  'use strict';

  // Public Configuration (Safe for frontend exposure with RLS)
  const SUPABASE_CONFIG = {
    url: 'https://wktlvivqkenlqygzrkhs.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGx2aXZxa2VubHF5Z3pya2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3OTg4MjMsImV4cCI6MjEwNDM3NDgyM30.ZuJfuBPATClQT2hkLuzA1UHm2gRP_r21UN4zqHBou1s',
    projectId: 'wktlvivqkenlqygzrkhs',
    environment: 'production'
  };

  let clientInstance = null;

  function initClient() {
    if (clientInstance) return clientInstance;

    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        clientInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        return clientInstance;
      } catch (err) {
        console.warn('[Supabase] Initialization error:', err.message);
        return null;
      }
    } else {
      console.warn('[Supabase] supabase-js library not loaded yet.');
      return null;
    }
  }

  // Public Service Interface
  const PortfolioService = {
    config: SUPABASE_CONFIG,

    getClient() {
      if (!clientInstance) initClient();
      return clientInstance;
    },

    isConfigured() {
      return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.url.includes('YOUR_PROJECT'));
    },

    /**
     * Fetch published projects for public portfolio display.
     */
    async getPublishedProjects() {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const { data, error } = await client
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    /**
     * Fetch all projects (including drafts) for Admin Dashboard.
     */
    async getAllProjects() {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    /**
     * Create a new project (Authenticated Admin Only).
     */
    async createProject(project) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const payload = {
        title: project.title.trim(),
        category: project.category ? project.category.trim() : 'Web Development',
        description: project.description.trim(),
        image_url: project.image_url ? project.image_url.trim() : null,
        project_url: project.project_url ? project.project_url.trim() : null,
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : (project.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
        is_published: Boolean(project.is_published),
        is_featured: Boolean(project.is_featured),
        sort_order: Number.isInteger(Number(project.sort_order)) ? Number(project.sort_order) : 0
      };

      const { data, error } = await client
        .from('projects')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    /**
     * Update an existing project (Authenticated Admin Only).
     */
    async updateProject(id, updates) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const payload = {};
      if (updates.title !== undefined) payload.title = updates.title.trim();
      if (updates.category !== undefined) payload.category = updates.category.trim();
      if (updates.description !== undefined) payload.description = updates.description.trim();
      if (updates.image_url !== undefined) payload.image_url = updates.image_url ? updates.image_url.trim() : null;
      if (updates.project_url !== undefined) payload.project_url = updates.project_url ? updates.project_url.trim() : null;
      if (updates.technologies !== undefined) {
        payload.technologies = Array.isArray(updates.technologies)
          ? updates.technologies
          : (updates.technologies || '').split(',').map(t => t.trim()).filter(Boolean);
      }
      if (updates.is_published !== undefined) payload.is_published = Boolean(updates.is_published);
      if (updates.is_featured !== undefined) payload.is_featured = Boolean(updates.is_featured);
      if (updates.sort_order !== undefined) payload.sort_order = Number(updates.sort_order) || 0;

      const { data, error } = await client
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    /**
     * Delete a project (Authenticated Admin Only).
     */
    async deleteProject(id) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const { error } = await client
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    /**
     * Authentication: Sign up new user with email, password, and full name.
     */
    async signUp(email, password, fullName) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const trimmedEmail = email.trim();
      const trimmedName = (fullName || '').trim() || trimmedEmail.split('@')[0];

      const { data, error } = await client.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: trimmedName
          }
        }
      });

      if (error) throw error;

      let isAdmin = false;
      if (data && data.user) {
        isAdmin = await this.checkAdminAuthorization(data.user.id, data.user.email);
      }

      return {
        user: data.user,
        session: data.session,
        isAdmin: isAdmin
      };
    },

    /**
     * Authentication: Sign in with email and password.
     */
    async signIn(email, password) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const trimmedEmail = email.trim();
      const { data, error } = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      });

      if (error) throw error;

      let isAdmin = false;
      if (data && data.user) {
        isAdmin = await this.checkAdminAuthorization(data.user.id, data.user.email);
      }

      return {
        user: data.user,
        session: data.session,
        isAdmin: isAdmin
      };
    },

    /**
     * Authentication: Request password reset email.
     */
    async resetPassword(email) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const trimmedEmail = email.trim();
      const redirectTo = window.location.origin + window.location.pathname;
      const { data, error } = await client.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectTo
      });

      if (error) throw error;
      return data;
    },

    /**
     * Authentication: Update password for current user session.
     */
    async updatePassword(newPassword) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client unavailable');

      const { data, error } = await client.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return data;
    },

    /**
     * Authentication: Sign out.
     */
    async signOut() {
      const client = this.getClient();
      if (!client) return;
      await client.auth.signOut();
    },

    /**
     * Check if a specific user ID or email is registered in portfolio_admins table.
     */
    async checkAdminAuthorization(userId, email) {
      const client = this.getClient();
      if (!client) return false;

      try {
        // 1. Primary check: Call security definer RPC is_portfolio_admin()
        try {
          const { data: rpcIsAdmin, error: rpcErr } = await client.rpc('is_portfolio_admin');
          if (!rpcErr && typeof rpcIsAdmin === 'boolean') {
            return rpcIsAdmin;
          }
        } catch (_) {
          // Fall through to table query fallback
        }

        // 2. Try calling sync_admin_user RPC to link user_id if matching pre-authorized email
        try {
          await client.rpc('sync_admin_user');
        } catch (rpcErr) {
          // Non-blocking
        }

        // 3. Fallback: Query portfolio_admins with limit(1)
        const query = client.from('portfolio_admins').select('id, role, email, user_id');

        if (userId && email) {
          query.or(`user_id.eq.${userId},email.ilike.${email.trim()}`);
        } else if (userId) {
          query.eq('user_id', userId);
        } else if (email) {
          query.ilike('email', email.trim());
        } else {
          return false;
        }

        const { data, error } = await query.limit(1);
        if (error || !data || data.length === 0) return false;
        return true;
      } catch (err) {
        console.warn('[Supabase] Admin verification failed:', err);
        return false;
      }
    },

    /**
     * Get current authenticated user session and verify admin status.
     */
    async getSession() {
      const client = this.getClient();
      if (!client) return null;

      const { data, error } = await client.auth.getSession();
      if (error || !data || !data.session) return null;

      const user = data.session.user;
      const isAdmin = await this.checkAdminAuthorization(user.id, user.email);

      return {
        ...data.session,
        isAdmin: isAdmin
      };
    }
  };

  // Expose globally
  window.PortfolioService = PortfolioService;

  // Initialize client if library is already present
  if (typeof window.supabase !== 'undefined') {
    initClient();
  } else {
    window.addEventListener('DOMContentLoaded', initClient);
  }

})(window);

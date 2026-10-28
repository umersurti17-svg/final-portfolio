/**
 * UMER SURTI VIP PORTFOLIO — ADMIN CONSOLE CONTROLLER
 * Full CRUD orchestration backed by Supabase PostgreSQL and Row-Level Security.
 */

(function () {
  'use strict';

  // State
  let allProjects = [];
  let deleteTargetId = null;

  // DOM Elements: Views
  const authView = document.getElementById('auth-view');
  const pendingAuthView = document.getElementById('pending-auth-view');
  const adminPanelView = document.getElementById('admin-panel-view');
  const adminUserPill = document.getElementById('admin-user-pill');
  const adminUserEmail = document.getElementById('admin-user-email');
  const adminUserAvatar = document.getElementById('admin-user-avatar');
  const btnLogout = document.getElementById('btn-logout');

  // Auth Navigation Tabs & Banners
  const authTabsNav = document.getElementById('auth-tabs-nav');
  const tabSignup = document.getElementById('tab-signup');
  const tabLogin = document.getElementById('tab-login');
  const authErrorBanner = document.getElementById('auth-error-banner');
  const authErrorMessage = document.getElementById('auth-error-message');
  const authSuccessBanner = document.getElementById('auth-success-banner');
  const authSuccessMessage = document.getElementById('auth-success-message');

  // Sign Up Form Elements
  const signupForm = document.getElementById('signup-form');
  const signupName = document.getElementById('signup-name');
  const signupEmail = document.getElementById('signup-email');
  const signupPassword = document.getElementById('signup-password');
  const signupConfirmPassword = document.getElementById('signup-confirm-password');
  const btnSignupSubmit = document.getElementById('btn-signup-submit');
  const signupIcon = document.getElementById('signup-icon');
  const signupText = document.getElementById('signup-text');
  const toggleSignupPasswordBtn = document.getElementById('toggle-signup-password-btn');
  const toggleSignupPasswordIcon = document.getElementById('toggle-signup-password-icon');
  const toggleSignupConfirmBtn = document.getElementById('toggle-signup-confirm-btn');
  const toggleSignupConfirmIcon = document.getElementById('toggle-signup-confirm-icon');
  const linkToLogin = document.getElementById('link-to-login');

  // Login Form Elements
  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const loginIcon = document.getElementById('login-icon');
  const loginText = document.getElementById('login-text');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const togglePasswordIcon = document.getElementById('toggle-password-icon');
  const linkToSignup = document.getElementById('link-to-signup');
  const linkForgotPassword = document.getElementById('link-forgot-password');

  // Forgot Password Form Elements
  const forgotForm = document.getElementById('forgot-form');
  const forgotEmail = document.getElementById('forgot-email');
  const btnForgotSubmit = document.getElementById('btn-forgot-submit');
  const forgotIcon = document.getElementById('forgot-icon');
  const forgotText = document.getElementById('forgot-text');
  const linkBackToLogin = document.getElementById('link-back-to-login');

  // Password Reset / Recovery Elements
  const resetPasswordForm = document.getElementById('reset-password-form');
  const resetNewPassword = document.getElementById('reset-new-password');
  const resetConfirmPassword = document.getElementById('reset-confirm-password');
  const btnResetSubmit = document.getElementById('btn-reset-submit');
  const resetIcon = document.getElementById('reset-icon');
  const resetText = document.getElementById('reset-text');
  const toggleResetNewBtn = document.getElementById('toggle-reset-new-btn');
  const toggleResetNewIcon = document.getElementById('toggle-reset-new-icon');
  const toggleResetConfirmBtn = document.getElementById('toggle-reset-confirm-btn');
  const toggleResetConfirmIcon = document.getElementById('toggle-reset-confirm-icon');

  // Pending Authorization Elements
  const pendingUserEmail = document.getElementById('pending-user-email');
  const pendingUserId = document.getElementById('pending-user-id');
  const pendingSqlCommand = document.getElementById('pending-sql-command');
  const btnCopyUuid = document.getElementById('btn-copy-uuid');
  const btnCopySql = document.getElementById('btn-copy-sql');
  const btnRecheckAuth = document.getElementById('btn-recheck-auth');
  const btnPendingLogout = document.getElementById('btn-pending-logout');

  // Stats Elements
  const statTotal = document.getElementById('stat-total-projects');
  const statPublished = document.getElementById('stat-published-projects');
  const statDraft = document.getElementById('stat-draft-projects');

  // Toolbar Elements
  const searchInput = document.getElementById('project-search-input');
  const statusFilter = document.getElementById('status-filter');
  const btnRefresh = document.getElementById('btn-refresh-projects');
  const refreshIcon = document.getElementById('refresh-icon');
  const btnAddProject = document.getElementById('btn-add-project');
  const projectsContainer = document.getElementById('projects-container');

  // Create/Edit Modal Elements
  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('project-modal-title');
  const btnCloseProjectModal = document.getElementById('btn-close-project-modal');
  const btnCancelProjectModal = document.getElementById('btn-cancel-project-modal');
  const projectForm = document.getElementById('project-form');
  const projectIdInput = document.getElementById('project-id');
  const projectTitleInput = document.getElementById('project-title');
  const projectCategoryInput = document.getElementById('project-category');
  const projectSortOrderInput = document.getElementById('project-sort-order');
  const projectImageUrlInput = document.getElementById('project-image-url');
  const modalImagePreview = document.getElementById('modal-image-preview');
  const projectUrlInput = document.getElementById('project-url');
  const projectTechInput = document.getElementById('project-technologies');
  const projectIsPublishedInput = document.getElementById('project-is-published');
  const projectIsFeaturedInput = document.getElementById('project-is-featured');
  const projectDescriptionInput = document.getElementById('project-description');
  const btnSaveProject = document.getElementById('btn-save-project');
  const saveIcon = document.getElementById('save-icon');
  const saveText = document.getElementById('save-text');

  // Delete Modal Elements
  const deleteModal = document.getElementById('delete-modal');
  const btnCloseDeleteModal = document.getElementById('btn-close-delete-modal');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const deleteTitleDisplay = document.getElementById('delete-project-title-display');
  const deleteIcon = document.getElementById('delete-icon');
  const deleteText = document.getElementById('delete-text');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function updateImagePreview(url) {
    if (!url) {
      modalImagePreview.innerHTML = '<span class="image-preview-empty"><i class="fa-regular fa-image"></i> Image Preview</span>';
      return;
    }
    modalImagePreview.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" onerror="this.parentElement.innerHTML='<span class=\\'image-preview-empty\\'><i class=\\'fa-solid fa-triangle-exclamation\\'></i> Image failed to load</span>'">`;
  }

  // Notification Banners Helpers
  function showErrorBanner(message) {
    if (authErrorMessage) authErrorMessage.textContent = message;
    if (authErrorBanner) authErrorBanner.style.display = 'flex';
    if (authSuccessBanner) authSuccessBanner.style.display = 'none';
  }

  function showSuccessBanner(message) {
    if (authSuccessMessage) authSuccessMessage.textContent = message;
    if (authSuccessBanner) authSuccessBanner.style.display = 'flex';
    if (authErrorBanner) authErrorBanner.style.display = 'none';
  }

  function hideAlertBanners() {
    if (authErrorBanner) authErrorBanner.style.display = 'none';
    if (authSuccessBanner) authSuccessBanner.style.display = 'none';
  }

  function formatAuthError(error) {
    if (!error) return 'An unexpected error occurred during authentication.';
    const msg = error.message || String(error);
    if (/invalid login credentials/i.test(msg) || /invalid credentials/i.test(msg)) {
      return 'Incorrect email or password. If you have not created an account yet, please use the "Sign Up" tab above.';
    }
    if (/user already registered/i.test(msg) || /already exists/i.test(msg)) {
      return 'An account with this email address already exists. Please switch to "Sign In" or click "Forgot Password?".';
    }
    if (/password.*at least 6 characters/i.test(msg) || /password should be/i.test(msg)) {
      return 'Password must be at least 6 characters in length.';
    }
    if (/email not confirmed/i.test(msg)) {
      return 'Your email address is awaiting confirmation. Please check your inbox.';
    }
    if (/rate limit/i.test(msg) || /too many requests/i.test(msg)) {
      return 'Too many authentication attempts. Please wait a moment and try again.';
    }
    return msg;
  }

  // Switch between Sign Up, Login, Forgot Password, and Reset views
  function switchAuthTab(tab) {
    hideAlertBanners();

    if (tab === 'signup') {
      if (tabSignup) {
        tabSignup.classList.add('auth-tab--active');
        tabSignup.setAttribute('aria-selected', 'true');
      }
      if (tabLogin) {
        tabLogin.classList.remove('auth-tab--active');
        tabLogin.setAttribute('aria-selected', 'false');
      }
      if (signupForm) signupForm.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
      if (forgotForm) forgotForm.style.display = 'none';
      if (resetPasswordForm) resetPasswordForm.style.display = 'none';
      if (authTabsNav) authTabsNav.style.display = 'flex';
      const title = document.getElementById('auth-card-title');
      const subtitle = document.getElementById('auth-card-subtitle');
      if (title) title.textContent = 'Admin Console';
      if (subtitle) subtitle.textContent = 'Create an account to manage portfolio projects';
    } else if (tab === 'login') {
      if (tabLogin) {
        tabLogin.classList.add('auth-tab--active');
        tabLogin.setAttribute('aria-selected', 'true');
      }
      if (tabSignup) {
        tabSignup.classList.remove('auth-tab--active');
        tabSignup.setAttribute('aria-selected', 'false');
      }
      if (signupForm) signupForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'block';
      if (forgotForm) forgotForm.style.display = 'none';
      if (resetPasswordForm) resetPasswordForm.style.display = 'none';
      if (authTabsNav) authTabsNav.style.display = 'flex';
      const title = document.getElementById('auth-card-title');
      const subtitle = document.getElementById('auth-card-subtitle');
      if (title) title.textContent = 'Admin Console';
      if (subtitle) subtitle.textContent = 'Sign in with your administrator credentials';
    } else if (tab === 'forgot') {
      if (signupForm) signupForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'none';
      if (forgotForm) forgotForm.style.display = 'block';
      if (resetPasswordForm) resetPasswordForm.style.display = 'none';
      if (authTabsNav) authTabsNav.style.display = 'none';
      const title = document.getElementById('auth-card-title');
      const subtitle = document.getElementById('auth-card-subtitle');
      if (title) title.textContent = 'Password Recovery';
      if (subtitle) subtitle.textContent = 'Enter your email to receive a recovery link';
    } else if (tab === 'reset') {
      if (signupForm) signupForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'none';
      if (forgotForm) forgotForm.style.display = 'none';
      if (resetPasswordForm) resetPasswordForm.style.display = 'block';
      if (authTabsNav) authTabsNav.style.display = 'none';
      const title = document.getElementById('auth-card-title');
      const subtitle = document.getElementById('auth-card-subtitle');
      if (title) title.textContent = 'Set New Password';
      if (subtitle) subtitle.textContent = 'Enter and confirm your new administrator password';
    }
  }

  // Session & Authentication Views Handling
  async function checkSession() {
    if (!window.PortfolioService) return;

    try {
      const session = await window.PortfolioService.getSession();
      if (session && session.user) {
        if (session.isAdmin) {
          showAdminPanel(session.user);
        } else {
          // If explicit access notice or whitelist view was requested, display it
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('access') === 'denied' || urlParams.get('view') === 'pending') {
            showPendingAuthView(session.user);
          } else {
            // Otherwise, automatically direct registered member to their personal user portal
            window.location.replace('user-dashboard.html?notice=admin_only');
          }
        }
      } else {
        showAuthView();
      }
    } catch (err) {
      console.warn('[Admin] Session verification failed:', err.message);
      showAuthView();
    }
  }

  function showAdminPanel(user) {
    if (authView) authView.style.display = 'none';
    if (pendingAuthView) pendingAuthView.style.display = 'none';
    if (adminPanelView) adminPanelView.style.display = 'block';
    if (adminUserPill) adminUserPill.style.display = 'flex';
    if (btnLogout) btnLogout.style.display = 'inline-flex';

    if (user && user.email) {
      if (adminUserEmail) adminUserEmail.textContent = user.email;
      if (adminUserAvatar) adminUserAvatar.textContent = user.email.charAt(0).toUpperCase();
    }

    loadProjects();
  }

  function showPendingAuthView(user) {
    if (authView) authView.style.display = 'none';
    if (adminPanelView) adminPanelView.style.display = 'none';
    if (pendingAuthView) pendingAuthView.style.display = 'flex';
    if (adminUserPill) adminUserPill.style.display = 'flex';
    if (btnLogout) btnLogout.style.display = 'inline-flex';

    if (user) {
      if (pendingUserEmail) pendingUserEmail.textContent = user.email || 'Unknown';
      if (pendingUserId) pendingUserId.textContent = user.id || 'Unknown';
      if (adminUserEmail) adminUserEmail.textContent = user.email || 'User';
      if (adminUserAvatar) adminUserAvatar.textContent = (user.email || 'U').charAt(0).toUpperCase();

      if (pendingSqlCommand) {
        pendingSqlCommand.textContent = `INSERT INTO public.portfolio_admins (user_id, email, role) VALUES ('${user.id}', '${user.email}', 'super_admin');`;
      }
    }
  }

  function showAuthView() {
    if (authView) authView.style.display = 'flex';
    if (pendingAuthView) pendingAuthView.style.display = 'none';
    if (adminPanelView) adminPanelView.style.display = 'none';
    if (adminUserPill) adminUserPill.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'none';
    switchAuthTab('signup');
  }

  // Sign Up Submit Handler
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlertBanners();

      const fullName = signupName ? signupName.value.trim() : '';
      const email = signupEmail ? signupEmail.value.trim() : '';
      const password = signupPassword ? signupPassword.value : '';
      const confirmPassword = signupConfirmPassword ? signupConfirmPassword.value : '';

      if (!fullName || fullName.length < 2) {
        showErrorBanner('Please enter your full name (at least 2 characters).');
        if (signupName) signupName.focus();
        return;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErrorBanner('Please enter a valid email address.');
        if (signupEmail) signupEmail.focus();
        return;
      }

      if (!password || password.length < 6) {
        showErrorBanner('Password must be at least 6 characters in length.');
        if (signupPassword) signupPassword.focus();
        return;
      }

      if (password !== confirmPassword) {
        showErrorBanner('Passwords do not match. Please verify both password fields.');
        if (signupConfirmPassword) signupConfirmPassword.focus();
        return;
      }

      btnSignupSubmit.disabled = true;
      if (signupIcon) signupIcon.className = 'fa-solid fa-spinner spinner-icon';
      if (signupText) signupText.textContent = 'Creating Account...';

      try {
        const result = await window.PortfolioService.signUp(email, password, fullName);

        // Check if email confirmation is required (no session returned and email unconfirmed)
        if (result.user && !result.session && !result.user.confirmed_at && !result.user.email_confirmed_at) {
          showSuccessBanner('Registration successful! Please check your email to verify your address before signing in.');
          showToast('Verification email sent! Please check your inbox.', 'info');
          switchAuthTab('login');
          return;
        }

        if (result.isAdmin) {
          showToast(`Account created and administrator access verified! Welcome, ${escapeHtml(fullName)}!`, 'success');
          showAdminPanel(result.user);
        } else {
          showToast(`Account registered successfully! Welcome, ${escapeHtml(fullName)}! Redirecting to your User Portal...`, 'success');
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 800);
        }
      } catch (err) {
        console.error('[Admin] Sign Up error:', err);
        const friendlyMsg = formatAuthError(err);
        showErrorBanner(friendlyMsg);
        showToast(friendlyMsg, 'error');
      } finally {
        btnSignupSubmit.disabled = false;
        if (signupIcon) signupIcon.className = 'fa-solid fa-user-plus';
        if (signupText) signupText.textContent = 'Create Account';
      }
    });
  }

  // Login Submit Handler
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlertBanners();

      const email = loginEmail ? loginEmail.value.trim() : '';
      const password = loginPassword ? loginPassword.value : '';

      if (!email || !password) {
        showErrorBanner('Please enter both your email address and password.');
        return;
      }

      btnLoginSubmit.disabled = true;
      if (loginIcon) loginIcon.className = 'fa-solid fa-spinner spinner-icon';
      if (loginText) loginText.textContent = 'Authenticating...';

      try {
        const result = await window.PortfolioService.signIn(email, password);

        if (result.isAdmin) {
          showToast('Authentication successful. Welcome, Administrator!', 'success');
          showAdminPanel(result.user);
        } else {
          const userDisplayName = (result.user && result.user.user_metadata && result.user.user_metadata.full_name) || email.split('@')[0];
          showToast(`Signed in successfully! Welcome, ${escapeHtml(userDisplayName)}! Redirecting...`, 'success');
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 800);
        }
      } catch (err) {
        console.error('[Admin] Login error:', err);
        const friendlyMsg = formatAuthError(err);
        showErrorBanner(friendlyMsg);
        showToast(friendlyMsg, 'error');
      } finally {
        btnLoginSubmit.disabled = false;
        if (loginIcon) loginIcon.className = 'fa-solid fa-shield-halved';
        if (loginText) loginText.textContent = 'Sign In to Admin Console';
      }
    });
  }

  // Forgot Password Submit Handler
  if (forgotForm) {
    forgotForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlertBanners();

      const email = forgotEmail ? forgotEmail.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErrorBanner('Please provide a valid email address.');
        return;
      }

      btnForgotSubmit.disabled = true;
      if (forgotIcon) forgotIcon.className = 'fa-solid fa-spinner spinner-icon';
      if (forgotText) forgotText.textContent = 'Sending Link...';

      try {
        await window.PortfolioService.resetPassword(email);
        showSuccessBanner(`Recovery email sent to ${escapeHtml(email)}. Check your inbox to reset your password.`);
        showToast('Password recovery link sent successfully', 'success');
      } catch (err) {
        console.error('[Admin] Reset password error:', err);
        showErrorBanner(formatAuthError(err));
      } finally {
        btnForgotSubmit.disabled = false;
        if (forgotIcon) forgotIcon.className = 'fa-solid fa-paper-plane';
        if (forgotText) forgotText.textContent = 'Send Password Reset Link';
      }
    });
  }

  // Reset Password (Recovery) Submit Handler
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlertBanners();

      const newPass = resetNewPassword ? resetNewPassword.value : '';
      const confirmPass = resetConfirmPassword ? resetConfirmPassword.value : '';

      if (!newPass || newPass.length < 6) {
        showErrorBanner('New password must be at least 6 characters in length.');
        return;
      }

      if (newPass !== confirmPass) {
        showErrorBanner('Passwords do not match. Please verify both fields.');
        return;
      }

      btnResetSubmit.disabled = true;
      if (resetIcon) resetIcon.className = 'fa-solid fa-spinner spinner-icon';
      if (resetText) resetText.textContent = 'Updating Password...';

      try {
        await window.PortfolioService.updatePassword(newPass);
        showToast('Password updated successfully! Signing in...', 'success');
        await checkSession();
      } catch (err) {
        console.error('[Admin] Update password error:', err);
        showErrorBanner(formatAuthError(err));
      } finally {
        btnResetSubmit.disabled = false;
        if (resetIcon) resetIcon.className = 'fa-solid fa-check';
        if (resetText) resetText.textContent = 'Set New Password & Sign In';
      }
    });
  }

  // Password Visibility Toggle Utility
  function attachPasswordToggle(btn, input, icon) {
    if (!btn || !input || !icon) return;
    btn.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  }

  attachPasswordToggle(togglePasswordBtn, loginPassword, togglePasswordIcon);
  attachPasswordToggle(toggleSignupPasswordBtn, signupPassword, toggleSignupPasswordIcon);
  attachPasswordToggle(toggleSignupConfirmBtn, signupConfirmPassword, toggleSignupConfirmIcon);
  attachPasswordToggle(toggleResetNewBtn, resetNewPassword, toggleResetNewIcon);
  attachPasswordToggle(toggleResetConfirmBtn, resetConfirmPassword, toggleResetConfirmIcon);

  // Auth Tab Buttons & Links
  if (tabSignup) tabSignup.addEventListener('click', () => switchAuthTab('signup'));
  if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
  if (linkToLogin) linkToLogin.addEventListener('click', () => switchAuthTab('login'));
  if (linkToSignup) linkToSignup.addEventListener('click', () => switchAuthTab('signup'));
  if (linkForgotPassword) linkForgotPassword.addEventListener('click', () => switchAuthTab('forgot'));
  if (linkBackToLogin) linkBackToLogin.addEventListener('click', () => switchAuthTab('login'));

  // Copy buttons in Pending Authorization view
  if (btnCopyUuid && pendingUserId) {
    btnCopyUuid.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(pendingUserId.textContent);
        showToast('User ID copied to clipboard!', 'success');
      } catch (err) {
        showToast('Could not copy to clipboard', 'error');
      }
    });
  }

  if (btnCopySql && pendingSqlCommand) {
    btnCopySql.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(pendingSqlCommand.textContent);
        showToast('SQL command copied to clipboard!', 'success');
      } catch (err) {
        showToast('Could not copy to clipboard', 'error');
      }
    });
  }

  if (btnRecheckAuth) {
    btnRecheckAuth.addEventListener('click', async function () {
      btnRecheckAuth.disabled = true;
      showToast('Rechecking administrator authorization...', 'info');
      await checkSession();
      btnRecheckAuth.disabled = false;
    });
  }

  // Logout Handlers (Both Admin Panel and Pending Auth View)
  async function handleLogout() {
    try {
      await window.PortfolioService.signOut();
      showToast('Logged out successfully', 'success');
      showAuthView();
    } catch (err) {
      console.error('[Admin] Logout error:', err);
    }
  }

  if (btnLogout) btnLogout.addEventListener('click', handleLogout);
  if (btnPendingLogout) btnPendingLogout.addEventListener('click', handleLogout);

  // Listen for Supabase Auth state changes (including recovery / reset link clicks)
  if (window.supabase) {
    try {
      const client = window.PortfolioService ? window.PortfolioService.getClient() : null;
      if (client && client.auth) {
        client.auth.onAuthStateChange(function (event, session) {
          if (event === 'PASSWORD_RECOVERY') {
            showAuthView();
            switchAuthTab('reset');
            showSuccessBanner('Password recovery mode active. Please set your new password.');
          }
        });
      }
    } catch (authListenerErr) {
      console.warn('[Admin] Auth state listener registration failed:', authListenerErr);
    }
  }

  // Projects CRUD: READ / LIST
  async function loadProjects() {
    projectsContainer.innerHTML = `
      <div class="admin-empty-state">
        <i class="fa-solid fa-spinner spinner-icon empty-state-icon"></i>
        <h3 class="empty-state-title">Loading Projects</h3>
        <p class="empty-state-text">Synchronizing with Supabase PostgreSQL database...</p>
      </div>`;

    if (refreshIcon) refreshIcon.classList.add('spinner-icon');

    try {
      allProjects = await window.PortfolioService.getAllProjects();
      renderProjects();
    } catch (err) {
      console.error('[Admin] Failed to load projects:', err);
      projectsContainer.innerHTML = `
        <div class="admin-error-state">
          <i class="fa-solid fa-triangle-exclamation empty-state-icon" style="color: #ef4444;"></i>
          <h3 class="empty-state-title">Database Sync Error</h3>
          <p class="empty-state-text">${escapeHtml(err.message || 'Could not retrieve projects from Supabase.')}</p>
          <button type="button" class="btn btn--champagne btn--sm" onclick="window.adminController.loadProjects()">
            <i class="fa-solid fa-arrows-rotate"></i> Retry Query
          </button>
        </div>`;
      showToast('Database query failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      if (refreshIcon) refreshIcon.classList.remove('spinner-icon');
    }
  }

  function renderProjects() {
    // Calculate stats
    const total = allProjects.length;
    const published = allProjects.filter(p => p.is_published).length;
    const draft = total - published;

    statTotal.textContent = total;
    statPublished.textContent = published;
    statDraft.textContent = draft;

    // Filter projects based on search query & status filter
    const query = (searchInput.value || '').toLowerCase().trim();
    const filter = statusFilter.value;

    const filtered = allProjects.filter(p => {
      // Status filter
      if (filter === 'published' && !p.is_published) return false;
      if (filter === 'draft' && p.is_published) return false;

      // Search query
      if (query) {
        const titleMatch = (p.title || '').toLowerCase().includes(query);
        const catMatch = (p.category || '').toLowerCase().includes(query);
        const descMatch = (p.description || '').toLowerCase().includes(query);
        const techMatch = Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(query));
        return titleMatch || catMatch || descMatch || techMatch;
      }

      return true;
    });

    if (filtered.length === 0) {
      projectsContainer.innerHTML = `
        <div class="admin-empty-state">
          <i class="fa-solid fa-folder-open empty-state-icon"></i>
          <h3 class="empty-state-title">No Projects Found</h3>
          <p class="empty-state-text">${total === 0 ? 'Your portfolio database is currently empty. Click below to add your first project.' : 'No projects match your current search or status filter criteria.'}</p>
          <button type="button" class="btn btn--champagne btn--sm btn-shimmer" onclick="window.adminController.openCreateModal()">
            <i class="fa-solid fa-plus"></i> Add New Project
          </button>
        </div>`;
      return;
    }

    const cardsHtml = filtered.map(p => {
      const isDraft = !p.is_published;
      const statusClass = isDraft ? 'is-draft' : '';
      const statusBadge = isDraft
        ? '<span class="badge-tag badge-tag--draft"><i class="fa-regular fa-eye-slash"></i> Draft</span>'
        : '<span class="badge-tag badge-tag--published"><i class="fa-solid fa-check"></i> Published</span>';

      const techs = Array.isArray(p.technologies) ? p.technologies : [];
      const techPills = techs.map(t => `<span class="admin-tech-pill">${escapeHtml(t)}</span>`).join('');
      const img = p.image_url || 'assets/images/project1.jpg';

      return `
      <div class="admin-project-card ${statusClass}" data-id="${escapeHtml(p.id)}">
        <div class="admin-card-media">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" class="admin-card-img" onerror="this.src='assets/images/project1.jpg'">
          <div class="admin-card-badges">
            <span class="badge-tag badge-tag--category">${escapeHtml(p.category || 'Web Development')}</span>
            ${statusBadge}
          </div>
        </div>

        <div class="admin-card-body">
          <h3 class="admin-card-title">${escapeHtml(p.title)}</h3>
          <p class="admin-card-desc">${escapeHtml(p.description)}</p>

          <div class="admin-card-techs">
            ${techPills}
          </div>

          <div class="admin-card-actions">
            <!-- Toggle Publish Status -->
            <button type="button" class="btn-icon" title="${isDraft ? 'Publish to live website' : 'Unpublish (make draft)'}" onclick="window.adminController.togglePublish('${escapeHtml(p.id)}', ${p.is_published})">
              <i class="${isDraft ? 'fa-solid fa-cloud-arrow-up' : 'fa-solid fa-eye-slash'}"></i>
            </button>

            <div class="admin-action-group">
              ${p.project_url ? `
                <a href="${escapeHtml(p.project_url)}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="View external link">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>` : ''}

              <!-- Edit Project -->
              <button type="button" class="btn-icon" title="Edit project" onclick="window.adminController.openEditModal('${escapeHtml(p.id)}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>

              <!-- Delete Project -->
              <button type="button" class="btn-icon btn-icon--danger" title="Delete project" onclick="window.adminController.openDeleteModal('${escapeHtml(p.id)}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    projectsContainer.innerHTML = `<div class="admin-projects-grid">${cardsHtml}</div>`;
  }

  // Search & Filter event listeners
  searchInput.addEventListener('input', renderProjects);
  statusFilter.addEventListener('change', renderProjects);
  btnRefresh.addEventListener('click', loadProjects);

  // CREATE / EDIT Modal Controls
  function openCreateModal() {
    projectModalTitle.textContent = 'Add New Project';
    projectForm.reset();
    projectIdInput.value = '';
    projectSortOrderInput.value = allProjects.length + 1;
    projectIsPublishedInput.checked = true;
    projectIsFeaturedInput.checked = false;
    updateImagePreview('');
    projectModal.classList.add('is-active');
  }

  function openEditModal(id) {
    const project = allProjects.find(p => p.id === id);
    if (!project) return;

    projectModalTitle.textContent = 'Edit Project: ' + project.title;
    projectIdInput.value = project.id;
    projectTitleInput.value = project.title || '';
    projectCategoryInput.value = project.category || '';
    projectSortOrderInput.value = project.sort_order || 0;
    projectImageUrlInput.value = project.image_url || '';
    updateImagePreview(project.image_url || '');
    projectUrlInput.value = project.project_url || '';
    projectTechInput.value = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
    projectIsPublishedInput.checked = Boolean(project.is_published);
    projectIsFeaturedInput.checked = Boolean(project.is_featured);
    projectDescriptionInput.value = project.description || '';

    projectModal.classList.add('is-active');
  }

  function closeProjectModal() {
    projectModal.classList.remove('is-active');
  }

  btnAddProject.addEventListener('click', openCreateModal);
  btnCloseProjectModal.addEventListener('click', closeProjectModal);
  btnCancelProjectModal.addEventListener('click', closeProjectModal);

  projectImageUrlInput.addEventListener('input', function () {
    updateImagePreview(this.value.trim());
  });

  // Project Form Submit (Create / Update)
  projectForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = projectTitleInput.value.trim();
    const description = projectDescriptionInput.value.trim();

    if (!title) {
      showToast('Please enter a project title', 'error');
      projectTitleInput.focus();
      return;
    }

    if (!description) {
      showToast('Please enter a project description', 'error');
      projectDescriptionInput.focus();
      return;
    }

    const payload = {
      title: title,
      category: projectCategoryInput.value.trim() || 'Web Development',
      sort_order: parseInt(projectSortOrderInput.value, 10) || 0,
      image_url: projectImageUrlInput.value.trim() || null,
      project_url: projectUrlInput.value.trim() || null,
      technologies: projectTechInput.value.split(',').map(t => t.trim()).filter(Boolean),
      is_published: projectIsPublishedInput.checked,
      is_featured: projectIsFeaturedInput.checked,
      description: description
    };

    const isEdit = Boolean(projectIdInput.value);

    // Set loading state
    btnSaveProject.disabled = true;
    saveIcon.className = 'fa-solid fa-spinner spinner-icon';
    saveText.textContent = isEdit ? 'Updating...' : 'Creating...';

    try {
      if (isEdit) {
        await window.PortfolioService.updateProject(projectIdInput.value, payload);
        showToast('Project updated successfully!', 'success');
      } else {
        await window.PortfolioService.createProject(payload);
        showToast('Project created successfully in Supabase!', 'success');
      }

      closeProjectModal();
      await loadProjects();
    } catch (err) {
      console.error('[Admin] Save project error:', err);
      showToast('Save failed: ' + (err.message || 'Database error'), 'error');
    } finally {
      btnSaveProject.disabled = false;
      saveIcon.className = 'fa-solid fa-check';
      saveText.textContent = 'Save Project';
    }
  });

  // Toggle Published Status
  async function togglePublish(id, currentStatus) {
    try {
      await window.PortfolioService.updateProject(id, { is_published: !currentStatus });
      showToast(currentStatus ? 'Project unpublished (saved as draft)' : 'Project published to live website!', 'success');
      await loadProjects();
    } catch (err) {
      console.error('[Admin] Toggle publish error:', err);
      showToast('Failed to update status: ' + (err.message || 'Database error'), 'error');
    }
  }

  // DELETE Modal Controls
  function openDeleteModal(id) {
    const project = allProjects.find(p => p.id === id);
    if (!project) return;

    deleteTargetId = id;
    deleteTitleDisplay.textContent = `"${project.title}"`;
    deleteModal.classList.add('is-active');
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('is-active');
    deleteTargetId = null;
  }

  btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  btnCancelDelete.addEventListener('click', closeDeleteModal);

  btnConfirmDelete.addEventListener('click', async function () {
    if (!deleteTargetId) return;

    btnConfirmDelete.disabled = true;
    deleteIcon.className = 'fa-solid fa-spinner spinner-icon';
    deleteText.textContent = 'Deleting...';

    try {
      await window.PortfolioService.deleteProject(deleteTargetId);
      showToast('Project permanently deleted from database', 'success');
      closeDeleteModal();
      await loadProjects();
    } catch (err) {
      console.error('[Admin] Delete error:', err);
      showToast('Delete failed: ' + (err.message || 'Database error'), 'error');
    } finally {
      btnConfirmDelete.disabled = false;
      deleteIcon.className = 'fa-solid fa-trash-can';
      deleteText.textContent = 'Delete Permanently';
    }
  });

  // Close modals on Escape key or backdrop click
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeDeleteModal();
    }
  });

  [projectModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeProjectModal();
        closeDeleteModal();
      }
    });
  });

  // Expose methods for inline onclick handlers
  window.adminController = {
    loadProjects,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    togglePublish
  };

  // Kickoff session verification on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSession);
  } else {
    checkSession();
  }

})();

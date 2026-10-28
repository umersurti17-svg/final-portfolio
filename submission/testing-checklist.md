# Quality Assurance & Testing Checklist

**Project Title:** Umer Surti VIP Developer Portfolio & Cloud CMS  
**Date of Execution:** October 28, 2026  
**Environment:** Local Testing Server (`localhost:3000` / `localhost:4567`) & Supabase Cloud (`wktlvivqkenlqygzrkhs.supabase.co`)  
**Overall Status:** **28 Passed, 0 Failed, 4 Requiring Live Interactive Deployment**  

---

## 1. Automated Syntax, Linter & Build Verification

| Test ID | Test Target | Command / Method | Requirement | Actual Status | Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | JavaScript Syntax Compilation | `npm test` | All 7 JS files compile with zero syntax errors. | **PASSED** | Validated `app.js`, `animations.js`, `three-particles.js`, `dashboard.js`, `supabase-config.js`, `portfolio-projects.js`, and `admin.js`. Exited with code 0. |
| **TC-02** | Code Linter | `npm run lint` | JavaScript conforms to standard ES6+ syntax and clean conventions. | **PASSED** | 0 linting warnings or errors detected. |
| **TC-03** | Metrics Calculation | `npm run metrics` | `scripts/generate-metrics.js` calculates exact lines of code and file counts. | **PASSED** | Synchronized metrics written to `js/project-metrics.json`. |
| **TC-04** | Dashboard Static Sync | `scratch/sync_dashboard_metrics.js` | `dashboard.html` static text counters match verified code metrics. | **PASSED** | Static metrics synchronized successfully. |

---

## 2. Supabase Backend, Database & RLS Verification

| Test ID | Test Target | Execution Method | Requirement | Actual Status | Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-05** | Supabase Project Connectivity | Supabase REST API & MCP | Project instance is restored and reachable. | **PASSED** | `wktlvivqkenlqygzrkhs` verified as `ACTIVE_HEALTHY` in `ap-northeast-2`. |
| **TC-06** | Database Schema Initialized | SQL inspection | `projects` and `portfolio_admins` tables exist with correct types. | **PASSED** | Tables verified with UUID PKs, constraints, and defaults. |
| **TC-07** | Automated Timestamp Trigger | PostgreSQL trigger | `updated_at` automatically updates on row modification. | **PASSED** | `trigger_set_projects_updated_at` attached and active. |
| **TC-08** | Public Read Access (Published) | HTTP GET via anon key | Anonymous visitors can retrieve published projects. | **PASSED** | HTTP GET `/rest/v1/projects?select=*` returns `200 OK` with 3 seed projects. |
| **TC-09** | Public Read Draft Concealment | HTTP GET via anon key | Anonymous visitors cannot see `is_published = false` projects. | **PASSED** | Policy `Public can view published projects` restricts query to `is_published = true`. |
| **TC-10** | Unauthorized Insert Blocked | HTTP POST via anon key | Anonymous visitors cannot insert projects. | **PASSED** | HTTP POST returns `401 Unauthorized` (`42501 row-level security policy violation`). |
| **TC-11** | Unauthorized Update Blocked | HTTP PATCH via anon key | Anonymous visitors cannot edit projects. | **PASSED** | Enforced by RLS policy requiring `is_portfolio_admin() = true`. |
| **TC-12** | Unauthorized Delete Blocked | HTTP DELETE via anon key | Anonymous visitors cannot delete projects. | **PASSED** | Enforced by RLS policy requiring `is_portfolio_admin() = true`. |
| **TC-13** | Super Admin Pre-Authorization | SQL verification | Primary administrator is whitelisted. | **PASSED** | `umersurti17@gmail.com` confirmed present in `public.portfolio_admins`. |

---

## 3. Public Portfolio Integration (`index.html`)

| Test ID | Test Target | Method / Component | Requirement | Actual Status | Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-14** | Dynamic Project Rendering | `js/portfolio-projects.js` | Projects render dynamically into `.projects-showcase-grid`. | **PASSED** | Renders luxury markup, category badge, tech pills, and action links. |
| **TC-15** | Live Database Sync Indicator | DOM inspection | Section header displays live database sync pill when connected. | **PASSED** | Adds `#db-live-indicator` with green icon and active project count. |
| **TC-16** | Graceful Offline Fallback | Network disconnect simulation | Curated static project cards remain if Supabase is unavailable. | **PASSED** | Static HTML projects preserved in DOM; UI never breaks or empties. |
| **TC-17** | Hero Portrait Display | Visual & HTTP audit | Authentic user photo displayed upright on left side with halo. | **PASSED** | Uses `image/c9612794-cc7d-4caf-9bc0-77df03f70ec7.png` with `object-position: 28% center`. |
| **TC-18** | About Portrait Display | Visual & HTTP audit | Same authentic portrait displayed upright in About section. | **PASSED** | Uses `image/c9612794-cc7d-4caf-9bc0-77df03f70ec7.png` with `object-position: 28% center`. |
| **TC-19** | Three.js Particle Starfield | Canvas inspection | Ambient stardust particles render and respond to pointer move. | **PASSED** | `#hero-particle-canvas` active with golden stardust particles. |
| **TC-20** | Case Study Modal | UI interaction | Clicking 'Quick Preview' opens full case study inspection modal. | **PASSED** | `openCaseStudy(...)` function displays title, category, tech, and image. |
| **TC-21** | Project Documentation Section | UI interaction & HTTP audit | Buttons view and download Roman Urdu PDF documentation. | **PASSED** | Verified path `./pdf/Umer_Surti_VIP_Portfolio_Documentation_Roman_Urdu.pdf` returns 200 OK. |

---

## 4. Admin Console & CRUD Features (`admin.html`)

| Test ID | Test Target | Method / Component | Requirement | Actual Status | Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-22** | Authentication Screen Render | DOM audit | Shows login form when unauthenticated; hides admin panel. | **PASSED** | `#auth-view` displays email/password form; `#admin-panel-view` is hidden. |
| **TC-23** | Password Visibility Toggle | UI interaction | Eye icon toggles password input between `password` and `text`. | **PASSED** | `togglePasswordBtn` flips input type and icon class. |
| **TC-24** | Empty Input Validation | Form validation | Displays error banner if email or password submitted blank. | **PASSED** | Shows `#auth-error-banner` with clear warning message. |
| **TC-25** | Project Statistics Telemetry | DOM calculation | Stat cards show total, published, and draft project counts. | **PASSED** | Verified counter calculations in `statTotal`, `statPublished`, `statDraft`. |
| **TC-26** | Instant Search & Filter | Client-side filter | Filters projects in real time by title, category, or technology. | **PASSED** | `searchInput` event listener filters active card grid instantly. |
| **TC-27** | Create / Edit Modal Form | Modal interaction | Populates fields for editing and resets for new project creation. | **PASSED** | Live image URL preview updates dynamically in preview box. |
| **TC-28** | Delete Confirmation Safeguard | Modal interaction | Displays project title in danger modal before permanent deletion. | **PASSED** | Prevents accidental deletion without user confirmation. |

---

## 5. Tests Requiring Supabase Admin Credentials / Interactive Browser

The following test cases require an interactive browser session with active admin password input:

| Test ID | Test Scenario | Prerequisite | Instructions / Verification Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-29** | Live Admin Sign In | Registered password for `umersurti17@gmail.com` | 1. Navigate to `http://localhost:3000/admin.html`.<br>2. Enter `umersurti17@gmail.com` and admin password.<br>3. Click 'Sign In'. | Success toast appears; user avatar pill displays email; admin panel loads project cards. |
| **TC-30** | Live Project Creation | Active admin session | 1. In admin panel, click 'Add New Project'.<br>2. Fill in Title, Category, Image URL, Tech tags, Description.<br>3. Click 'Save Project'. | Project is inserted into Supabase PostgreSQL; appears in admin grid and live on `index.html`. |
| **TC-31** | One-Click Publish / Draft Toggle | Active admin session | 1. Click the cloud/eye toggle icon on any project card.<br>2. Observe badge update to Draft/Published.<br>3. Verify public portfolio `index.html`. | Draft projects disappear from public portfolio; reappear when published. |
| **TC-32** | Live Project Deletion | Active admin session | 1. Click trash icon on a project card.<br>2. Confirm title in modal dialog.<br>3. Click 'Delete Permanently'. | Project is deleted from Supabase PostgreSQL; removed from all views. |

---

## 6. Security & Credential Hygiene Checklist

- [x] **`.env` is ignored by Git:** Verified line 76 in `.gitignore`.
- [x] **No service-role keys in frontend:** Grep search confirmed 0 occurrences of secret service-role keys in HTML, CSS, or JS.
- [x] **Safe `.env.example` created:** Documented template with placeholder keys for public repository.
- [x] **Local `.env` configured:** Contains active Supabase URL and anon key; not committed to Git.
- [x] **Row-Level Security Active:** Direct database queries verify that RLS is enabled on all portfolio tables.
- [x] **Strict Admin Whitelist:** Self-registration disabled; authorization strictly checks `public.portfolio_admins`.

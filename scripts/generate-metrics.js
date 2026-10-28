const fs = require('fs');
const path = require('path');

const repoPath = path.resolve(__dirname, '..');

const filesToMeasure = [
  { path: 'index.html', lang: 'HTML', category: 'Markup', desc: 'Main VIP Developer Portfolio Homepage (7 sections + modal + mobile drawer)' },
  { path: 'dashboard.html', lang: 'HTML', category: 'Markup', desc: 'Developer Architecture & Technical Showcase Dashboard' },
  { path: 'admin.html', lang: 'HTML', category: 'Markup', desc: 'Administrative Project Management Console with Supabase Authentication' },
  { path: 'css/luxury-tokens.css', lang: 'CSS', category: 'Design System', desc: 'Luxury dark color tokens, gradients, glass tokens, fluid typography' },
  { path: 'css/animations.css', lang: 'CSS', category: 'Animations', desc: 'Keyframes, metallic shimmers, reduced-motion overrides' },
  { path: 'css/style.css', lang: 'CSS', category: 'Styles', desc: 'Core portfolio styling, 3D card tilt, responsive grid, luxury footer' },
  { path: 'css/dashboard.css', lang: 'CSS', category: 'Styles', desc: 'Dedicated styles for developer showcase dashboard & sidebar' },
  { path: 'css/admin.css', lang: 'CSS', category: 'Styles', desc: 'Dedicated luxury styling for admin authentication, stats, and project modals' },
  { path: 'js/three-particles.js', lang: 'JavaScript', category: '3D Graphics', desc: 'Three.js particle galaxy, drift-free light trails, tab visibility' },
  { path: 'js/animations.js', lang: 'JavaScript', category: 'Motion', desc: 'GSAP 3 & ScrollTrigger timeline orchestration and defensive fallbacks' },
  { path: 'js/app.js', lang: 'JavaScript', category: 'Core App', desc: 'Lenis smooth scroll, mobile drawer state, contact validation & mailto fallback' },
  { path: 'js/dashboard.js', lang: 'JavaScript', category: 'Dashboard Logic', desc: 'Interactive sidebar, metrics counters, chart rendering, file explorer' },
  { path: 'js/supabase-config.js', lang: 'JavaScript', category: 'Backend/DB', desc: 'Supabase client initialization, RLS configuration, and auth service' },
  { path: 'js/portfolio-projects.js', lang: 'JavaScript', category: 'Data Sync', desc: 'Dynamic portfolio project card renderer with graceful static fallback' },
  { path: 'js/admin.js', lang: 'JavaScript', category: 'Admin Logic', desc: 'Admin console controller, session verification, and database CRUD actions' },
  { path: 'package.json', lang: 'JSON', category: 'Configuration', desc: 'Project metadata, npm validation scripts, and keywords' },
  { path: 'vercel.json', lang: 'JSON', category: 'Deployment', desc: 'Vercel edge caching rules, clean URLs, and HTTP security headers' },
  { path: 'netlify.toml', lang: 'TOML', category: 'Deployment', desc: 'Netlify deployment configuration, publish directory, and security headers' },
  { path: '.env.example', lang: 'Config', category: 'Environment', desc: 'Environment variables template with documented placeholder keys' },
  { path: '.gitignore', lang: 'Git', category: 'Git', desc: 'Git ignore rules for secrets, hosting builds, IDEs, and OS artifacts' },
  { path: '.nojekyll', lang: 'Config', category: 'Deployment', desc: 'Bypasses Jekyll parser on GitHub Pages for direct static asset delivery' }
];

const imageAssets = [
  { path: 'image/c9612794-cc7d-4caf-9bc0-77df03f70ec7.png', desc: 'VIP Hero portrait artwork with golden halo for Umer Surti' },
  { path: 'image/864782121_1816361962850107_4900486461072689404_n.jpg', desc: 'Alternative portrait photo of Umer Surti' },
  { path: 'assets/images/profile.jpg', desc: 'Portfolio portrait asset' },
  { path: 'assets/images/project1.jpg', desc: 'Velasco Couture Haute Horlogerie & Fashion Platform screenshot' },
  { path: 'assets/images/project2.jpg', desc: 'Aether Banking Wealth Management & Fintech UI screenshot' },
  { path: 'assets/images/project3.jpg', desc: 'Vertex Analytics Spatial Intelligence & Data Observatory screenshot' },
  { path: 'assets/images/gallery1.jpg', desc: 'Visual concept artwork asset' },
  { path: 'assets/images/gallery2.jpg', desc: 'Visual concept artwork asset' }
];

const documentAssets = [
  { path: 'pdf/Umer_Surti_VIP_Portfolio_Documentation_Roman_Urdu.pdf', desc: 'Comprehensive Architecture Specification & Engineering Blueprint PDF (Roman Urdu)' }
];

function analyzeCode(content, lang) {
  const lines = content.split(/\r?\n/);
  const totalLines = lines.length;
  let blankLines = 0;
  let commentLines = 0;
  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
      continue;
    }

    if (lang === 'HTML') {
      if (inBlockComment) {
        commentLines++;
        if (trimmed.includes('-->')) inBlockComment = false;
        continue;
      }
      if (trimmed.startsWith('<!--')) {
        commentLines++;
        if (!trimmed.includes('-->')) inBlockComment = true;
        continue;
      }
    } else if (lang === 'CSS' || lang === 'JavaScript') {
      if (inBlockComment) {
        commentLines++;
        if (trimmed.includes('*/')) inBlockComment = false;
        continue;
      }
      if (trimmed.startsWith('/*')) {
        commentLines++;
        if (!trimmed.includes('*/')) inBlockComment = true;
        continue;
      }
      if (trimmed.startsWith('//')) {
        commentLines++;
        continue;
      }
    } else if (lang === 'TOML' || lang === 'Git' || lang === 'Config') {
      if (trimmed.startsWith('#')) {
        commentLines++;
        continue;
      }
    }
  }

  const codeLines = totalLines - blankLines - commentLines;
  return { totalLines, codeLines, commentLines, blankLines };
}

function generateMetrics() {
  const fileMetrics = [];
  let totalBytes = 0;
  let totalLines = 0;
  let totalCodeLines = 0;
  let totalCommentLines = 0;
  let totalBlankLines = 0;

  const langStats = {
    HTML: { lines: 0, codeLines: 0, commentLines: 0, blankLines: 0, bytes: 0, files: 0 },
    CSS: { lines: 0, codeLines: 0, commentLines: 0, blankLines: 0, bytes: 0, files: 0 },
    JavaScript: { lines: 0, codeLines: 0, commentLines: 0, blankLines: 0, bytes: 0, files: 0 },
    Config: { lines: 0, codeLines: 0, commentLines: 0, blankLines: 0, bytes: 0, files: 0 }
  };

  for (const file of filesToMeasure) {
    const fullPath = path.join(repoPath, file.path);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const analysis = analyzeCode(content, file.lang);

      const data = {
        path: file.path,
        name: path.basename(file.path),
        lang: file.lang,
        category: file.category,
        description: file.desc,
        sizeBytes: stat.size,
        ...analysis
      };

      fileMetrics.push(data);
      totalBytes += stat.size;
      totalLines += analysis.totalLines;
      totalCodeLines += analysis.codeLines;
      totalCommentLines += analysis.commentLines;
      totalBlankLines += analysis.blankLines;

      let group = 'Config';
      if (file.lang === 'HTML') group = 'HTML';
      else if (file.lang === 'CSS') group = 'CSS';
      else if (file.lang === 'JavaScript') group = 'JavaScript';

      langStats[group].lines += analysis.totalLines;
      langStats[group].codeLines += analysis.codeLines;
      langStats[group].commentLines += analysis.commentLines;
      langStats[group].blankLines += analysis.blankLines;
      langStats[group].bytes += stat.size;
      langStats[group].files++;
    }
  }

  let totalImageBytes = 0;
  const imageMetrics = [];
  for (const img of imageAssets) {
    const fullPath = path.join(repoPath, img.path);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      totalImageBytes += stat.size;
      imageMetrics.push({
        path: img.path,
        name: path.basename(img.path),
        description: img.desc,
        sizeBytes: stat.size
      });
    }
  }

  let totalDocBytes = 0;
  const docMetrics = [];
  for (const doc of documentAssets) {
    const fullPath = path.join(repoPath, doc.path);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      totalDocBytes += stat.size;
      docMetrics.push({
        path: doc.path,
        name: path.basename(doc.path),
        description: doc.desc,
        sizeBytes: stat.size
      });
    }
  }

  const result = {
    git: {
      repository: 'https://github.com/umersurti17-svg/final-portfolio.git',
      branch: 'main',
      latestCommit: '48f943fdba38cfb67883c31c9a3e29dcf3e3f499',
      shortCommit: '48f943f',
      commitMessage: 'Upgrade Umer Surti VIP portfolio',
      status: 'Clean / Up to date with origin/main'
    },
    deployment: {
      githubPages: { status: 'Supported', config: '.nojekyll' },
      vercel: { status: 'Supported', config: 'vercel.json' },
      netlify: { status: 'Supported', config: 'netlify.toml' }
    },
    totals: {
      sourceFiles: fileMetrics.length,
      imageFiles: imageMetrics.length,
      docFiles: docMetrics.length,
      allFiles: fileMetrics.length + imageMetrics.length + docMetrics.length,
      sourceBytes: totalBytes,
      imageBytes: totalImageBytes,
      docBytes: totalDocBytes,
      allBytes: totalBytes + totalImageBytes + totalDocBytes,
      lines: totalLines,
      codeLines: totalCodeLines,
      commentLines: totalCommentLines,
      blankLines: totalBlankLines
    },
    languages: langStats,
    files: fileMetrics,
    images: imageMetrics,
    documents: docMetrics
  };

  const outputPath = path.join(repoPath, 'js', 'project-metrics.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('Metrics successfully written to:', outputPath);
  return result;
}

if (require.main === module) {
  generateMetrics();
}

module.exports = { generateMetrics };

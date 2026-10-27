/**
 * ============================================================
 * UMER SURTI — VIP DEVELOPER PORTFOLIO
 * CINEMATIC THREE.JS ENGINE: PARTICLES, LIGHT TRAILS & DEPTH
 * ============================================================
 */

(function () {
  'use strict';

  let scene, camera, renderer, particleSystem, lightTrailsGroup, animationFrameId;
  let isHeroVisible = true;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let trailsData = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initThreeCinematicBg() {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const width = canvas.parentElement.clientWidth || window.innerWidth;
    const height = canvas.parentElement.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup with Realistic Atmospheric Depth
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171310, 0.075); // Atmospheric depth fog fading to Espresso

    camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 2. High Performance WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Multi-Layered Soft Particles (Champagne & Bronze)
    const particleCount = prefersReducedMotion ? 40 : 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color definitions
    const champagneRGB = [216 / 255, 200 / 255, 173 / 255];
    const bronzeRGB = [152 / 255, 112 / 255, 79 / 255];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;     // X
      positions[i + 1] = (Math.random() - 0.5) * 10; // Y
      positions[i + 2] = (Math.random() - 0.5) * 9;  // Z

      const ratio = Math.random();
      colors[i] = champagneRGB[0] * ratio + bronzeRGB[0] * (1 - ratio);
      colors[i + 1] = champagneRGB[1] * ratio + bronzeRGB[1] * (1 - ratio);
      colors[i + 2] = champagneRGB[2] * ratio + bronzeRGB[2] * (1 - ratio);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointTexture = generatePointTexture();
    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: pointTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Subtle Animated Light Trails
    lightTrailsGroup = new THREE.Group();
    scene.add(lightTrailsGroup);

    if (!prefersReducedMotion) {
      initLightTrails();
    }

    // 5. Parallax & Resize Listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize);

    // 6. IntersectionObserver & Tab Visibility (Pause RAF when scrolled out of view or tab hidden)
    if ('IntersectionObserver' in window) {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
            if (isHeroVisible && !document.hidden && !animationFrameId) {
              tick(performance.now());
            }
          });
        }, { threshold: 0.08 });
        observer.observe(heroSection);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else if (isHeroVisible && !animationFrameId) {
        tick(performance.now());
      }
    });

    tick(0);
  }

  // Soft Radial Gradient Canvas Texture
  function generatePointTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(216, 200, 173, 0.75)');
    grad.addColorStop(0.7, 'rgba(152, 112, 79, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
  }

  // Build lightweight flowing light trails using smooth spline curves
  function initLightTrails() {
    const trailCount = 4;
    trailsData = [];

    for (let t = 0; t < trailCount; t++) {
      const points = [];
      const numPoints = 8;
      const baseX = (t - (trailCount - 1) / 2) * 4;

      for (let i = 0; i < numPoints; i++) {
        points.push(new THREE.Vector3(
          baseX + (Math.random() - 0.5) * 2,
          (i / (numPoints - 1) - 0.5) * 12,
          (Math.random() - 0.5) * 3 - 1
        ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(45);
      const trailGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

      // Gradient color along trail
      const colors = new Float32Array(curvePoints.length * 3);
      for (let j = 0; j < curvePoints.length; j++) {
        const pct = j / (curvePoints.length - 1);
        const alpha = Math.sin(pct * Math.PI); // fade at ends
        colors[j * 3] = (0.85 * pct + 0.59 * (1 - pct)) * alpha;     // R
        colors[j * 3 + 1] = (0.78 * pct + 0.44 * (1 - pct)) * alpha; // G
        colors[j * 3 + 2] = (0.68 * pct + 0.31 * (1 - pct)) * alpha; // B
      }
      trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const trailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        linewidth: 1
      });

      const line = new THREE.Line(trailGeometry, trailMaterial);
      lightTrailsGroup.add(line);

      // Clone immutable base positions to prevent cumulative numerical drift
      const basePositions = new Float32Array(trailGeometry.attributes.position.array);

      trailsData.push({
        line: line,
        basePositions: basePositions,
        initialPoints: points,
        speed: 0.0006 + t * 0.0002,
        phase: t * 1.5
      });
    }
  }

  function onMouseMove(e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.9;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.9;
  }

  function onWindowResize() {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas || !renderer || !camera) return;

    const width = canvas.parentElement.clientWidth || window.innerWidth;
    const height = canvas.parentElement.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function tick(timestamp) {
    if (!isHeroVisible) {
      animationFrameId = null;
      return;
    }

    animationFrameId = requestAnimationFrame(tick);

    if (!prefersReducedMotion) {
      // Smooth mouse follow interpolation
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      if (particleSystem) {
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x += 0.0002;
        particleSystem.position.x = mouseX * 0.6;
        particleSystem.position.y = -mouseY * 0.6;
      }

      // Animate gentle waving of light trails relative to immutable base coordinates
      if (trailsData.length > 0) {
        const time = timestamp * 0.001;
        trailsData.forEach((td, idx) => {
          const positions = td.line.geometry.attributes.position.array;
          const count = positions.length / 3;

          for (let p = 0; p < count; p++) {
            const pct = p / (count - 1);
            const wave = Math.sin(time * 0.8 + pct * 4 + td.phase) * 0.28;
            positions[p * 3] = td.basePositions[p * 3] + wave;
          }
          td.line.geometry.attributes.position.needsUpdate = true;
          td.line.rotation.z = Math.sin(time * 0.2 + idx) * 0.04;
        });

        lightTrailsGroup.position.x = mouseX * 0.35;
        lightTrailsGroup.position.y = -mouseY * 0.35;
      }
    }

    renderer.render(scene, camera);
  }

  document.addEventListener('DOMContentLoaded', initThreeCinematicBg);
})();

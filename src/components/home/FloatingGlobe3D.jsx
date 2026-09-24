import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const GLOBE_SERVICES = [
  { key: 'platform', label: 'Platform & Storefront', color: '#4A9B6F', icon: '🌐',
    headline: 'Your branded platform — live in days.',
    desc: 'White-label patient portal, HIPAA-compliant intake, Stripe checkout, and SEO-ready architecture — deployed and live under your domain.',
    stats: ['HIPAA compliant', 'US-hosted', 'Stripe rails', 'SEO-ready'] },
  { key: 'providers', label: 'US-Licensed Providers', color: '#2D6A9F', icon: '⚕️',
    headline: 'Board-certified physicians — all 50 states.',
    desc: 'Multi-state DEA-licensed prescribing, e-prescribing via US-certified EMR, connected to NABP-verified pharmacies.',
    stats: ['DEA-licensed', '50-state coverage', 'Board-certified', 'EMR integrated'] },
  { key: 'pharmacy', label: '503A Pharmacy Network', color: '#7B5EA7', icon: '💊',
    headline: 'NABP-verified US pharmacies — fulfilled.',
    desc: 'Automated routing to US-licensed compounding pharmacies. State board compliant, audit-ready, nationwide.',
    stats: ['NABP-verified', '503A compounding', 'Auto-routing', 'Audit-ready'] },
  { key: 'compliance', label: 'HIPAA Compliance', color: '#B85C38', icon: '🛡️',
    headline: 'Compliance built in — not bolted on.',
    desc: 'BAA management, state law monitoring, FTC/FDA ad compliance, LegitScript certification process, audit-ready documentation.',
    stats: ['BAA managed', 'FTC/FDA compliant', 'LegitScript ready', 'Audit-ready'] },
  { key: 'payments', label: 'Payment Processing', color: '#0B8B7A', icon: '💳',
    headline: 'High-risk processing — handled.',
    desc: 'US merchant accounts for telehealth, Stripe integration, subscription billing, and high-risk processing support.',
    stats: ['US merchant acct', 'Stripe integrated', 'Subscription billing', 'High-risk OK'] },
  { key: 'marketing', label: 'Marketing & Growth', color: '#D4A537', icon: '📈',
    headline: 'Reach patients — the compliant way.',
    desc: 'LegitScript-certified ad framework, FTC-compliant copy, TCPA-ready SMS, CAN-SPAM email, and social media automation.',
    stats: ['LegitScript certified', 'FTC-compliant', 'TCPA-ready', 'Auto-posting'] },
];

function createGlowTexture(hexColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gradient.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export default function FloatingGlobe3D({ activeIndex, onServiceClick }) {
  const mountRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);
  const onServiceClickRef = useRef(onServiceClick);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { onServiceClickRef.current = onServiceClick; }, [onServiceClick]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 400;
    let height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Globe group ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    const globeRadius = 1.5;

    // Dot-matrix globe
    const dotCount = 2500;
    const positions = [];
    const colors = [];
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dotCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      positions.push(x * globeRadius, y * globeRadius, z * globeRadius);
      const noise = Math.sin(x * 3) * Math.cos(y * 2) + Math.sin(z * 4);
      if (noise > 0.15) {
        colors.push(0.29, 0.61, 0.44);
      } else {
        colors.push(0.1, 0.18, 0.12);
      }
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    dotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const dotsMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true });
    globeGroup.add(new THREE.Points(dotsGeo, dotsMat));

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(globeRadius * 0.99, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4A9B6F, wireframe: true, transparent: true, opacity: 0.06 });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(globeRadius * 1.2, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x4A9B6F) } },
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 glowColor; varying vec3 vNormal; void main() { float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0); gl_FragColor = vec4(glowColor, 1.0) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    globeGroup.add(new THREE.Mesh(atmGeo, atmMat));

    // Holographic rings
    const ring1Geo = new THREE.TorusGeometry(globeRadius * 1.35, 0.008, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x4A9B6F, transparent: true, opacity: 0.25 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    globeGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(globeRadius * 1.5, 0.005, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x2D6A9F, transparent: true, opacity: 0.15 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.2;
    ring2.rotation.z = 0.3;
    globeGroup.add(ring2);

    // ── Service nodes ──
    const serviceNodes = [];
    const connectionLines = [];
    GLOBE_SERVICES.forEach((service, i) => {
      const orbitRadius = 2.3 + (i % 2) * 0.35;
      const orbitSpeed = 0.12 + i * 0.02;
      const orbitOffset = (i / GLOBE_SERVICES.length) * Math.PI * 2;
      const tiltY = (i - GLOBE_SERVICES.length / 2) * 0.12;

      const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(service.color) });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.userData = { orbitRadius, orbitSpeed, orbitOffset, tiltY, index: i };
      scene.add(node);
      serviceNodes.push(node);

      // Glow sprite
      const spriteMat = new THREE.SpriteMaterial({ map: createGlowTexture(service.color), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.6 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.5, 0.5, 1);
      node.add(sprite);

      // Connection line to globe center
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(service.color), transparent: true, opacity: 0.15 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      connectionLines.push({ line, node });
    });

    // ── Starfield ──
    const starCount = 1200;
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
      const r = 20 + Math.random() * 30;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      starPositions.push(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Interaction ──
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    const onPointerDown = (x, y) => { isDragging = true; lastMouse = { x, y }; };
    const onPointerMove = (x, y) => {
      if (!isDragging) return;
      targetRot.y += (x - lastMouse.x) * 0.005;
      targetRot.x += (y - lastMouse.y) * 0.005;
      targetRot.x = Math.max(-0.8, Math.min(0.8, targetRot.x));
      lastMouse = { x, y };
    };
    const onPointerUp = () => { isDragging = false; };

    const mdHandler = (e) => onPointerDown(e.clientX, e.clientY);
    const mmHandler = (e) => onPointerMove(e.clientX, e.clientY);
    const muHandler = () => onPointerUp();
    const tsHandler = (e) => { if (e.touches[0]) onPointerDown(e.touches[0].clientX, e.touches[0].clientY); };
    const tmHandler = (e) => { if (e.touches[0]) onPointerMove(e.touches[0].clientX, e.touches[0].clientY); };
    const teHandler = () => onPointerUp();

    renderer.domElement.addEventListener('mousedown', mdHandler);
    window.addEventListener('mousemove', mmHandler);
    window.addEventListener('mouseup', muHandler);
    renderer.domElement.addEventListener('touchstart', tsHandler, { passive: true });
    window.addEventListener('touchmove', tmHandler, { passive: true });
    window.addEventListener('touchend', teHandler);

    // Raycaster for node clicks
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    const clickHandler = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(serviceNodes);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        if (onServiceClickRef.current) onServiceClickRef.current(idx);
      }
    };
    renderer.domElement.addEventListener('click', clickHandler);

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ──
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) targetRot.y += 0.002;
      currentRot.x += (targetRot.x - currentRot.x) * 0.05;
      currentRot.y += (targetRot.y - currentRot.y) * 0.05;
      globeGroup.rotation.x = currentRot.x;
      globeGroup.rotation.y = currentRot.y;

      const t = Date.now() * 0.001;
      serviceNodes.forEach((node, i) => {
        const ud = node.userData;
        const angle = t * ud.orbitSpeed + ud.orbitOffset;
        node.position.x = Math.cos(angle) * ud.orbitRadius;
        node.position.z = Math.sin(angle) * ud.orbitRadius;
        node.position.y = Math.sin(angle * 0.5) * 0.4 + ud.tiltY;
        const isActive = i === activeIndexRef.current;
        const targetScale = isActive ? 2 : 1;
        node.scale.x += (targetScale - node.scale.x) * 0.1;
        node.scale.y += (targetScale - node.scale.y) * 0.1;
        node.scale.z += (targetScale - node.scale.z) * 0.1;
        if (node.children[0]) {
          node.children[0].material.opacity = isActive ? 0.9 : 0.5;
        }
      });

      connectionLines.forEach(({ line, node }) => {
        const pos = line.geometry.attributes.position.array;
        pos[0] = 0; pos[1] = 0; pos[2] = 0;
        pos[3] = node.position.x; pos[4] = node.position.y; pos[5] = node.position.z;
        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', mmHandler);
      window.removeEventListener('mouseup', muHandler);
      window.removeEventListener('touchmove', tmHandler);
      window.removeEventListener('touchend', teHandler);
      renderer.domElement.removeEventListener('mousedown', mdHandler);
      renderer.domElement.removeEventListener('touchstart', tsHandler);
      renderer.domElement.removeEventListener('click', clickHandler);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
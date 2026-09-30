import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// ── Structure generators ──────────────────────────────────────────────────
function genPeptide(residues = 16) {
  const atoms = [];
  const bonds = [];
  const r = 1.0;
  const pitch = 0.5;
  for (let i = 0; i < residues; i++) {
    const angle = (i / 3.6) * Math.PI * 2;
    const y = (i - residues / 2) * pitch;
    atoms.push({ pos: [Math.cos(angle) * r, y, Math.sin(angle) * r], color: '#0B8B7A', radius: 0.28 });
    if (i > 0) bonds.push([atoms.length - 2, atoms.length - 1]);
    const sa = angle + Math.PI / 3;
    atoms.push({ pos: [Math.cos(sa) * (r + 0.5), y + 0.05, Math.sin(sa) * (r + 0.5)], color: '#3050F8', radius: 0.18 });
    bonds.push([atoms.length - 2, atoms.length - 1]);
  }
  return { atoms, bonds };
}

function genSteroid() {
  const atoms = [];
  const bonds = [];
  const r = 0.4;
  function ring(cx, cy, sides) {
    const start = atoms.length;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      atoms.push({ pos: [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0], color: '#555', radius: 0.22 });
    }
    for (let i = 0; i < sides; i++) bonds.push([start + i, start + (i + 1) % sides]);
    return start;
  }
  function connect2(startA, countA, startB, countB) {
    const pairs = [];
    for (let i = 0; i < countA; i++) {
      for (let j = 0; j < countB; j++) {
        const d = Math.hypot(
          atoms[startA + i].pos[0] - atoms[startB + j].pos[0],
          atoms[startA + i].pos[1] - atoms[startB + j].pos[1]
        );
        pairs.push({ i, j, d });
      }
    }
    pairs.sort((a, b) => a.d - b.d);
    const used = new Set();
    let added = 0;
    for (const p of pairs) {
      if (used.has(p.i) || used.has(p.j)) continue;
      bonds.push([startA + p.i, startB + p.j]);
      used.add(p.i); used.add(p.j);
      added++;
      if (added >= 2) break;
    }
  }
  const r3 = r * Math.sqrt(3);
  const aStart = ring(-r3 * 0.87, -r * 0.5, 6);
  const bStart = ring(-r3 * 0.87 + r * 1.5, r * 0.366, 6);
  const cStart = ring(-r3 * 0.87 + r * 1.5, r * 0.366 + r3, 6);
  const dStart = ring(-r3 * 0.87 + r * 3.0, r * 0.366 + r3 + r * 0.5, 5);
  connect2(aStart, 6, bStart, 6);
  connect2(bStart, 6, cStart, 6);
  connect2(cStart, 6, dStart, 5);
  // Functional groups (OH, =O)
  atoms.push({ pos: [r * 2.5, r * 0.366 + r3 + r * 1.2, 0.2], color: '#FF2020', radius: 0.16 });
  bonds.push([dStart + 1, atoms.length - 1]);
  atoms.push({ pos: [-r3 * 0.87 - r * 0.5, -r * 1.3, 0.2], color: '#FF2020', radius: 0.16 });
  bonds.push([aStart + 5, atoms.length - 1]);
  return { atoms, bonds };
}

function genDinucleotide() {
  const atoms = [];
  const bonds = [];
  function ringCluster(cx, cy, cz, color) {
    const start = atoms.length;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      atoms.push({ pos: [cx + Math.cos(a) * 0.4, cy + Math.sin(a) * 0.4, cz], color, radius: 0.22 });
    }
    for (let i = 0; i < 6; i++) bonds.push([start + i, start + (i + 1) % 6]);
    return start;
  }
  const c1 = ringCluster(-1.0, 0, 0, '#0B8B7A');
  const c2 = ringCluster(1.0, 0, 0, '#FF2020');
  atoms.push({ pos: [-0.5, 0.3, 0.2], color: '#3050F8', radius: 0.18 });
  atoms.push({ pos: [0.5, 0.3, 0.2], color: '#3050F8', radius: 0.18 });
  bonds.push([c1 + 2, atoms.length - 2]);
  bonds.push([atoms.length - 2, atoms.length - 1]);
  bonds.push([atoms.length - 1, c2 + 5]);
  return { atoms, bonds };
}

function genCluster(n = 10) {
  const atoms = [];
  const bonds = [];
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 0.8;
    atoms.push({
      pos: [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
      color: i % 3 === 0 ? '#0B8B7A' : i % 3 === 1 ? '#3050F8' : '#FF2020',
      radius: 0.25,
    });
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(
        atoms[i].pos[0] - atoms[j].pos[0],
        atoms[i].pos[1] - atoms[j].pos[1],
        atoms[i].pos[2] - atoms[j].pos[2]
      );
      if (d < 1.3) bonds.push([i, j]);
    }
  }
  return { atoms, bonds };
}

const STRUCTURE_MAP = {
  semaglutide: 'peptide', tirzepatide: 'peptide', retatrutide: 'peptide',
  bpc157: 'peptide', epitalon: 'peptide',
  nad_plus: 'dinucleotide',
  trt: 'steroid', enclomiphene: 'steroid', bhrt: 'steroid',
};

export default function MoleculeViewer3D({ productId, accentColor = '#0B8B7A' }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 3, 5);
    scene.add(dir);
    const accentHex = parseInt(accentColor.slice(1), 16);
    const point = new THREE.PointLight(accentHex, 0.6, 10);
    point.position.set(-2, 2, 3);
    scene.add(point);

    // Generate molecule
    const type = STRUCTURE_MAP[productId] || 'cluster';
    const mol = type === 'peptide' ? genPeptide(16)
      : type === 'steroid' ? genSteroid()
      : type === 'dinucleotide' ? genDinucleotide()
      : genCluster(10);

    const group = new THREE.Group();
    const disposables = [];

    mol.atoms.forEach((atom) => {
      const geo = new THREE.SphereGeometry(atom.radius, 24, 24);
      const mat = new THREE.MeshPhongMaterial({ color: atom.color, shininess: 80 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...atom.pos);
      group.add(mesh);
      disposables.push(geo, mat);
    });

    const up = new THREE.Vector3(0, 1, 0);
    mol.bonds.forEach(([a, b]) => {
      const posA = new THREE.Vector3(...mol.atoms[a].pos);
      const posB = new THREE.Vector3(...mol.atoms[b].pos);
      const dist = posA.distanceTo(posB);
      const mid = posA.clone().add(posB).multiplyScalar(0.5);
      const geo = new THREE.CylinderGeometry(0.05, 0.05, dist, 8);
      const mat = new THREE.MeshPhongMaterial({ color: 0x999999, shininess: 40 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(mid);
      const dirVec = posB.clone().sub(posA).normalize();
      mesh.quaternion.setFromUnitVectors(up, dirVec);
      group.add(mesh);
      disposables.push(geo, mat);
    });

    // Center and scale
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.1);
    const scale = 3.0 / maxDim;
    group.scale.setScalar(scale);
    group.position.copy(center).multiplyScalar(-scale);
    scene.add(group);
    setLoading(false);

    // Interaction
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let velX = 0, velY = 0;
    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; };
    const onMove = (x, y) => {
      if (!isDragging) return;
      velY = (x - prevX) * 0.01;
      velX = (y - prevY) * 0.01;
      prevX = x; prevY = y;
    };
    const onUp = () => { isDragging = false; };
    const md = (e) => onDown(e.clientX, e.clientY);
    const mm = (e) => onMove(e.clientX, e.clientY);
    const mu = () => onUp();
    const ts = (e) => onDown(e.touches[0].clientX, e.touches[0].clientY);
    const tm = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const te = () => onUp();

    renderer.domElement.addEventListener('mousedown', md);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    renderer.domElement.addEventListener('touchstart', ts);
    renderer.domElement.addEventListener('touchmove', tm);
    renderer.domElement.addEventListener('touchend', te);

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.005 + velY;
      group.rotation.x += 0.002 + velX;
      velX *= 0.92;
      velY *= 0.92;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth || 400;
      const h = mount.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      renderer.domElement.removeEventListener('mousedown', md);
      renderer.domElement.removeEventListener('touchstart', ts);
      renderer.domElement.removeEventListener('touchmove', tm);
      renderer.domElement.removeEventListener('touchend', te);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [productId, accentColor]);

  return (
    <div className="relative w-full h-[320px] lg:h-[400px] bg-gradient-to-br from-gray-50 via-white to-[#F0F7F5] rounded-2xl overflow-hidden border border-gray-100">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0B8B7A] rounded-full animate-spin" />
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        3D Molecular Structure · Drag to rotate
      </div>
    </div>
  );
}
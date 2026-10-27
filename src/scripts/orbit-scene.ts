import * as THREE from 'three';

/** Mounts the demo scene on `canvas`. Returns a cleanup function. */
export function startOrbitScene(canvas: HTMLCanvasElement): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;

  // Central wireframe icosahedron.
  const shape = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 1),
    new THREE.MeshBasicMaterial({ color: accent || '#2f6fde', wireframe: true }),
  );
  scene.add(shape);

  // Particle shell around it.
  const COUNT = 1500;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.set(
      [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
      i * 3,
    );
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: accent || '#2f6fde', size: 0.03, transparent: true, opacity: 0.7 }),
  );
  scene.add(particles);

  // Pointer position in [-1, 1], eased toward each frame.
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let last = performance.now();
  renderer.setAnimationLoop((now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const spin = reduceMotion ? 0 : dt;

    shape.rotation.x += spin * 0.25;
    shape.rotation.y += spin * 0.35;
    particles.rotation.y += spin * 0.05;

    eased.x += (pointer.x - eased.x) * 0.05;
    eased.y += (pointer.y - eased.y) * 0.05;
    camera.position.x = eased.x * 1.5;
    camera.position.y = -eased.y * 1.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener('pointermove', onPointerMove);
    resizeObserver.disconnect();
    shape.geometry.dispose();
    (shape.material as THREE.Material).dispose();
    particleGeometry.dispose();
    (particles.material as THREE.Material).dispose();
    renderer.dispose();
  };
}

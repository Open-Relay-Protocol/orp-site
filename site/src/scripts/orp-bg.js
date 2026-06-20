/**
 * ORP atmospheric background.
 *
 * A slow, cinematic backdrop inspired by the reference art: a deep indigo
 * storm, monolith slabs floating at depth with thin neon edges, a pulsing
 * network-line constellation, and drifting dust. It renders behind all page
 * content (fixed, pointer-events: none) and reacts gently to pointer + scroll.
 *
 * Kept deliberately light: no post-processing, emissive edges and additive
 * particles carry the glow. Mobile/low-power devices get reduced counts and a
 * capped pixel ratio; reduced-motion renders a single static frame.
 */
import * as THREE from "three";

const PALETTE = {
  fog: 0x0a0c18,
  slab: 0x0b0e1c,
  teal: 0x38e0d0,
  violet: 0x9a7bff,
  magenta: 0xc879f9,
};

export function initOrpBackground(container) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = coarse || window.innerWidth < 768;
  const lowPower =
    isMobile ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !lowPower,
      alpha: true, // let the CSS sky gradient show through
      powerPreference: "high-performance",
    });
  } catch (e) {
    return null; // CSS gradient remains as the backdrop
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText =
    "display:block;width:100%;height:100%;";

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(PALETTE.fog, 0.018);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    260,
  );
  camera.position.set(0, 1.5, 16);

  // ---- Lighting ---------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x2a2350, 0.7));
  const violetLight = new THREE.PointLight(PALETTE.violet, 220, 160);
  violetLight.position.set(-14, 22, 6);
  scene.add(violetLight);
  const tealLight = new THREE.PointLight(PALETTE.teal, 120, 150);
  tealLight.position.set(20, -6, -10);
  scene.add(tealLight);

  // ---- Monolith slabs ---------------------------------------------------
  // Thin black slabs scattered through depth, each with a faint neon edge.
  const slabCount = lowPower ? 12 : 22;
  const slabs = [];
  const slabMat = new THREE.MeshStandardMaterial({
    color: PALETTE.slab,
    metalness: 0.4,
    roughness: 0.65,
    flatShading: true,
  });
  const edgeColors = [PALETTE.teal, PALETTE.violet, PALETTE.magenta];

  for (let i = 0; i < slabCount; i++) {
    const w = 0.5 + Math.random() * 2.2;
    const h = 3 + Math.random() * 9;
    const d = 0.12 + Math.random() * 0.3;
    const geo = new THREE.BoxGeometry(w, h, d);
    const slab = new THREE.Mesh(geo, slabMat);

    // bias slabs toward the sides so the centre stays open for content
    const side = Math.random() < 0.5 ? -1 : 1;
    slab.position.set(
      side * (6 + Math.random() * 26),
      -8 + Math.random() * 22,
      -8 - Math.random() * 90,
    );
    slab.rotation.set(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.5,
    );

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({
        color: edgeColors[i % edgeColors.length],
        transparent: true,
        opacity: 0.28,
      }),
    );
    slab.add(edges);

    slab.userData = {
      bobAmp: 0.3 + Math.random() * 0.8,
      bobSpeed: 0.15 + Math.random() * 0.35,
      bobPhase: Math.random() * Math.PI * 2,
      baseY: slab.position.y,
      rotSpeed: (Math.random() - 0.5) * 0.06,
      edge: edges.material,
      edgeBase: 0.18 + Math.random() * 0.22,
    };
    slabs.push(slab);
    scene.add(slab);
  }

  // ---- Network-line constellation --------------------------------------
  // A handful of nodes connected to their nearest neighbours, gently pulsing.
  const nodeCount = lowPower ? 16 : 30;
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 34,
        -10 - Math.random() * 70,
      ),
    );
  }
  const linePositions = [];
  for (let i = 0; i < nodes.length; i++) {
    // connect each node to its 2 nearest neighbours
    const dists = nodes
      .map((n, j) => ({ j, d: nodes[i].distanceTo(n) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { j } of dists) {
      linePositions.push(
        nodes[i].x, nodes[i].y, nodes[i].z,
        nodes[j].x, nodes[j].y, nodes[j].z,
      );
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );
  const lineMat = new THREE.LineBasicMaterial({
    color: PALETTE.violet,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const network = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(network);

  // glowing node points
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      nodes.flatMap((n) => [n.x, n.y, n.z]),
      3,
    ),
  );
  const nodeMat = new THREE.PointsMaterial({
    color: PALETTE.teal,
    size: 0.5,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(nodeGeo, nodeMat));

  // ---- Drifting dust ----------------------------------------------------
  const dustCount = lowPower ? 260 : 600;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 90;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    dustPos[i * 3 + 2] = -Math.random() * 110;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xbfc8ff,
    size: 0.13,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ---- Interaction (pointer + scroll parallax) -------------------------
  const target = { x: 0, y: 0 };
  function onPointerMove(e) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  if (!isMobile && !reduceMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }
  let scrollN = 0;
  function onScroll() {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollN = Math.min(1, window.scrollY / max);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Loop / lifecycle -------------------------------------------------
  const clock = new THREE.Clock();
  let running = true;
  let rafId = 0;

  function render() {
    const t = clock.elapsedTime;

    // camera easing: idle drift + pointer parallax + scroll depth
    const driftX = Math.sin(t * 0.05) * 1.2;
    const driftY = Math.cos(t * 0.07) * 0.8;
    const camX = driftX + target.x * 3.2;
    const camY = 1.5 + driftY + target.y * -1.6 - scrollN * 4;
    camera.position.x += (camX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z = 16 - scrollN * 6;
    camera.lookAt(0, 0.5 - scrollN * 2, -30);

    for (const s of slabs) {
      const u = s.userData;
      s.position.y = u.baseY + Math.sin(t * u.bobSpeed + u.bobPhase) * u.bobAmp;
      s.rotation.y += u.rotSpeed * 0.01;
      u.edge.opacity =
        u.edgeBase + Math.sin(t * 0.6 + u.bobPhase) * 0.12;
    }

    network.material.opacity = 0.16 + (Math.sin(t * 0.5) + 1) * 0.06;
    dust.rotation.y = t * 0.01;
    dust.position.x = Math.sin(t * 0.04) * 4;

    renderer.render(scene, camera);
  }

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    clock.getDelta();
    render();
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  function onVisibility() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      clock.start();
      frame();
    }
  }
  document.addEventListener("visibilitychange", onVisibility);

  if (reduceMotion) {
    render(); // single static frame
  } else {
    frame();
  }

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

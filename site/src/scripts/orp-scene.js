/**
 * ORP blind-broker visualization.
 *
 * Two devices share one key bound to one rendezvous target. They exchange
 * sealed payloads through the board (the rendezvous server). The scene makes
 * the central invariant tangible: toggle "the board's view" and everything the
 * board cannot read collapses to opaque tags and sealed blobs, while the
 * routing tag (frame_kind) it *does* read stays visible.
 *
 * Faithful to the docs:
 *   - one key, one target            (overview.mdx)
 *   - presence / intent / match frames + frame_kind routing tag (protocol.mdx)
 *   - KEY -> OFFER -> ANSWER phases, then a direct P2P channel   (protocol.mdx)
 *   - the board sees the social graph but not contents           (blindness.mdx)
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const COLORS = {
  bg: 0x0a0c18,
  cobalt: 0x2f74e6,
  cobaltDeep: 0x0e62cc,
  gold: 0xffcc66, // KEY
  violet: 0xa78bfa, // sealed payloads (offer / answer)
  cyan: 0x38e0d0, // board scan / routing tag
  green: 0x4ade80, // established P2P channel
  gray: 0x5b6678,
};

// Phase script. Each phase drives which packets spawn and the caption.
const PHASES = [
  {
    id: "KEY",
    label: "KEY",
    caption:
      "Both devices already hold one shared key bound to one target. They announce presence as opaque tags.",
    truth: "presence",
    sealedTruth: "PRESENCE · tag",
    frameKind: "presence",
    dir: "both",
    color: COLORS.gold,
  },
  {
    id: "OFFER",
    label: "OFFER",
    caption:
      "Device A's WebRTC offer (SDP/ICE) is sealed, then relayed through the board. The board forwards bytes it cannot open.",
    truth: "OFFER · SDP m=audio…",
    sealedTruth: "SEALED · match",
    frameKind: "match",
    dir: "ab",
    color: COLORS.violet,
  },
  {
    id: "ANSWER",
    label: "ANSWER",
    caption:
      "Device B seals its answer and sends it back. Same blind relay: the board routes on the tag, never the contents.",
    truth: "ANSWER · SDP a=ice…",
    sealedTruth: "SEALED · match",
    frameKind: "match",
    dir: "ba",
    color: COLORS.violet,
  },
  {
    id: "CONNECTED",
    label: "CONNECTED",
    caption:
      "The peers open a direct channel. The board brokered the meeting and is now blind to the conversation entirely.",
    truth: "direct P2P channel",
    sealedTruth: "— off-board —",
    frameKind: "—",
    dir: "direct",
    color: COLORS.green,
  },
];

// Sprite world-size multiplier. Bumped on mobile, where the camera sits
// further back (to fit the scene), so labels stay legible.
let labelBoost = 1;

function makeLabelSprite(text, { color = "#e3e9f2", scale = 1 } = {}) {
  const pad = 24;
  const font = 600 + "";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const fontSpec = `${font} 44px -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`;
  ctx.font = fontSpec;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = 88;
  canvas.width = w;
  canvas.height = h;
  ctx.font = fontSpec;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  // pill background
  ctx.fillStyle = "rgba(12,20,34,0.82)";
  roundRect(ctx, 1, 1, w - 2, h - 2, 18);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(95,110,135,0.5)";
  roundRect(ctx, 1, 1, w - 2, h - 2, 18);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, pad, h / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  const s = 0.0042 * scale * labelBoost;
  sprite.scale.set(w * s, h * s, 1);
  sprite.userData.dispose = () => {
    tex.dispose();
    mat.dispose();
  };
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function initOrpScene(container, hud = {}) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Mobile / low-power detection. Coarse pointers and small viewports get a
  // lighter pipeline (no bloom, capped pixel ratio) and bigger labels.
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = coarse || window.innerWidth < 768;
  const lowPower =
    isMobile ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  labelBoost = isMobile ? 1.6 : 1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 16, 34);

  const camera = new THREE.PerspectiveCamera(
    46,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    100,
  );
  camera.position.set(0, 4.2, 13.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    return null; // caller keeps the SVG fallback visible
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  // Let vertical swipes scroll the page; only horizontal drags orbit. Without
  // this the canvas would trap touch scrolling on mobile.
  renderer.domElement.style.touchAction = "pan-y";
  renderer.domElement.setAttribute("aria-hidden", "true");

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = !isMobile; // avoid hijacking pinch-to-zoom on phones
  controls.minDistance = 9;
  controls.maxDistance = 34;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.45;
  controls.target.set(0, -0.2, 0);

  // Lighting
  scene.add(new THREE.AmbientLight(0x6f86b8, 0.9));
  const key = new THREE.DirectionalLight(0xcfe0fb, 1.1);
  key.position.set(5, 9, 8);
  scene.add(key);
  const rim = new THREE.PointLight(COLORS.cobalt, 60, 40);
  rim.position.set(0, 5, -6);
  scene.add(rim);

  // ---- Node geometry ----------------------------------------------------
  const POS = {
    A: new THREE.Vector3(-6.2, 0, 0),
    BOARD: new THREE.Vector3(0, 0.4, 0),
    B: new THREE.Vector3(6.2, 0, 0),
  };

  function makeDevice(position, accent) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshStandardMaterial({
        color: 0x16243c,
        emissive: accent,
        emissiveIntensity: 0.45,
        metalness: 0.5,
        roughness: 0.35,
        flatShading: true,
      }),
    );
    g.add(body);
    const halo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      }),
    );
    g.add(halo);
    g.position.copy(position);
    g.userData.body = body;
    g.userData.halo = halo;
    scene.add(g);
    return g;
  }

  const deviceA = makeDevice(POS.A, COLORS.cobalt);
  const deviceB = makeDevice(POS.B, COLORS.cobalt);

  // The board: an octahedron cage. Deliberately "empty" — it holds no contents.
  const board = new THREE.Group();
  const boardCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.05, 0),
    new THREE.MeshStandardMaterial({
      color: 0x223049,
      emissive: COLORS.gray,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.4,
      flatShading: true,
    }),
  );
  board.add(boardCore);
  const boardCage = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.55, 0),
    new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
    }),
  );
  board.add(boardCage);
  board.position.copy(POS.BOARD);
  scene.add(board);

  // Scan ring: pulses when the board inspects a passing frame's routing tag.
  const scanRing = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 1.78, 48),
    new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
  );
  scanRing.position.copy(POS.BOARD);
  scene.add(scanRing);
  let scanPulse = 0;

  // ---- Node labels ------------------------------------------------------
  const labelA = makeLabelSprite("Device A", { color: "#cfe0fb" });
  labelA.position.set(POS.A.x, -2, 0);
  scene.add(labelA);
  const labelB = makeLabelSprite("Device B", { color: "#cfe0fb" });
  labelB.position.set(POS.B.x, -2, 0);
  scene.add(labelB);
  const labelBoard = makeLabelSprite("Blind board", { color: "#9aa6bd" });
  labelBoard.position.set(0, -2.1, 0);
  scene.add(labelBoard);
  // routing tag the board legitimately reads — stays visible in board view.
  const labelKind = makeLabelSprite("frame_kind: —", {
    color: "#7ff0e4",
    scale: 0.82,
  });
  labelKind.position.set(0, 2.5, 0);
  scene.add(labelKind);

  // The "one key, one target" tether between the two devices.
  const keyCurve = new THREE.QuadraticBezierCurve3(
    POS.A.clone().add(new THREE.Vector3(0, -0.2, 0)),
    new THREE.Vector3(0, -3.4, 0),
    POS.B.clone().add(new THREE.Vector3(0, -0.2, 0)),
  );
  const keyLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(keyCurve.getPoints(40)),
    new THREE.LineDashedMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.4,
      dashSize: 0.3,
      gapSize: 0.22,
    }),
  );
  keyLine.computeLineDistances();
  scene.add(keyLine);
  const keyLabel = makeLabelSprite("one key · one target", {
    color: "#ffd98a",
    scale: 0.78,
  });
  keyLabel.position.set(0, -3.9, 0);
  scene.add(keyLabel);

  // Direct P2P channel (revealed in CONNECTED phase).
  const p2pCurve = new THREE.QuadraticBezierCurve3(
    POS.A.clone().add(new THREE.Vector3(0, 0.2, 0)),
    new THREE.Vector3(0, 3.6, -0.2),
    POS.B.clone().add(new THREE.Vector3(0, 0.2, 0)),
  );
  const p2pLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(p2pCurve.getPoints(50)),
    new THREE.LineBasicMaterial({
      color: COLORS.green,
      transparent: true,
      opacity: 0,
    }),
  );
  scene.add(p2pLine);

  // ---- Flow paths (device -> board -> device) ---------------------------
  function flowCurve(from, to, lift, z) {
    return new THREE.CatmullRomCurve3([
      from.clone(),
      from.clone().lerp(POS.BOARD, 0.5).add(new THREE.Vector3(0, lift, z)),
      POS.BOARD.clone().add(new THREE.Vector3(0, 0.2, z * 0.4)),
      POS.BOARD.clone().lerp(to, 0.5).add(new THREE.Vector3(0, lift, z)),
      to.clone(),
    ]);
  }
  const curveAB = flowCurve(POS.A, POS.B, 1.7, 0.7);
  const curveBA = flowCurve(POS.B, POS.A, 1.7, -0.7);

  // faint guide tubes for the two relay lanes
  for (const c of [curveAB, curveBA]) {
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(c, 60, 0.02, 6, false),
      new THREE.MeshBasicMaterial({
        color: COLORS.cobalt,
        transparent: true,
        opacity: 0.12,
      }),
    );
    scene.add(tube);
  }

  // ---- Packets ----------------------------------------------------------
  const packets = [];
  const packetGeo = new THREE.BoxGeometry(0.34, 0.34, 0.34);
  const tagGeo = new THREE.IcosahedronGeometry(0.2, 0);

  let boardView = false;

  function spawnPacket(curve, color, phase, sealed) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(sealed ? packetGeo : tagGeo, mat);
    scene.add(mesh);

    let cage = null;
    if (sealed) {
      // lock cage signals "sealed to the board".
      cage = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        }),
      );
      mesh.add(cage);
    }

    const label = makeLabelSprite(
      boardView ? phase.sealedTruth : phase.truth,
      { color: sealed ? "#d8c9ff" : "#bcd4f5", scale: 0.74 },
    );
    mesh.add(label);
    label.position.set(0, 0.7, 0);

    packets.push({
      mesh,
      cage,
      label,
      curve,
      color,
      sealed,
      phase,
      t: 0,
      speed: reduceMotion ? 0 : 0.16 + Math.random() * 0.04,
      scanned: false,
    });
  }

  function refreshPacketLabels() {
    for (const p of packets) {
      const text = boardView ? p.phase.sealedTruth : p.phase.truth;
      const color = p.sealed ? "#d8c9ff" : "#bcd4f5";
      p.mesh.remove(p.label);
      p.label.userData.dispose?.();
      const next = makeLabelSprite(text, { color, scale: 0.74 });
      next.position.set(0, 0.7, 0);
      p.mesh.add(next);
      p.label = next;
    }
  }

  function disposePacket(p) {
    scene.remove(p.mesh);
    p.label.userData.dispose?.();
    // packetGeo / tagGeo are shared; only per-packet geometry is disposed.
    if (p.mesh.geometry !== packetGeo && p.mesh.geometry !== tagGeo) {
      p.mesh.geometry.dispose();
    }
    p.mesh.material.dispose();
    if (p.cage) {
      p.cage.geometry.dispose();
      p.cage.material.dispose();
    }
  }

  // ---- Phase orchestration ---------------------------------------------
  let phaseIndex = 0;
  let phaseTimer = 0;
  const PHASE_SECONDS = 4.4;

  function applyPhase(i) {
    phaseIndex = ((i % PHASES.length) + PHASES.length) % PHASES.length;
    const phase = PHASES[phaseIndex];
    // clear in-flight packets
    for (const p of packets) disposePacket(p);
    packets.length = 0;

    if (phase.id === "KEY") {
      spawnPacket(curveAB, COLORS.gold, phase, false);
      spawnPacket(curveBA, COLORS.gold, phase, false);
    } else if (phase.id === "OFFER") {
      spawnPacket(curveAB, COLORS.violet, phase, true);
    } else if (phase.id === "ANSWER") {
      spawnPacket(curveBA, COLORS.violet, phase, true);
    }
    // CONNECTED spawns no relay packets; the P2P line lights up instead.

    updateKindLabel(phase.frameKind);
    hud.onPhase?.(phaseIndex, phase);
    phaseTimer = 0;
  }

  // small indirection so updateKindLabel can replace the sprite reference
  const labelKindRef = { current: labelKind };
  function updateKindLabel(kind) {
    const old = labelKindRef.current;
    const next = makeLabelSprite(`frame_kind: ${kind}`, {
      color: "#7ff0e4",
      scale: 0.82,
    });
    next.position.copy(old.position);
    scene.add(next);
    scene.remove(old);
    old.userData.dispose?.();
    labelKindRef.current = next;
  }

  // ---- Board view toggle ------------------------------------------------
  function setBoardView(on) {
    boardView = on;
    // Devices become anonymous opaque tags; the board cannot identify them.
    setDeviceLabel(labelARef, on ? "tag · 9f3a…c2" : "Device A");
    setDeviceLabel(labelBRef, on ? "tag · 71be…04" : "Device B");
    deviceA.userData.body.material.emissiveIntensity = on ? 0.12 : 0.45;
    deviceB.userData.body.material.emissiveIntensity = on ? 0.12 : 0.45;
    deviceA.userData.halo.material.opacity = on ? 0.03 : 0.08;
    deviceB.userData.halo.material.opacity = on ? 0.03 : 0.08;
    keyLine.material.opacity = on ? 0.06 : 0.4;
    keyLabel.material.opacity = on ? 0.12 : 1;
    boardCage.material.opacity = on ? 0.32 : 0.16;
    scene.background = on ? new THREE.Color(0x0a0f1a) : null;
    refreshPacketLabels();
    hud.onBoardView?.(on);
  }

  const labelARef = { current: labelA };
  const labelBRef = { current: labelB };
  function setDeviceLabel(ref, text) {
    const old = ref.current;
    const next = makeLabelSprite(text, {
      color: boardView ? "#6b7890" : "#cfe0fb",
    });
    next.position.copy(old.position);
    scene.add(next);
    scene.remove(old);
    old.userData.dispose?.();
    ref.current = next;
  }

  // ---- Postprocessing (bloom) ------------------------------------------
  // Skipped on low-power / mobile devices, where bloom is the heaviest cost.
  // Emissive materials still read as glowing without it.
  let composer = null;
  let bloomOK = true;
  if (!lowPower) {
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.85, // strength
        0.6, // radius
        0.2, // threshold
      );
      composer.addPass(bloom);
      composer.setSize(container.clientWidth, container.clientHeight);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      bloomOK = false;
      composer = null;
    }
  }

  // ---- Animation loop ---------------------------------------------------
  const clock = new THREE.Clock();
  let running = true;
  let rafId = 0;

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    controls.update();
    board.rotation.y += dt * 0.4;
    boardCage.rotation.y -= dt * 0.25;
    boardCage.rotation.x += dt * 0.12;
    deviceA.userData.halo.rotation.y -= dt * 0.3;
    deviceB.userData.halo.rotation.y += dt * 0.3;

    // animate the shared-key dashes
    keyLine.material.dashOffset = -t * 0.6;

    // phase advance
    if (!reduceMotion) {
      phaseTimer += dt;
      if (phaseTimer >= PHASE_SECONDS) applyPhase(phaseIndex + 1);
    }

    // CONNECTED: light the direct channel, dim the board.
    const connected = PHASES[phaseIndex].id === "CONNECTED";
    p2pLine.material.opacity = THREE.MathUtils.lerp(
      p2pLine.material.opacity,
      connected ? 0.85 : 0,
      0.08,
    );
    boardCore.material.emissiveIntensity = THREE.MathUtils.lerp(
      boardCore.material.emissiveIntensity,
      connected ? 0.08 : 0.3,
      0.06,
    );

    // packets travel; trigger a scan pulse as they cross the board (t~0.5)
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed * dt;
      if (p.t >= 1) {
        disposePacket(p);
        packets.splice(i, 1);
        continue;
      }
      const pos = p.curve.getPointAt(Math.min(p.t, 1));
      p.mesh.position.copy(pos);
      p.mesh.rotation.x += dt * 1.4;
      p.mesh.rotation.y += dt * 1.8;
      if (!p.scanned && p.t >= 0.46 && p.t <= 0.56) {
        p.scanned = true;
        scanPulse = 1;
      }
    }

    // scan ring pulse
    if (scanPulse > 0) {
      scanPulse = Math.max(0, scanPulse - dt * 1.6);
      const s = 1 + (1 - scanPulse) * 0.8;
      scanRing.scale.set(s, s, s);
      scanRing.material.opacity = scanPulse * 0.7;
      scanRing.lookAt(camera.position);
    }

    if (composer && bloomOK) composer.render();
    else renderer.render(scene, camera);
  }

  // ---- Responsive camera framing ---------------------------------------
  // Pull the camera back far enough that the full width (both devices + their
  // labels) fits for the current aspect ratio. Narrow/portrait screens need a
  // greater distance, which is what made the scene feel cropped on phones.
  function frameCamera() {
    const vFov = (camera.fov * Math.PI) / 180;
    const tanV = Math.tan(vFov / 2);
    const halfW = 8.2; // world half-width to keep visible
    const halfH = 3.6; // world half-height to keep visible
    const distW = halfW / (tanV * Math.max(0.0001, camera.aspect));
    const distH = halfH / tanV;
    const dist = Math.max(distW, distH, 11);

    const dir = camera.position.clone().sub(controls.target);
    if (dir.lengthSq() < 1e-4) dir.set(0, 4.2, 13.5);
    dir.normalize().multiplyScalar(dist);
    camera.position.copy(controls.target).add(dir);

    controls.minDistance = dist * 0.7;
    controls.maxDistance = dist * 1.7;
    // Keep depth fog proportional to viewing distance so it never swallows the
    // scene when the camera sits far back on mobile.
    scene.fog.near = dist * 0.65;
    scene.fog.far = dist + 24;
    camera.updateProjectionMatrix();
    controls.update();
  }

  // ---- Resize / lifecycle ----------------------------------------------
  let framedWidth = 0;
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer?.setSize(w, h);
    // Only re-frame on meaningful width changes — avoids jitter from the
    // mobile URL bar showing/hiding (which only changes height).
    if (Math.abs(w - framedWidth) > 24) {
      framedWidth = w;
      frameCamera();
    }
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !running) {
          running = true;
          clock.start();
          frame();
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      }
    },
    { threshold: 0.05 },
  );
  io.observe(container);

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

  // kick off
  framedWidth = container.clientWidth;
  frameCamera();
  applyPhase(0);
  frame();

  return {
    setBoardView,
    goToPhase: (i) => applyPhase(i),
    next: () => applyPhase(phaseIndex + 1),
    isBoardView: () => boardView,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

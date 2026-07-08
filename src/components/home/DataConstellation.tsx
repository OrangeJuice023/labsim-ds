"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

/**
 * DataConstellation — procedural 3D hero for LabSim.
 *
 * Philosophy (rapid-site skill):
 *  - One memorable centerpiece, everything else static.
 *  - Asset is CODE, not a download: nodes/edges generated procedurally.
 *  - Driven by a single scroll value t in [0,1] — scrubbable, debuggable.
 *  - Performance ladder: DPR cap, FPS watchdog degrades one way only.
 *
 * Visual: five dataset "clusters" (the 5 synthetic clients) as clouds of
 * points, linked by animated edges (the joins/pipeline), orbiting a bright
 * central core (the unified schema). Camera pushes inward as you scroll.
 *
 * Three.js is loaded from CDN at runtime so no build dependency is added.
 */

const CLIENT_COLORS = [
  0x14b8a6, // teal   — client A
  0x2dd4bf, // teal-2 — client B
  0x0d9488, // teal-3 — client C
  0x5eead4, // mint   — client D
  0xd97706, // amber  — client E (the outlier / different market)
];

export function DataConstellation() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) {
      setReady(true);
      return;
    }

    let THREE: any;
    let renderer: any;
    let scene: any;
    let camera: any;
    let frameId = 0;
    let disposed = false;

    // performance ladder state
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let quality = 2; // 2 = full, 1 = reduced, 0 = minimal
    const fpsSamples: number[] = [];
    let lastSample = performance.now();

    // scroll state
    let targetT = 0;
    let currentT = 0;

    function onScroll() {
      const el = mountRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      targetT = total > 0 ? scrolled / total : 0;
    }

    async function init() {
      // load three from CDN once
      if (!(window as any).THREE) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("three load failed"));
          document.head.appendChild(s);
        });
      }
      THREE = (window as any).THREE;
      if (disposed || !THREE || !mountRef.current) return;

      const mount = mountRef.current;
      const width = mount.clientWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0f172a, 0.055);

      camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
      camera.position.set(0, 0, 18);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0f172a, 1);
      mount.appendChild(renderer.domElement);

      // ── Central core (the unified schema) ────────────────────────────
      const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x5eead4, wireframe: true, transparent: true, opacity: 0.85,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      const coreGlowGeo = new THREE.IcosahedronGeometry(1.5, 1);
      const coreGlowMat = new THREE.MeshBasicMaterial({
        color: 0x14b8a6, wireframe: true, transparent: true, opacity: 0.25,
      });
      const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
      scene.add(coreGlow);

      // ── Five client clusters ─────────────────────────────────────────
      const clusters: any[] = [];
      const edgePositions: number[] = [];
      const NODES_PER = quality >= 2 ? 34 : 20;

      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        const radius = 7.2;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius * 0.55;
        const cz = Math.sin(angle * 1.3) * 2.5;
        const center = new THREE.Vector3(cx, cy, cz);

        const pts: number[] = [];
        for (let i = 0; i < NODES_PER; i++) {
          const px = cx + (Math.random() - 0.5) * 3.4;
          const py = cy + (Math.random() - 0.5) * 3.4;
          const pz = cz + (Math.random() - 0.5) * 3.4;
          pts.push(px, py, pz);
          // edge from node back toward its cluster center (intra-client joins)
          if (i % 3 === 0) {
            edgePositions.push(px, py, pz, cx, cy, cz);
          }
        }
        // edge from cluster center to the core (client → unified schema)
        edgePositions.push(cx, cy, cz, 0, 0, 0);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        const mat = new THREE.PointsMaterial({
          color: CLIENT_COLORS[c],
          size: 0.16,
          transparent: true,
          opacity: 0.95,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);
        clusters.push({ points, center, baseAngle: angle });
      }

      // ── Edges (the pipeline/joins) ───────────────────────────────────
      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x14b8a6, transparent: true, opacity: 0.16,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      scene.add(edges);

      // ── Ambient starfield for depth ──────────────────────────────────
      const starCount = quality >= 2 ? 380 : 180;
      const starPts: number[] = [];
      for (let i = 0; i < starCount; i++) {
        starPts.push(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40 - 10
        );
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x334155, size: 0.08, transparent: true, opacity: 0.6,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      setReady(true);

      // ── Animation loop ───────────────────────────────────────────────
      let clock = 0;
      function render() {
        if (disposed) return;
        frameId = requestAnimationFrame(render);

        // damp scroll -> smooth camera dolly
        currentT += (targetT - currentT) * 0.06;
        clock += 0.005;

        // camera pushes inward and orbits slightly as you scroll
        const camDist = 18 - currentT * 9.5;
        const orbit = currentT * Math.PI * 0.6 + clock * 0.15;
        camera.position.x = Math.sin(orbit) * camDist * 0.35;
        camera.position.z = Math.cos(orbit) * camDist;
        camera.position.y = Math.sin(currentT * Math.PI) * 2.5;
        camera.lookAt(0, 0, 0);

        // core rotation
        core.rotation.x += 0.003;
        core.rotation.y += 0.004;
        coreGlow.rotation.x -= 0.002;
        coreGlow.rotation.y -= 0.0025;
        const pulse = 1 + Math.sin(clock * 2) * 0.05;
        coreGlow.scale.setScalar(pulse);

        // clusters drift
        for (let i = 0; i < clusters.length; i++) {
          const cl = clusters[i];
          cl.points.rotation.y += 0.001 + i * 0.0002;
          cl.points.rotation.z += 0.0008;
        }
        edges.rotation.copy(clusters[0].points.rotation);
        edges.rotation.y *= 0.4;

        // edge opacity swells with scroll (pipeline "activates")
        edgeMat.opacity = 0.12 + currentT * 0.35;
        stars.rotation.y += 0.0003;

        renderer.render(scene, camera);

        // fps watchdog — degrade one way only
        const now = performance.now();
        fpsSamples.push(now - lastSample);
        lastSample = now;
        if (fpsSamples.length >= 90) {
          const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
          fpsSamples.length = 0;
          if (avg > 22 && quality > 0) {
            quality -= 1;
            dpr = Math.max(1, dpr * 0.8);
            renderer.setPixelRatio(dpr);
          }
        }
      }
      render();
    }

    function onResize() {
      if (!renderer || !camera || !mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    init().catch(() => setReady(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <section className="relative bg-[#0F172A]">
      {/* Scroll track — tall so the scene has room to play */}
      <div ref={mountRef} className="relative h-[280vh]">
        {/* Fixed canvas mount lives here (renderer.domElement is appended) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* WebGL canvas is injected as a child of mountRef; overlay content sits above via z-index */}
          <div className="absolute inset-0 z-[1]" aria-hidden />

          {/* Story-beat overlays (DOM, not baked into 3D) */}
          <div className="relative z-[2] h-screen max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] flex flex-col justify-center pointer-events-none">
            <div className="max-w-[720px] pointer-events-auto">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
                  <FlaskConical size={13} className="text-[#D97706]" />
                  Synthetic Healthcare Data Science
                </span>
              </div>

              <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.02em] mb-7">
                Five data sources.
                <br />
                <span className="text-[#14B8A6]">One connected system.</span>
              </h1>

              <p className="text-[1.125rem] text-[#CBD5E1] leading-[1.7] max-w-[540px] mb-10">
                Nine end-to-end ML projects on a fully synthetic healthcare
                dataset — engineered to behave like production, connected by the
                same schema real diagnostic labs run on. Scroll to explore.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0D9488] text-white font-semibold text-sm hover:bg-[#0F766E] transition-colors duration-200 cursor-pointer"
                >
                  View All Projects
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#334155] text-[#CBD5E1] font-semibold text-sm hover:bg-[#334155]/40 transition-colors duration-200 cursor-pointer"
                >
                  How the Data Was Built
                </Link>
              </div>
            </div>

            {/* scroll hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#64748B]">
              <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#64748B] to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats band — the "landing" after the scene, connects into the page */}
      <div className="relative z-[2] bg-[#0F172A] border-t border-[#1E293B]">
        <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "9", label: "End-to-End ML Projects" },
              { value: "5", label: "Synthetic Client Profiles" },
              { value: "5", label: "Table Relational Schema" },
              { value: "0", label: "Real Patient Records" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[2rem] font-extrabold text-white font-mono tracking-tight leading-none mb-1.5">
                  {s.value}
                </p>
                <p className="text-xs text-[#94A3B8] font-medium tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

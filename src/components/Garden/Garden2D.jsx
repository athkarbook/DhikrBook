import React, { useEffect, useMemo, useRef } from 'react';
import { Leaf, Sprout, ZoomIn, ZoomOut, Locate, Hand } from 'lucide-react';
import { buildWorld, clamp } from './gardenEngine';
import { renderGarden, makeBackdrop, makeEnv } from './gardenRender';

// Day-or-night follows the user's actual clock so the garden lives with them,
// independent of the app's light/dark theme.
const isNightHour = () => {
  const h = new Date().getHours();
  return h < 6 || h >= 19; // night from 7pm through sunrise around 6am
};

// A living 2D garden you can pan and zoom around. Trees, kinds of trees, flowers
// and fruit all grow with XP (XP == "time"). The heavy lifting lives in
// gardenEngine.js (what exists) and gardenRender.js (how it's painted).
export default function Garden2D({ xp = 0 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const camRef = useRef({ x: 0, y: 0, zoom: 1, vx: 0 });
  const apiRef = useRef(null);

  const world = useMemo(() => buildWorld(xp), [xp]);
  const backdrop = useMemo(() => makeBackdrop(world), [world]);

  // Keep latest data available to the (run-once) animation loop without resetting it.
  const stateRef = useRef({ world, backdrop, env: makeEnv(isNightHour()) });
  stateRef.current.world = world;
  stateRef.current.backdrop = backdrop;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');

    const size = { w: 0, h: 0, dpr: 1 };
    let inited = false;
    let raf = 0;

    const sx2world = (sx) => camRef.current.x + (sx - size.w / 2) / camRef.current.zoom;

    const clampCam = () => {
      const cam = camRef.current;
      cam.zoom = clamp(cam.zoom, 0.62, 1.85);
      const half = size.w / 2 / cam.zoom;
      const minX = half - 60;
      const maxX = stateRef.current.world.width - half + 60;
      cam.x = maxX < minX ? stateRef.current.world.width / 2 : clamp(cam.x, minX, maxX);
      // The parallax hills are anchored in screen space — they don't follow camY.
      // Letting the world rise much above them makes trees look like they're
      // floating off the ground. A tiny downward nudge is allowed (peek at sky).
      cam.y = clamp(cam.y, -10, 60);
    };

    const initCam = () => {
      const cam = camRef.current;
      cam.zoom = size.w < 560 ? 1.0 : 1.1; // mobile shows a few trees; desktop a touch closer
      cam.y = 0;
      cam.vx = 0;
      cam.x = size.w / 2; // start on the oldest, most fruitful trees (left of the grove)
      clampCam();
    };

    const zoomAround = (sx, factor) => {
      const before = sx2world(sx);
      camRef.current.zoom = clamp(camRef.current.zoom * factor, 0.62, 1.85);
      camRef.current.x += before - sx2world(sx);
      clampCam();
    };

    apiRef.current = {
      zoomBy: (f) => zoomAround(size.w / 2, f),
      recenter: () => initCam(),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth || 600;
      const h = wrap.clientHeight || 460;
      size.w = w;
      size.h = h;
      size.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      if (!inited) {
        initCam();
        inited = true;
      }
      clampCam();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // --- pointer (mouse + touch) pan, pinch-zoom, wheel-zoom ------------------
    const pointers = new Map();
    let dragging = false;
    let lastX = 0, lastY = 0, lastT = 0, pinchDist = 0, pinchZoom = 1;

    const onDown = (e) => {
      try { canvas.setPointerCapture?.(e.pointerId); } catch { /* not a live pointer */ }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = performance.now();
        camRef.current.vx = 0;
      } else if (pointers.size === 2) {
        dragging = false;
        const p = [...pointers.values()];
        pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
        pinchZoom = camRef.current.zoom;
      }
    };

    const onMove = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const rect = canvas.getBoundingClientRect();
      if (pointers.size >= 2) {
        const p = [...pointers.values()];
        const dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
        const midSX = (p[0].x + p[1].x) / 2 - rect.left;
        const before = sx2world(midSX);
        camRef.current.zoom = clamp(pinchZoom * (dist / pinchDist), 0.62, 1.85);
        camRef.current.x += before - sx2world(midSX);
        clampCam();
      } else if (dragging) {
        const cam = camRef.current;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        cam.x -= dx / cam.zoom;
        cam.y += dy;
        const now = performance.now();
        const dt = Math.max(8, now - lastT);
        cam.vx = (-dx / cam.zoom) * (16 / dt);
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
        clampCam();
      }
    };

    const onUp = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) {
        dragging = false;
      } else {
        const p = [...pointers.values()][0];
        lastX = p.x;
        lastY = p.y;
        dragging = true;
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAround(e.clientX - rect.left, e.deltaY < 0 ? 1.12 : 0.9);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const start = performance.now();
    let lastDayCheck = 0;
    const loop = (now) => {
      const t = (now - start) / 1000;
      const cam = camRef.current;
      if (!dragging) {
        cam.x += cam.vx;
        cam.vx *= 0.92;
        if (Math.abs(cam.vx) < 0.02) cam.vx = 0;
        clampCam();
      }
      // Check every ~30s whether dawn/dusk crossed and flip the palette if so.
      if (now - lastDayCheck > 30000) {
        lastDayCheck = now;
        const wantDark = isNightHour();
        if (wantDark !== stateRef.current.env.dark) {
          stateRef.current.env = makeEnv(wantDark);
        }
      }
      renderGarden(ctx, {
        W: size.w, H: size.h, dpr: size.dpr,
        cam, t,
        world: stateRef.current.world,
        env: stateRef.current.env,
        backdrop: stateRef.current.backdrop,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onUp);
      canvas.removeEventListener('wheel', onWheel);
      apiRef.current = null;
    };
  }, []);

  const btn =
    'pointer-events-auto w-11 h-11 flex items-center justify-center rounded-2xl bg-black/40 hover:bg-black/55 backdrop-blur-md text-white border border-white/15 transition active:scale-90 shadow-lg';

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[62vh] min-h-[420px] max-h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 select-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Scrim so the title/hadith stay readable over either sky palette */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/65 via-black/35 to-transparent pointer-events-none" />

      {/* Header: stat chips row, then centred title + hadith (stacked so they never collide) */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 md:p-5 pointer-events-none flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs md:text-sm font-bold border border-white/10 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-300" />
            {world.numTrees} شجرة
          </div>
          <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs md:text-sm font-bold border border-white/10 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-pink-300" />
            {world.numFlowers} زهرة
          </div>
        </div>
        <div className="flex flex-col items-center text-center mt-0.5">
          <h4 className="text-xl md:text-3xl font-black mb-1 text-white flex items-center justify-center gap-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}>
            <Leaf className="w-5 h-5 md:w-7 md:h-7 text-emerald-300 animate-pulse drop-shadow" />
            بستان الجنة
          </h4>
          <p className="text-[11px] md:text-sm text-white max-w-2xl leading-relaxed font-semibold px-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
            «أَلَا أَدُلُّكَ على غِراسٍ هو خيرٌ من هذا؟ سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر، يُغرَس لك بكل كلمةٍ منها شجرةٌ في الجنة»
          </p>
        </div>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
        <div className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-2 rounded-2xl text-[11px] md:text-xs flex items-center gap-2 border border-white/10">
          <Hand className="w-4 h-4 animate-pulse" />
          اسحب لتتجول في بستانك
        </div>
      </div>

      {/* Zoom / recenter controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button aria-label="تكبير" className={btn} onClick={() => apiRef.current?.zoomBy(1.25)}>
          <ZoomIn className="w-5 h-5" />
        </button>
        <button aria-label="تصغير" className={btn} onClick={() => apiRef.current?.zoomBy(0.8)}>
          <ZoomOut className="w-5 h-5" />
        </button>
        <button aria-label="إعادة التوسيط" className={btn} onClick={() => apiRef.current?.recenter()}>
          <Locate className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

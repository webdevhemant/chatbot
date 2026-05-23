'use client';

import { useUserProfile } from '@/lib/user-profile-context';
import { motion, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ── floating hexagon particle ── */
interface HexParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  phase: number;
  rotation: number;
  rotSpeed: number;
}

function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M${pts.join('L')}Z`;
}

/* ── glitch text component ── */
function GlitchText({ text, accent }: { text: string; accent: string }) {
  const [glitching, setGlitching] = useState(false);
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loop = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 180);
    };
    loop();
    glitchRef.current = setInterval(loop, 3200);
    return () => { if (glitchRef.current) clearInterval(glitchRef.current); };
  }, []);

  return (
    <div className="relative select-none" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* base */}
      <span
        className="relative block text-[clamp(96px,18vw,180px)] font-black leading-none tracking-tighter"
        style={{ color: accent, textShadow: `0 0 60px ${accent}50, 0 0 120px ${accent}20` }}
      >
        {text}
      </span>
      {/* glitch layer 1 */}
      <span
        aria-hidden
        className="absolute inset-0 block text-[clamp(96px,18vw,180px)] font-black leading-none tracking-tighter pointer-events-none"
        style={{
          color: '#ff3366',
          clipPath: 'inset(30% 0 50% 0)',
          transform: glitching ? 'translateX(-6px)' : 'translateX(0)',
          opacity: glitching ? 0.7 : 0,
          transition: glitching ? 'none' : 'opacity 0.05s',
          mixBlendMode: 'screen',
        }}
      >
        {text}
      </span>
      {/* glitch layer 2 */}
      <span
        aria-hidden
        className="absolute inset-0 block text-[clamp(96px,18vw,180px)] font-black leading-none tracking-tighter pointer-events-none"
        style={{
          color: '#00e5ff',
          clipPath: 'inset(55% 0 10% 0)',
          transform: glitching ? 'translateX(5px)' : 'translateX(0)',
          opacity: glitching ? 0.6 : 0,
          transition: glitching ? 'none' : 'opacity 0.05s',
          mixBlendMode: 'screen',
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── central hexagon logo ── */
function CentralHex({ accent }: { accent: string }) {
  const rotate = useMotionValue(0);
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  useAnimationFrame((t) => {
    rotate.set(t * 0.015);
  });

  return (
    <motion.div
      className="relative flex items-center justify-center"
      onHoverStart={() => scale.set(1.12)}
      onHoverEnd={() => scale.set(1)}
      style={{ scale }}
    >
      {/* outer ring — slow spin */}
      <motion.svg
        width="160" height="160"
        className="absolute"
        style={{ rotate }}
      >
        <defs>
          <linearGradient id="nf-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d={hexPath(80, 80, 74)} fill="none" stroke="url(#nf-ring)" strokeWidth="1.5" strokeDasharray="8 6" />
      </motion.svg>

      {/* mid ring — counter spin */}
      <motion.svg
        width="120" height="120"
        className="absolute"
        style={{ rotate: useMotionValue(0) }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <path d={hexPath(60, 60, 55)} fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.25" />
      </motion.svg>

      {/* solid hex body */}
      <svg width="90" height="90" className="relative">
        <defs>
          <linearGradient id="nf-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
          </linearGradient>
          <filter id="nf-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={hexPath(45, 45, 40)} fill="url(#nf-body)" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" filter="url(#nf-glow)" />
        {/* inner cutout hex */}
        <path d={hexPath(45, 45, 22)} fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
        {/* center dot */}
        <circle cx="45" cy="45" r="4" fill={accent} opacity="0.7" filter="url(#nf-glow)" />
        {/* corner dots */}
        {Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return (
            <circle
              key={i}
              cx={45 + 22 * Math.cos(a)}
              cy={45 + 22 * Math.sin(a)}
              r="2"
              fill={accent}
              opacity="0.4"
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

/* ── floating particles canvas ── */
function FloatingHexes({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<HexParticle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });

  const initParticles = useCallback((w: number, h: number) => {
    particlesRef.current = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      size: 6 + Math.random() * 18,
      speed: 0.15 + Math.random() * 0.3,
      opacity: 0.04 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    const drawHex = (x: number, y: number, r: number, rot: number, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + rot;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();

      // parse accent hex to rgb
      const r2 = Number.parseInt(accent.slice(1, 3), 16);
      const g2 = Number.parseInt(accent.slice(3, 5), 16);
      const b2 = Number.parseInt(accent.slice(5, 7), 16);
      ctx.strokeStyle = `rgba(${r2},${g2},${b2},${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      for (const p of particlesRef.current) {
        // mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repel = dist < 120 ? (120 - dist) / 120 : 0;

        p.x += p.drift + repel * (dx / dist) * 1.2;
        p.y -= p.speed + repel * (dy / dist) * 1.2;
        p.rotation += p.rotSpeed;

        if (p.y + p.size < 0) {
          p.y = canvas.height + p.size;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;

        const pulse = p.opacity * (0.7 + 0.3 * Math.sin(t * 2 + p.phase));
        drawHex(p.x, p.y, p.size, p.rotation, pulse);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(frameRef.current);
    };
  }, [accent, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ── scanline overlay ── */
function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }}
    />
  );
}

/* ── main 404 page ── */
export default function NotFound() {
  const { currentTheme } = useUserProfile();
  const accent = currentTheme.accent;
  const bg = currentTheme.bg;

  const [cmdIndex, setCmdIndex] = useState(0);
  const cmds = [
    '> scanning route table...',
    '> no match found for this path',
    '> initiating recovery protocol...',
    '> redirecting to safe zone',
  ];

  useEffect(() => {
    if (cmdIndex >= cmds.length - 1) return;
    const t = setTimeout(() => setCmdIndex(i => i + 1), 900 + cmdIndex * 200);
    return () => clearTimeout(t);
  }, [cmdIndex, cmds.length]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: bg, fontFamily: "'Courier New', monospace" }}
    >
      <FloatingHexes accent={accent} />
      <Scanlines />

      {/* radial glow behind content */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* content */}
      <div className="relative flex flex-col items-center gap-6 px-6 text-center" style={{ zIndex: 2 }}>

        {/* hex logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <CentralHex accent={accent} />
        </motion.div>

        {/* 404 glitch number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlitchText text="404" accent={accent} />
        </motion.div>

        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <p
            className="text-[clamp(14px,2vw,18px)] font-semibold tracking-[0.25em] uppercase"
            style={{ color: '#8b99b5', letterSpacing: '0.3em' }}
          >
            Page Not Found
          </p>
          <div
            className="h-px w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
          />
        </motion.div>

        {/* terminal readout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="rounded-lg px-5 py-4 text-left w-full max-w-[340px]"
          style={{
            background: `${accent}08`,
            border: `1px solid ${accent}20`,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {cmds.slice(0, cmdIndex + 1).map((cmd, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] leading-6"
              style={{ color: i === cmdIndex ? accent : '#3d4f6e' }}
            >
              {cmd}
              {i === cmdIndex && i < cmds.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ color: accent }}
                >▌</motion.span>
              )}
            </motion.p>
          ))}
        </motion.div>

        {/* action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <Link href="/">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold tracking-wide"
              style={{
                background: accent,
                color: bg,
                boxShadow: `0 0 24px ${accent}40`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 12l7-7M3 12l7 7" />
              </svg>
              Back to HaxonChat
            </motion.button>
          </Link>

          <Link href="/upgrade">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, borderColor: accent }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-colors"
              style={{
                background: 'transparent',
                color: '#8b99b5',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              View Plans
            </motion.button>
          </Link>
        </motion.div>

        {/* bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-[11px] tracking-widest uppercase"
          style={{ color: '#2d3d55', letterSpacing: '0.2em' }}
        >
          HaxonChat · AI Personas
        </motion.p>
      </div>
    </div>
  );
}

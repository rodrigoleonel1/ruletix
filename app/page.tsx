"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { WheelSlice } from "./components/Wheel";
import WinnerModal from "./components/WinnerModal";
import SliceEditor from "./components/SliceEditor";

const Wheel = dynamic(() => import("./components/Wheel"), { ssr: false });

const DEFAULT_SLICES: WheelSlice[] = [
  { id: "1", text: "Opción 1", color: "#ef4444" },
  { id: "2", text: "Opción 2", color: "#3b82f6" },
  { id: "3", text: "Opción 3", color: "#22c55e" },
  { id: "4", text: "Opción 4", color: "#f59e0b" },
  { id: "5", text: "Opción 5", color: "#8b5cf6" },
  { id: "6", text: "Opción 6", color: "#ec4899" },
];

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Home() {
  const [slices, setSlices] = useState<WheelSlice[]>(DEFAULT_SLICES);
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelSlice | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Sync dark state from html class (set by inline script in layout)
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Load persisted slices (categories + colores) from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ruletix-slices");
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof (item as any).id === "string" &&
              typeof (item as any).text === "string" &&
              typeof (item as any).color === "string"
          )
        ) {
          setSlices(parsed as WheelSlice[]);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist slices whenever the user updates categories or colors
  useEffect(() => {
    try {
      localStorage.setItem("ruletix-slices", JSON.stringify(slices));
    } catch {
      // ignore quota / privacy errors
    }
  }, [slices]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("ruletix-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const animFrameRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickAngleRef = useRef(0);
  const spinAngleRef = useRef(0);

  useEffect(() => { spinAngleRef.current = spinAngle; }, [spinAngle]);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playTick = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(700 + Math.random() * 300, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.05);
    } catch { /* ignore */ }
  }, [getAudioCtx]);

  const playWinSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.start(ctx.currentTime + i * 0.12); osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch { /* ignore */ }
  }, [getAudioCtx]);

  const runSpin = useCallback((startAngle: number, totalRotation: number, snap: WheelSlice[]) => {
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const endAngle = startAngle + totalRotation;
    const sliceAngle = 360 / snap.length;
    lastTickAngleRef.current = startAngle;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startAngle + totalRotation * easeOut(progress);

      setSpinAngle(current);
      spinAngleRef.current = current;

      const curIdx  = Math.floor(((current % 360) + 360) % 360 / sliceAngle);
      const prevIdx = Math.floor(((lastTickAngleRef.current % 360) + 360) % 360 / sliceAngle);
      if (curIdx !== prevIdx) { playTick(); lastTickAngleRef.current = current; }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinAngle(endAngle);
        spinAngleRef.current = endAngle;
        setIsSpinning(false);
        const norm = ((endAngle % 360) + 360) % 360;
        const rel  = ((360 - norm) + 3600) % 360;
        const idx  = Math.floor(rel / sliceAngle) % snap.length;
        playWinSound();
        setTimeout(() => setWinner(snap[idx]), 400);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [playTick, playWinSound]);

  const spin = useCallback((extra?: number) => {
    if (isSpinning || slices.length < 2) return;
    try { getAudioCtx().resume(); } catch { /* ignore */ }
    setIsSpinning(true); setWinner(null);
    const total = extra
      ? Math.abs(extra) + 360 * (3 + Math.random() * 4)
      : 360 * (5 + Math.random() * 5) + Math.random() * 360;
    runSpin(spinAngleRef.current, total, [...slices]);
  }, [isSpinning, slices, getAudioCtx, runSpin]);

  const handleDragSpin = useCallback((delta: number) => {
    if (isSpinning || slices.length < 2) return;
    try { getAudioCtx().resume(); } catch { /* ignore */ }
    setIsSpinning(true); setWinner(null);
    runSpin(spinAngleRef.current, Math.abs(delta) + 360 * (3 + Math.random() * 3), [...slices]);
  }, [isSpinning, slices, getAudioCtx, runSpin]);

  useEffect(() => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }, []);

  const disabled = isSpinning || slices.length < 2;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-main)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col lg:static lg:translate-x-0 lg:z-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 272, background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>Casillas</span>
          <button
            className="lg:hidden transition-colors"
            style={{ color: "var(--text-muted)" }}
            onClick={() => setSidebarOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <SliceEditor slices={slices} onUpdate={setSlices} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-0 relative p-4 overflow-hidden">

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Mobile: open sidebar */}
          <button
            className="lg:hidden flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            style={{ background: "var(--sidebar)", border: "1px solid var(--border)", color: "var(--text)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            Casillas
          </button>
          <div className="hidden lg:block" />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: "var(--sidebar)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-6 tracking-tight" style={{ color: "var(--text)" }}>
          Ruletix
        </h1>

        {/* Wheel */}
        <Wheel
          slices={slices}
          isSpinning={isSpinning}
          spinAngle={spinAngle}
          onSpinStart={handleDragSpin}
          theme={dark ? "dark" : "light"}
        />

        {/* Spin button */}
        <button
          onClick={() => spin()}
          disabled={disabled}
          className="mt-7 px-10 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{
            background: disabled ? "var(--btn-dis)"     : "var(--btn-primary)",
            color:      disabled ? "var(--btn-dis-txt)" : "var(--btn-text)",
            cursor:     disabled ? "not-allowed"        : "pointer",
          }}
        >
          {isSpinning ? "Girando..." : "Girar"}
        </button>

        {slices.length < 2 && !isSpinning && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Necesitás al menos 2 casillas
          </p>
        )}
      </main>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </div>
  );
}

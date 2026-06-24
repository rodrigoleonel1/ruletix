"use client";

import { useRef, useEffect, useCallback, useState } from "react";

export interface WheelSlice {
  id: string;
  text: string;
  color: string;
}

interface WheelProps {
  slices: WheelSlice[];
  isSpinning: boolean;
  spinAngle: number;
  onSpinStart: (deltaAngle: number) => void;
  theme?: string; // "dark" | "light" — triggers redraw on toggle
}

export default function Wheel({ slices, isSpinning, spinAngle, onSpinStart, theme }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastTimestamp = useRef(0);
  const angularVelocity = useRef(0);
  const currentDisplayAngle = useRef(spinAngle);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 400) setSize(Math.min(vw - 48, 360));
      else if (vw < 640) setSize(440);
      else if (vw < 1024) setSize(560);
      else setSize(680);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    currentDisplayAngle.current = spinAngle;
  }, [spinAngle]);

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read CSS variables so the canvas respects dark/light mode
    const style = getComputedStyle(document.documentElement);
    const colorBorder = style.getPropertyValue("--wheel-border").trim() || "#d6d3d1";
    const colorHub    = style.getPropertyValue("--wheel-hub").trim()    || "#ffffff";
    const colorBg     = style.getPropertyValue("--bg").trim()           || "#f5f5f4";
    const colorMuted  = style.getPropertyValue("--text-muted").trim()   || "#78716c";

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 6;
    const n = slices.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (n === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = colorBg;
      ctx.fill();
      ctx.strokeStyle = colorBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = colorMuted;
      ctx.font = `${radius * 0.12}px -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Agregá casillas", cx, cy);
      return;
    }

    const sliceAngle = (Math.PI * 2) / n;

    slices.forEach((slice, i) => {
      const startA = angle + i * sliceAngle;
      const endA = startA + sliceAngle;
      const midA = startA + sliceAngle / 2;

      // Fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Subtle divider
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midA);

      const textR = radius * 0.62;
      ctx.translate(textR, 0);

      const maxW = radius * 0.5;
      const fontSize = Math.max(10, Math.min(16, radius * 0.085));
      ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 3;

      // Word wrap
      const words = slice.text.split(" ");
      const lines: string[] = [];
      let line = "";
      words.forEach((w) => {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);

      const lh = fontSize * 1.25;
      lines.forEach((l, li) => {
        ctx.fillText(l, 0, (li - (lines.length - 1) / 2) * lh, maxW);
      });

      ctx.restore();
    });

    // Outer border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = colorHub;
    ctx.fill();
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [slices]);

  // Depend on size so this runs after the canvas gets its real dimensions on mount
  useEffect(() => {
    if (size === null) return;
    const id = requestAnimationFrame(() => drawWheel(spinAngle * Math.PI / 180));
    return () => cancelAnimationFrame(id);
  }, [slices, spinAngle, drawWheel, size, theme]);

  const getAngle = (e: { clientX: number; clientY: number }, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpinning) return;
    isDragging.current = true;
    lastAngle.current = getAngle(e.nativeEvent, canvasRef.current!);
    lastTimestamp.current = performance.now();
    angularVelocity.current = 0;
  }, [isSpinning]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || isSpinning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const angle = getAngle(e.nativeEvent, canvas);
    let delta = angle - lastAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    const dt = performance.now() - lastTimestamp.current;
    if (dt > 0) angularVelocity.current = delta / dt;
    currentDisplayAngle.current += delta * (180 / Math.PI);
    drawWheel(currentDisplayAngle.current * Math.PI / 180);
    lastAngle.current = angle;
    lastTimestamp.current = performance.now();
  }, [isSpinning, drawWheel]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const vel = angularVelocity.current * (180 / Math.PI) * 16;
    if (Math.abs(vel) > 30) onSpinStart(vel * 60);
  }, [onSpinStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isSpinning) return;
    const t = e.touches[0];
    isDragging.current = true;
    lastAngle.current = getAngle(t, canvasRef.current!);
    lastTimestamp.current = performance.now();
    angularVelocity.current = 0;
  }, [isSpinning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isSpinning) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = e.touches[0];
    const angle = getAngle(t, canvas);
    let delta = angle - lastAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    const dt = performance.now() - lastTimestamp.current;
    if (dt > 0) angularVelocity.current = delta / dt;
    currentDisplayAngle.current += delta * (180 / Math.PI);
    drawWheel(currentDisplayAngle.current * Math.PI / 180);
    lastAngle.current = angle;
    lastTimestamp.current = performance.now();
  }, [isSpinning, drawWheel]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const vel = angularVelocity.current * (180 / Math.PI) * 16;
    if (Math.abs(vel) > 20) onSpinStart(vel * 60);
  }, [onSpinStart]);

  // Don't render until we know the viewport size
  if (size === null) return <div style={{ width: 500, height: 500 }} />;

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer arrow */}
      <div
        className="absolute z-10"
        style={{ right: -2, top: "50%", transform: "translateY(-50%)" }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            borderRight: "24px solid var(--pointer)",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ borderRadius: "50%", display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { WheelSlice } from "./Wheel";

const TAILWIND_COLORS: { name: string; value: string }[] = [
  { name: "red-400",      value: "#f87171" },
  { name: "red-500",      value: "#ef4444" },
  { name: "red-600",      value: "#dc2626" },
  { name: "orange-400",   value: "#fb923c" },
  { name: "orange-500",   value: "#f97316" },
  { name: "orange-600",   value: "#ea580c" },
  { name: "amber-400",    value: "#fbbf24" },
  { name: "amber-500",    value: "#f59e0b" },
  { name: "amber-600",    value: "#d97706" },
  { name: "yellow-400",   value: "#facc15" },
  { name: "yellow-500",   value: "#eab308" },
  { name: "lime-400",     value: "#a3e635" },
  { name: "lime-500",     value: "#84cc16" },
  { name: "lime-600",     value: "#65a30d" },
  { name: "green-400",    value: "#4ade80" },
  { name: "green-500",    value: "#22c55e" },
  { name: "green-600",    value: "#16a34a" },
  { name: "green-700",    value: "#15803d" },
  { name: "emerald-400",  value: "#34d399" },
  { name: "emerald-500",  value: "#10b981" },
  { name: "emerald-600",  value: "#059669" },
  { name: "teal-400",     value: "#2dd4bf" },
  { name: "teal-500",     value: "#14b8a6" },
  { name: "teal-600",     value: "#0d9488" },
  { name: "cyan-400",     value: "#22d3ee" },
  { name: "cyan-500",     value: "#06b6d4" },
  { name: "cyan-600",     value: "#0891b2" },
  { name: "sky-400",      value: "#38bdf8" },
  { name: "sky-500",      value: "#0ea5e9" },
  { name: "sky-600",      value: "#0284c7" },
  { name: "blue-400",     value: "#60a5fa" },
  { name: "blue-500",     value: "#3b82f6" },
  { name: "blue-600",     value: "#2563eb" },
  { name: "blue-700",     value: "#1d4ed8" },
  { name: "indigo-400",   value: "#818cf8" },
  { name: "indigo-500",   value: "#6366f1" },
  { name: "indigo-600",   value: "#4f46e5" },
  { name: "violet-400",   value: "#a78bfa" },
  { name: "violet-500",   value: "#8b5cf6" },
  { name: "violet-600",   value: "#7c3aed" },
  { name: "purple-400",   value: "#c084fc" },
  { name: "purple-500",   value: "#a855f7" },
  { name: "purple-600",   value: "#9333ea" },
  { name: "fuchsia-400",  value: "#e879f9" },
  { name: "fuchsia-500",  value: "#d946ef" },
  { name: "pink-400",     value: "#f472b6" },
  { name: "pink-500",     value: "#ec4899" },
  { name: "pink-600",     value: "#db2777" },
  { name: "rose-400",     value: "#fb7185" },
  { name: "rose-500",     value: "#f43f5e" },
  { name: "rose-600",     value: "#e11d48" },
  { name: "slate-400",    value: "#94a3b8" },
  { name: "slate-500",    value: "#64748b" },
  { name: "gray-400",     value: "#9ca3af" },
  { name: "gray-500",     value: "#6b7280" },
  { name: "stone-400",    value: "var(--text-muted)" },
  { name: "stone-500",    value: "#78716c" },
];

interface SliceEditorProps {
  slices: WheelSlice[];
  onUpdate: (slices: WheelSlice[]) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getRandomColor() {
  return TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)].value;
}

export default function SliceEditor({ slices, onUpdate }: SliceEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const addSlice = () => {
    if (slices.length >= 20) return;
    const newSlice: WheelSlice = {
      id: generateId(),
      text: `Opción ${slices.length + 1}`,
      color: getRandomColor(),
    };
    onUpdate([...slices, newSlice]);
  };

  const removeSlice = (id: string) => {
    onUpdate(slices.filter((s) => s.id !== id));
    if (showColorPicker === id) setShowColorPicker(null);
  };

  const updateText = (id: string, text: string) => {
    onUpdate(slices.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const updateColor = (id: string, color: string) => {
    onUpdate(slices.map((s) => (s.id === id ? { ...s, color } : s)));
    setShowColorPicker(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Slice list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {slices.length === 0 && (
          <p className="text-center py-10 text-xs" style={{ color: "var(--text-muted)" }}>
            Sin casillas todavía
          </p>
        )}

        {slices.map((slice) => (
          <div
            key={slice.id}
            className="flex items-center gap-2 px-2 py-2 rounded-lg group"
            style={{ background: "var(--bg-main, transparent)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-row)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-main, transparent)")}
          >
            {/* Color swatch */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowColorPicker(showColorPicker === slice.id ? null : slice.id)}
                className="w-7 h-7 rounded-md border transition-opacity hover:opacity-80"
                style={{
                  background: slice.color,
                  borderColor: "rgba(0,0,0,0.12)",
                }}
                title="Cambiar color"
              />

              {showColorPicker === slice.id && (
                <div
                  className="absolute left-0 top-full mt-1 z-50 p-2.5 rounded-xl shadow-lg"
                  style={{
                    background: "var(--picker-bg)",
                    border: "1px solid var(--border)",
                    width: 200,
                  }}
                >
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Color</p>
                  <div className="grid grid-cols-7 gap-1">
                    {TAILWIND_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateColor(slice.id, c.value)}
                        title={c.name}
                        className="w-6 h-6 rounded-md transition-transform hover:scale-110"
                        style={{
                          background: c.value,
                          outline: slice.color === c.value ? "2px solid var(--text)" : "none",
                          outlineOffset: 1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Text input */}
            <input
              type="text"
              value={slice.text}
              onChange={(e) => updateText(slice.id, e.target.value)}
              maxLength={30}
              className="flex-1 text-sm bg-transparent outline-none min-w-0"
              style={{ color: "var(--text)" }}
              placeholder="Nombre..."
            />

            {/* Remove */}
            <button
              onClick={() => removeSlice(slice.id)}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors opacity-0 group-hover:opacity-100"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              title="Eliminar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={addSlice}
          disabled={slices.length >= 20}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: slices.length >= 20 ? "var(--btn-dis)" : "var(--btn-primary)",
            color: slices.length >= 20 ? "var(--btn-dis-txt)" : "var(--btn-text)",
            cursor: slices.length >= 20 ? "not-allowed" : "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Agregar casilla
        </button>
        {slices.length >= 20 && (
          <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>Máximo 20 casillas</p>
        )}
      </div>
    </div>
  );
}

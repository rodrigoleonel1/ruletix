"use client";

import { WheelSlice } from "./Wheel";

interface WinnerModalProps {
  winner: WheelSlice;
  onClose: () => void;
}

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const textColor = getTextColor(winner.color);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--modal-bg)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="winner-card w-full max-w-xs rounded-2xl overflow-hidden shadow-xl"
        style={{ background: "var(--modal-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color strip */}
        <div className="px-8 py-8 text-center" style={{ background: winner.color }}>
          <p
            className="font-bold text-3xl leading-tight break-words"
            style={{ color: textColor }}
          >
            {winner.text}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-center text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            ¡Ganó esta casilla!
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: "var(--btn-primary)", color: "var(--btn-text)" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

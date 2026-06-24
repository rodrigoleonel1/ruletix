(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/Wheel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Wheel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Wheel({ slices, isSpinning, spinAngle, onSpinStart, theme }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDragging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTimestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const angularVelocity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const currentDisplayAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(spinAngle);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Wheel.useEffect": ()=>{
            const update = {
                "Wheel.useEffect.update": ()=>{
                    const vw = window.innerWidth;
                    if (vw < 400) setSize(Math.min(vw - 48, 360));
                    else if (vw < 640) setSize(440);
                    else if (vw < 1024) setSize(560);
                    else setSize(680);
                }
            }["Wheel.useEffect.update"];
            update();
            window.addEventListener("resize", update);
            return ({
                "Wheel.useEffect": ()=>window.removeEventListener("resize", update)
            })["Wheel.useEffect"];
        }
    }["Wheel.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Wheel.useEffect": ()=>{
            currentDisplayAngle.current = spinAngle;
        }
    }["Wheel.useEffect"], [
        spinAngle
    ]);
    const drawWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[drawWheel]": (angle)=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            // Read CSS variables so the canvas respects dark/light mode
            const style = getComputedStyle(document.documentElement);
            const colorBorder = style.getPropertyValue("--wheel-border").trim() || "#d6d3d1";
            const colorHub = style.getPropertyValue("--wheel-hub").trim() || "#ffffff";
            const colorBg = style.getPropertyValue("--bg").trim() || "#f5f5f4";
            const colorMuted = style.getPropertyValue("--text-muted").trim() || "#78716c";
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
            const sliceAngle = Math.PI * 2 / n;
            slices.forEach({
                "Wheel.useCallback[drawWheel]": (slice, i)=>{
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
                    const lines = [];
                    let line = "";
                    words.forEach({
                        "Wheel.useCallback[drawWheel]": (w)=>{
                            const test = line ? `${line} ${w}` : w;
                            if (ctx.measureText(test).width > maxW && line) {
                                lines.push(line);
                                line = w;
                            } else {
                                line = test;
                            }
                        }
                    }["Wheel.useCallback[drawWheel]"]);
                    if (line) lines.push(line);
                    const lh = fontSize * 1.25;
                    lines.forEach({
                        "Wheel.useCallback[drawWheel]": (l, li)=>{
                            ctx.fillText(l, 0, (li - (lines.length - 1) / 2) * lh, maxW);
                        }
                    }["Wheel.useCallback[drawWheel]"]);
                    ctx.restore();
                }
            }["Wheel.useCallback[drawWheel]"]);
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
        }
    }["Wheel.useCallback[drawWheel]"], [
        slices
    ]);
    // Depend on size so this runs after the canvas gets its real dimensions on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Wheel.useEffect": ()=>{
            if (size === null) return;
            const id = requestAnimationFrame({
                "Wheel.useEffect.id": ()=>drawWheel(spinAngle * Math.PI / 180)
            }["Wheel.useEffect.id"]);
            return ({
                "Wheel.useEffect": ()=>cancelAnimationFrame(id)
            })["Wheel.useEffect"];
        }
    }["Wheel.useEffect"], [
        slices,
        spinAngle,
        drawWheel,
        size,
        theme
    ]);
    const getAngle = (e, canvas)=>{
        const rect = canvas.getBoundingClientRect();
        return Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2));
    };
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleMouseDown]": (e)=>{
            if (isSpinning) return;
            isDragging.current = true;
            lastAngle.current = getAngle(e.nativeEvent, canvasRef.current);
            lastTimestamp.current = performance.now();
            angularVelocity.current = 0;
        }
    }["Wheel.useCallback[handleMouseDown]"], [
        isSpinning
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleMouseMove]": (e)=>{
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
        }
    }["Wheel.useCallback[handleMouseMove]"], [
        isSpinning,
        drawWheel
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleMouseUp]": ()=>{
            if (!isDragging.current) return;
            isDragging.current = false;
            const vel = angularVelocity.current * (180 / Math.PI) * 16;
            if (Math.abs(vel) > 30) onSpinStart(vel * 60);
        }
    }["Wheel.useCallback[handleMouseUp]"], [
        onSpinStart
    ]);
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleTouchStart]": (e)=>{
            if (isSpinning) return;
            const t = e.touches[0];
            isDragging.current = true;
            lastAngle.current = getAngle(t, canvasRef.current);
            lastTimestamp.current = performance.now();
            angularVelocity.current = 0;
        }
    }["Wheel.useCallback[handleTouchStart]"], [
        isSpinning
    ]);
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleTouchMove]": (e)=>{
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
        }
    }["Wheel.useCallback[handleTouchMove]"], [
        isSpinning,
        drawWheel
    ]);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Wheel.useCallback[handleTouchEnd]": ()=>{
            if (!isDragging.current) return;
            isDragging.current = false;
            const vel = angularVelocity.current * (180 / Math.PI) * 16;
            if (Math.abs(vel) > 20) onSpinStart(vel * 60);
        }
    }["Wheel.useCallback[handleTouchEnd]"], [
        onSpinStart
    ]);
    // Don't render until we know the viewport size
    if (size === null) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 500,
            height: 500
        }
    }, void 0, false, {
        fileName: "[project]/app/components/Wheel.tsx",
        lineNumber: 236,
        columnNumber: 29
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute z-10",
                style: {
                    right: -2,
                    top: "50%",
                    transform: "translateY(-50%)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 0,
                        height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderRight: "24px solid var(--pointer)"
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/Wheel.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Wheel.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                width: size,
                height: size,
                className: "cursor-grab active:cursor-grabbing select-none touch-none",
                style: {
                    borderRadius: "50%",
                    display: "block"
                },
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
                onTouchStart: handleTouchStart,
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd
            }, void 0, false, {
                fileName: "[project]/app/components/Wheel.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Wheel.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_s(Wheel, "GkHV/2Cg8F9xSS7fJ177AqyxFec=");
_c = Wheel;
var _c;
__turbopack_context__.k.register(_c, "Wheel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Wheel.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/components/Wheel.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_components_Wheel_tsx_09_n8jf._.js.map
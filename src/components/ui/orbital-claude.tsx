import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { BuildrsIcon, BrandIcons, ClaudeIcon } from "./icons";

// Brand colors for each icon
const COLORS = {
  claude:    "#CC9B7A",
  claudeCode:"#09090b",
  anthropic: "#CC9B7A",
  vercel:    "#000000",
  stripe:    "#635BFF",
  resend:    "#000000",
  supabase:  "#3ECF8E",
  github:    "#24292F",
};

// Inner orbit — 3 Claude-ecosystem products
const innerNodes = [
  {
    id: "claude",
    render: (s: number) => <BrandIcons.claude style={{ width: s, height: s, color: COLORS.claude }} />,
  },
  {
    id: "claudecode",
    render: (s: number) => <Terminal size={s} strokeWidth={1.5} style={{ color: COLORS.claudeCode }} />,
  },
  {
    id: "anthropic",
    render: (s: number) => <BrandIcons.anthropic style={{ width: s, height: s, color: COLORS.anthropic }} />,
  },
];

// Outer orbit — 5 stack tools
const outerNodes = [
  { id: "vercel",   render: (s: number) => <BrandIcons.vercel   style={{ width: s, height: s, color: COLORS.vercel   }} /> },
  { id: "stripe",   render: (s: number) => <BrandIcons.stripe   style={{ width: s, height: s, color: COLORS.stripe   }} /> },
  { id: "resend",   render: (s: number) => <BrandIcons.resend   style={{ width: s, height: s, color: COLORS.resend   }} /> },
  { id: "supabase", render: (s: number) => <BrandIcons.supabase style={{ width: s, height: s, color: COLORS.supabase }} /> },
  { id: "github",   render: (s: number) => <BrandIcons.github   style={{ width: s, height: s, color: COLORS.github   }} /> },
];

export function OrbitalClaude() {
  const [innerAngle, setInnerAngle] = useState(0);
  const [outerAngle, setOuterAngle] = useState(180);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(360);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(420, Math.max(280, w)));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Inner: ~10s CW, Outer: ~22s CCW
  useEffect(() => {
    const id = setInterval(() => {
      setInnerAngle((a) => (a + 0.6) % 360);
      setOuterAngle((a) => (a - 0.3 + 360) % 360);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const CENTER_TILE = 64;
  const INNER_TILE  = 42;
  const OUTER_TILE  = 38;

  const innerRadius = size * 0.255;
  const outerRadius = size * 0.435;

  // True circular orbit — no y-compression
  const pos = (i: number, count: number, angle: number, radius: number) => {
    const deg = ((i / count) * 360 + angle) % 360;
    const rad = (deg * Math.PI) / 180;
    const depth = Math.cos(rad);
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      opacity: 0.45 + 0.55 * ((1 + depth) / 2),
      z: Math.round(10 + 20 * ((1 + depth) / 2)),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex items-center justify-center"
      style={{ width: "100%", maxWidth: 420, height: size, background: "transparent" }}
    >
      {/* Outer dashed ring */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: outerRadius * 2,
          height: outerRadius * 2,
          borderRadius: "50%",
          border: "1px dashed rgba(0,0,0,0.1)",
        }}
      />
      {/* Inner dashed ring */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: innerRadius * 2,
          height: innerRadius * 2,
          borderRadius: "50%",
          border: "1px dashed rgba(0,0,0,0.15)",
        }}
      />

      {/* Center — Buildrs */}
      <div className="absolute z-30 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center rounded-2xl"
          style={{
            width: CENTER_TILE,
            height: CENTER_TILE,
            background: "#09090b",
            border: "1px solid rgba(0,0,0,0.12)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          }}
        >
          <BuildrsIcon color="#ffffff" size={28} />
        </div>
      </div>

      {/* Inner orbit — Claude ecosystem */}
      {innerNodes.map((node, i) => {
        const { x, y, opacity, z } = pos(i, innerNodes.length, innerAngle, innerRadius);
        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: INNER_TILE,
              height: INNER_TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity,
              zIndex: z,
              transition: "transform 50ms linear, opacity 50ms linear",
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {node.render(20)}
            </div>
          </div>
        );
      })}

      {/* Outer orbit — Stack tools */}
      {outerNodes.map((node, i) => {
        const { x, y, opacity, z } = pos(i, outerNodes.length, outerAngle, outerRadius);
        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: OUTER_TILE,
              height: OUTER_TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: opacity * 0.8,
              zIndex: z,
              transition: "transform 50ms linear, opacity 50ms linear",
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              {node.render(17)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── OrbitalStack — Claude at center, single ring of tools ────────────────────

const stackNodes = [
  { id: "vercel",   render: (s: number) => <BrandIcons.vercel   style={{ width: s, height: s, color: COLORS.vercel   }} /> },
  { id: "stripe",   render: (s: number) => <BrandIcons.stripe   style={{ width: s, height: s, color: COLORS.stripe   }} /> },
  { id: "supabase", render: (s: number) => <BrandIcons.supabase style={{ width: s, height: s, color: COLORS.supabase }} /> },
  { id: "github",   render: (s: number) => <BrandIcons.github   style={{ width: s, height: s, color: COLORS.github   }} /> },
  { id: "resend",   render: (s: number) => <BrandIcons.resend   style={{ width: s, height: s, color: COLORS.resend   }} /> },
  { id: "claudecode", render: (s: number) => <Terminal size={s} strokeWidth={1.5} style={{ color: COLORS.claudeCode }} /> },
];

export function OrbitalStack() {
  const [angle, setAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(340);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(380, Math.max(260, w)));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.45) % 360), 50);
    return () => clearInterval(id);
  }, []);

  const CENTER_TILE = 64;
  const NODE_TILE = 42;
  const radius = size * 0.4;

  const pos = (i: number) => {
    const deg = ((i / stackNodes.length) * 360 + angle) % 360;
    const rad = (deg * Math.PI) / 180;
    const depth = Math.cos(rad);
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      opacity: 0.45 + 0.55 * ((1 + depth) / 2),
      z: Math.round(10 + 20 * ((1 + depth) / 2)),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex items-center justify-center"
      style={{ width: "100%", maxWidth: 380, height: size, background: "transparent" }}
    >
      {/* Dashed ring */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          border: "1px dashed rgba(0,0,0,0.12)",
        }}
      />

      {/* Center — Claude */}
      <div className="absolute z-30 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center rounded-2xl"
          style={{
            width: CENTER_TILE,
            height: CENTER_TILE,
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.09)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          <BrandIcons.claude style={{ width: 32, height: 32, color: COLORS.claude }} />
        </div>
      </div>

      {/* Orbiting stack tools */}
      {stackNodes.map((node, i) => {
        const { x, y, opacity, z } = pos(i);
        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: NODE_TILE,
              height: NODE_TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity,
              zIndex: z,
              transition: "transform 50ms linear, opacity 50ms linear",
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {node.render(20)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

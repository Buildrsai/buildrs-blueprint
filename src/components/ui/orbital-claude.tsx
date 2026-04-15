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

      {/* Center — Claude logo blanc sur fond sombre */}
      <div className="absolute z-30 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{
            width: CENTER_TILE,
            height: CENTER_TILE,
            borderRadius: "50%",
            background: "#09090b",
            boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
            <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
          </svg>
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

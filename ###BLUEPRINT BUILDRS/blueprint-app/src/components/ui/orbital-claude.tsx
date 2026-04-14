import { useState, useEffect, useRef } from "react";
import { BrandIcons } from "./icons";

const nodes = [
  { id: 1, Icon: BrandIcons.resend },
  { id: 2, Icon: BrandIcons.supabase },
  { id: 3, Icon: BrandIcons.github },
  { id: 4, Icon: BrandIcons.cloudflare },
  { id: 5, Icon: BrandIcons.vercel },
  { id: 6, Icon: BrandIcons.stripe },
];

export function OrbitalClaude() {
  const [angle, setAngle] = useState(0);
  const [size, setSize] = useState(460);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(460, Math.max(300, w)));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ~12s per full rotation
  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.5) % 360), 50);
    return () => clearInterval(id);
  }, []);

  // Orbit radius: half the container minus tile half-width
  const TILE = 48;
  const radius = size / 2 - TILE / 2 - 8;

  const pos = (i: number) => {
    const deg = ((i / nodes.length) * 360 + angle) % 360;
    const rad = (deg * Math.PI) / 180;
    const depth = Math.cos(rad); // -1 back, +1 front
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      opacity: 0.5 + 0.5 * ((1 + depth) / 2),
      z: Math.round(10 + 20 * depth),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex items-center justify-center"
      style={{ width: "100%", maxWidth: 460, height: size, background: "transparent" }}
    >
      {/* Dashed orbit ring */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: radius * 2,
          height: radius * 2,
          border: "1px dashed rgba(255,255,255,0.12)",
        }}
      />

      {/* Claude center — rounded square tile, purple glow */}
      <div className="absolute z-20 flex items-center justify-center">
        {/* Purple glow */}
        <div
          className="pointer-events-none absolute rounded-2xl"
          style={{
            width: 90, height: 90,
            background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        {/* Tile */}
        <div
          className="relative flex items-center justify-center rounded-2xl"
          style={{
            width: 72, height: 72,
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 0 1px rgba(168,85,247,0.15), 0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <BrandIcons.claude style={{ width: 36, height: 36, color: "#fff" }} />
        </div>
      </div>

      {/* Orbiting brand icon tiles */}
      {nodes.map((node, i) => {
        const { x, y, opacity, z } = pos(i);
        const Icon = node.Icon;
        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: TILE,
              height: TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity,
              zIndex: z,
              transition: "transform 50ms linear, opacity 50ms linear",
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-2xl"
              style={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <Icon style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

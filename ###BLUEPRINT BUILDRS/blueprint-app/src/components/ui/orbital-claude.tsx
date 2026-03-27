import { useState, useEffect, useRef } from "react";
import {
  Code2, Palette, ShieldCheck,
  Megaphone, Lightbulb, Rocket, DollarSign, TrendingUp,
} from "lucide-react";
import { BrandIcons } from "./icons";

interface OrbitalNode {
  id: number;
  title: string;
  Icon: React.ElementType;
}

const nodes: OrbitalNode[] = [
  { id: 1, title: "Idées",       Icon: Lightbulb },
  { id: 2, title: "Design",      Icon: Palette },
  { id: 3, title: "Code",        Icon: Code2 },
  { id: 4, title: "Sécurité",    Icon: ShieldCheck },
  { id: 5, title: "Déploiement", Icon: Rocket },
  { id: 6, title: "Marketing",   Icon: Megaphone },
  { id: 7, title: "Revenus",     Icon: DollarSign },
  { id: 8, title: "Lancement",   Icon: TrendingUp },
];

// Label safe-zone: wider margin now that labels are short
const LABEL_MARGIN = 52;
const NODE_RADIUS = 20; // half of 40px circle

export function OrbitalClaude() {
  const [angle, setAngle] = useState(0);
  const [size, setSize] = useState(480);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive size
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(480, Math.max(300, w)));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Rotation — faster: 0.5° per tick
  useEffect(() => {
    const timer = setInterval(() => {
      setAngle(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Radius leaves enough room for circles + labels on all sides
  const radius = (size / 2) - NODE_RADIUS - LABEL_MARGIN;

  const getPos = (index: number, total: number) => {
    const deg = ((index / total) * 360 + angle) % 360;
    const rad = (deg * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      // Opacity: front = 1, back = 0.6
      opacity: Math.max(0.6, 0.6 + 0.4 * ((1 + Math.sin(rad)) / 2)),
      z: Math.round(10 + 20 * Math.cos(rad)),
    };
  };

  const orbitDiameter = radius * 2;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex items-center justify-center rounded-2xl"
      style={{
        width: "100%",
        maxWidth: 480,
        height: size,
        background: "hsl(var(--card))",
      }}
    >
      {/* Orbit ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: orbitDiameter,
          height: orbitDiameter,
          border: "1px solid hsl(var(--border))",
        }}
      />

      {/* Center — Claude */}
      <div className="absolute z-20 flex items-center justify-center">
        {/* Ping rings (colored) */}
        <div
          className="absolute rounded-full"
          style={{
            width: 76, height: 76,
            border: "1px solid rgba(168,85,247,0.35)",
            animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 92, height: 92,
            border: "1px solid rgba(59,130,246,0.2)",
            animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            animationDelay: "0.7s",
          }}
        />
        {/* Gradient circle */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 60, height: 60,
            background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #14b8a6 100%)",
            animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        >
          <BrandIcons.claude style={{ width: 30, height: 30, color: "#ffffff" }} />
        </div>
      </div>

      {/* Orbital nodes */}
      {nodes.map((node, i) => {
        const { x, y, opacity, z } = getPos(i, nodes.length);
        const Icon = node.Icon;
        return (
          <div
            key={node.id}
            className="absolute flex flex-col items-center"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity,
              zIndex: z,
              transition: "transform 50ms linear",
            }}
          >
            {/* Circle */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
                boxShadow: "0 1px 8px hsl(var(--foreground) / 0.06)",
              }}
            >
              <Icon size={15} strokeWidth={1.5} />
            </div>
            {/* Label */}
            <p
              className="mt-1.5 whitespace-nowrap font-medium"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.025em",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {node.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

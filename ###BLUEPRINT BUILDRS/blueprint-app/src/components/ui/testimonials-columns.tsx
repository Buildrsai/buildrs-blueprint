"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  text: string;
  name: string;
  role: string;
};

const AVATAR_COLORS = [
  "bg-stone-200 text-stone-700",
  "bg-zinc-200 text-zinc-700",
  "bg-neutral-200 text-neutral-700",
  "bg-slate-200 text-slate-700",
  "bg-gray-200 text-gray-700",
  "bg-stone-300 text-stone-800",
  "bg-zinc-300 text-zinc-800",
  "bg-neutral-300 text-neutral-800",
  "bg-slate-300 text-slate-800",
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 10,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {testimonials.map(({ text, name, role }, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-border bg-card shadow-sm max-w-xs w-full"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", getAvatarColor(name))}>
                    {getInitials(name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight text-foreground">
                      {name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

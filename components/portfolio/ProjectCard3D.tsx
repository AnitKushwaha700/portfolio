"use client";

import React, { useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface ProjectCard3DProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProjectCard3D({
  children,
  className = "",
}: ProjectCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Max 10 deg tilt on X and Y
      setRotate({
        x: -y * 10,
        y: x * 10,
      });
    },
    [prefersReducedMotion],
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsHovered(true);
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  }, []);

  if (prefersReducedMotion) {
    return <div className={`relative h-full ${className}`}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full transition-transform duration-300 will-change-transform ${className}`}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered
          ? "transform 100ms ease-out"
          : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      {children}
    </div>
  );
}


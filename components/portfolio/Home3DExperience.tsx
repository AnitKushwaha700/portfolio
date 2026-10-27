"use client";

import dynamic from "next/dynamic";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
});

export default function Home3DExperience() {
  return (
    <>
      {/* Full-Page Background 3D Cyber Vortex Canvas */}
      <Hero3DCanvas />
    </>
  );
}

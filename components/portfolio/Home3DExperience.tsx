"use client";

import { useSyncExternalStore } from "react";
import Hero3DCanvas from "./Hero3DCanvas";

const emptySubscribe = () => () => {};

export default function Home3DExperience() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  return (
    <>
      {/* Full-Page Background 3D Cyber Vortex Canvas */}
      <Hero3DCanvas />
    </>
  );
}

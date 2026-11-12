"use client";

import { useSyncExternalStore } from "react";
import Hero3DCanvas from "./Hero3DCanvas";

const emptySubscribe = () => () => {};

export default function Home3DExperience() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <>
      {/* Full-Page Background 3D Cyber Vortex Canvas */}
      <Hero3DCanvas />
    </>
  );
}

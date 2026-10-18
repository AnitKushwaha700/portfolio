"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    try {
      const glInit = renderer.getContext();
      if (glInit && "pixelStorei" in glInit) {
        glInit.pixelStorei(glInit.UNPACK_FLIP_Y_WEBGL, false);
        glInit.pixelStorei(glInit.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
    } catch {
      // ignore
    }

    // Master Groups
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Cyber Vortex Group
    let isMobile = width < 1024;

    const vortexGroup = new THREE.Group();
    vortexGroup.position.set(0, 0.05, 0);
    const initialScale = isMobile ? 0.78 : 1.18;
    vortexGroup.scale.set(initialScale, initialScale, initialScale);
    masterGroup.add(vortexGroup);

    // Initial 3D tilt (facing forward with slight upward angle)
    const baseTiltX = 0.2;
    const baseTiltY = 0;
    vortexGroup.rotation.x = baseTiltX;
    vortexGroup.rotation.y = baseTiltY;

    // --- 1. Concentric Cyber Rings ---
    // Ring A: Inner intense glowing crimson core
    const coreGeometry = new THREE.TorusGeometry(1.65, 0.045, 16, 100);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1e56,
      transparent: true,
      opacity: 0.85,
    });
    const coreRing = new THREE.Mesh(coreGeometry, coreMaterial);
    vortexGroup.add(coreRing);

    // Ring B: Inner secondary thin ring
    const innerThinGeom = new THREE.RingGeometry(1.42, 1.45, 64);
    const innerThinMat = new THREE.MeshBasicMaterial({
      color: 0xff5e3a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const innerThinRing = new THREE.Mesh(innerThinGeom, innerThinMat);
    vortexGroup.add(innerThinRing);

    // Ring C: Segmented Sci-Fi Notched Ring
    const segmentedGroup = new THREE.Group();
    const segmentsCount = 18;
    const radiusSegmented = 2.1;
    for (let i = 0; i < segmentsCount; i++) {
      if (i % 3 === 0) continue; // gaps create dashed tech look
      const startAngle = (i / segmentsCount) * Math.PI * 2;
      const angleLength = (0.75 / segmentsCount) * Math.PI * 2;
      const arcGeom = new THREE.RingGeometry(
        radiusSegmented,
        radiusSegmented + 0.1,
        16,
        1,
        startAngle,
        angleLength,
      );
      const arcMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff2a5f : 0x7928ca,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const arcMesh = new THREE.Mesh(arcGeom, arcMat);
      segmentedGroup.add(arcMesh);
    }
    vortexGroup.add(segmentedGroup);

    // Ring D: Outer wide HUD Ring with tick marks
    const outerRingGeom = new THREE.TorusGeometry(2.7, 0.02, 16, 120);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.5,
    });
    const outerRing = new THREE.Mesh(outerRingGeom, outerRingMat);
    vortexGroup.add(outerRing);

    // Outer cyber tick marks
    const ticksCount = 36;
    const ticksRadius = 2.85;
    const tickGeom = new THREE.BufferGeometry();
    const tickPositions: number[] = [];
    for (let i = 0; i < ticksCount; i++) {
      const angle = (i / ticksCount) * Math.PI * 2;
      const len = i % 4 === 0 ? 0.2 : 0.09;
      const r1 = ticksRadius;
      const r2 = ticksRadius + len;
      tickPositions.push(
        Math.cos(angle) * r1,
        Math.sin(angle) * r1,
        0,
        Math.cos(angle) * r2,
        Math.sin(angle) * r2,
        0,
      );
    }
    tickGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(tickPositions, 3),
    );
    const tickMat = new THREE.LineBasicMaterial({
      color: 0xff3b69,
      transparent: true,
      opacity: 0.65,
    });
    const tickLines = new THREE.LineSegments(tickGeom, tickMat);
    vortexGroup.add(tickLines);

    // Ring E: Orbiting Cyber Spark Particles
    const sparkCount = 52;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkRadii: number[] = [];
    const sparkSpeeds: number[] = [];
    const sparkAngles: number[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const r = 1.6 + Math.random() * 1.35;
      const angle = Math.random() * Math.PI * 2;
      sparkRadii.push(r);
      sparkAngles.push(angle);
      sparkSpeeds.push((Math.random() * 0.02 + 0.008) * (i % 2 === 0 ? 1 : -1));

      sparkPositions[i * 3] = Math.cos(angle) * r;
      sparkPositions[i * 3 + 1] = Math.sin(angle) * r;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }

    const sparkGeom = new THREE.BufferGeometry();
    sparkGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(sparkPositions, 3),
    );

    // Custom circular spark texture
    const sparkCanvas = document.createElement("canvas");
    sparkCanvas.width = 32;
    sparkCanvas.height = 32;
    const sparkCtx = sparkCanvas.getContext("2d");
    if (sparkCtx) {
      const gradient = sparkCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 60, 100, 0.9)");
      gradient.addColorStop(0.8, "rgba(255, 30, 80, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      sparkCtx.fillStyle = gradient;
      sparkCtx.fillRect(0, 0, 32, 32);
    }
    const sparkTexture = new THREE.CanvasTexture(sparkCanvas);
    sparkTexture.flipY = false;
    sparkTexture.premultiplyAlpha = false;

    const sparkMat = new THREE.PointsMaterial({
      size: 0.18,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparkPoints = new THREE.Points(sparkGeom, sparkMat);
    vortexGroup.add(sparkPoints);

    // --- 2. Background Constellation & Star Mesh Network ---
    const constellationGroup = new THREE.Group();
    masterGroup.add(constellationGroup);

    const nodeCount = isMobile ? 70 : 130;
    const nodeCoords: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 10 - 2;
      const vec = new THREE.Vector3(x, y, z);
      nodeCoords.push(vec);
      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002,
        ),
      );
    }

    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3),
    );

    const nodeMat = new THREE.PointsMaterial({
      size: 0.11,
      color: 0xff6b8b,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const nodePoints = new THREE.Points(nodeGeom, nodeMat);
    constellationGroup.add(nodePoints);

    // Dynamic Line Mesh connecting close nodes
    const maxLines = nodeCount * 4;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    lineGeom.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage),
    );

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(lineGeom, lineMat);
    constellationGroup.add(constellationLines);

    // Vortex stays anchored in the center behind the hero avatar
    const vortexTargetX = 0;
    vortexGroup.position.x = vortexTargetX;

    let scrollProgress = 0;
    let targetScrollRotX = baseTiltX;
    let targetScrollRotY = baseTiltY;
    let targetScrollRotZ = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      if (!prefersReducedMotion) {
        // Continuous 3D rotation with scroll
        targetScrollRotX = baseTiltX + scrollProgress * Math.PI * 1.5;
        targetScrollRotY = baseTiltY + scrollProgress * Math.PI * 2;
        targetScrollRotZ = scrollProgress * Math.PI * 0.8;
      }
    };

    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = normX * 0.55;
      targetCameraY = normY * 0.35;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      isMobile = width < 1024;
      const scaleVal = isMobile ? 0.78 : 1.18;
      vortexGroup.scale.set(scaleVal, scaleVal, scaleVal);
      vortexGroup.position.set(0, 0.05, 0);
    };

    window.addEventListener("resize", handleResize);

    // --- 4. Animation Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = (now - startTime) / 1000;

      // Continuous ambient rotation of rings
      const spinSpeed = prefersReducedMotion ? 0.05 : 0.45;
      coreRing.rotation.z += delta * spinSpeed;
      segmentedGroup.rotation.z -= delta * (spinSpeed * 0.85);
      outerRing.rotation.z += delta * (spinSpeed * 0.35);
      tickLines.rotation.z += delta * (spinSpeed * 0.25);

      // Orbiting sparks
      const sparkPosAttr = sparkGeom.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < sparkCount; i++) {
        sparkAngles[i] += sparkSpeeds[i] * (prefersReducedMotion ? 0.2 : 1);
        const r = sparkRadii[i];
        sparkPosAttr.setXYZ(
          i,
          Math.cos(sparkAngles[i]) * r,
          Math.sin(sparkAngles[i]) * r,
          Math.sin(time * 2 + i) * 0.25,
        );
      }
      sparkPosAttr.needsUpdate = true;

      // Scroll-driven synchronized 3D rotation
      if (!prefersReducedMotion) {
        vortexGroup.position.x +=
          (vortexTargetX - vortexGroup.position.x) * 0.08;

        vortexGroup.rotation.x +=
          (targetScrollRotX - vortexGroup.rotation.x) * 0.08;
        vortexGroup.rotation.y +=
          (targetScrollRotY - vortexGroup.rotation.y) * 0.08;
        vortexGroup.rotation.z +=
          (targetScrollRotZ - vortexGroup.rotation.z) * 0.08;

        constellationGroup.rotation.y +=
          (scrollProgress * Math.PI * 0.8 - constellationGroup.rotation.y) *
          0.05;
        constellationGroup.rotation.x +=
          (scrollProgress * Math.PI * 0.5 - constellationGroup.rotation.x) *
          0.05;

        // Mouse Parallax lerp
        camera.position.x += (targetCameraX - camera.position.x) * 0.05;
        camera.position.y += (targetCameraY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // Constellation node drift and line mesh computation
      let lineIndex = 0;
      const nodePosAttr = nodeGeom.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < nodeCount; i++) {
        const c = nodeCoords[i];
        const v = nodeVelocities[i];

        if (!prefersReducedMotion) {
          c.add(v);
          if (Math.abs(c.x) > 12) v.x *= -1;
          if (Math.abs(c.y) > 8) v.y *= -1;
          if (Math.abs(c.z) > 5) v.z *= -1;
        }

        nodePosAttr.setXYZ(i, c.x, c.y, c.z);

        // Find close neighbors and build lines
        for (let j = i + 1; j < nodeCount; j++) {
          const c2 = nodeCoords[j];
          const dist = c.distanceTo(c2);
          const maxDist = 2.6;

          if (dist < maxDist && lineIndex < maxLines) {
            const alpha = 1.0 - dist / maxDist;
            const idx = lineIndex * 6;

            linePositions[idx] = c.x;
            linePositions[idx + 1] = c.y;
            linePositions[idx + 2] = c.z;
            linePositions[idx + 3] = c2.x;
            linePositions[idx + 4] = c2.y;
            linePositions[idx + 5] = c2.z;

            // Gradient line color: blend between tech crimson and indigo
            const r = 0.95 * alpha;
            const g = 0.25 * alpha;
            const b = 0.55 * alpha;

            lineColors[idx] = r;
            lineColors[idx + 1] = g;
            lineColors[idx + 2] = b;
            lineColors[idx + 3] = r * 0.7;
            lineColors[idx + 4] = g * 0.7;
            lineColors[idx + 5] = b * 1.2;

            lineIndex++;
          }
        }
      }

      nodePosAttr.needsUpdate = true;
      lineGeom.setDrawRange(0, lineIndex * 2);
      (lineGeom.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (lineGeom.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      try {
        const glContext = renderer.getContext();
        if (glContext && "pixelStorei" in glContext) {
          glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, false);
          glContext.pixelStorei(
            glContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            false,
          );
        }
      } catch {
        // ignore
      }

      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerThinGeom.dispose();
      innerThinMat.dispose();
      outerRingGeom.dispose();
      outerRingMat.dispose();
      tickGeom.dispose();
      tickMat.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      sparkTexture.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
}
